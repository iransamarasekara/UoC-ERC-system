const db = require("../models");

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await db.Application.findAll();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await db.Application.findOne({
      where: { application_id: id },
    });
    if (application) {
      res.status(200).json(application);
    } else {
      res.status(404).json({ message: `Application with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    // Start a transaction to ensure all related data is saved consistently
    const result = await db.sequelize.transaction(async (t) => {
      // Extract application data from request body
      const {
        applicant_id,
        research_type, // Updated from represent_type to research_type
        application_type,
        status,
        submission_date,
        is_extension,
        expiry_date, // Added missing field from model
        documents, // Array of documents to be created
        payment, // Payment details if provided
      } = req.body;

      // Calculate expiry_date if not provided
      const calculatedExpiryDate =
        expiry_date ||
        (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        })();

      // Create the application
      const newApplication = await db.Application.create(
        {
          applicant_id,
          research_type,
          application_type,
          status,
          submission_date: submission_date || new Date(),
          last_updated: new Date(), // Set current date as last_updated
          is_extension: is_extension || false,
          expiry_date: calculatedExpiryDate,
        },
        { transaction: t }
      );

      // Create associated documents if provided
      let newDocuments = [];
      if (documents && documents.length > 0) {
        const documentsToCreate = documents.map((doc) => ({
          application_id: newApplication.application_id,
          document_type: doc.document_type,
          file_path: doc.file_path,
          upload_date: doc.upload_date || new Date(),
          is_mandatory: doc.is_mandatory || false,
        }));

        newDocuments = await db.Document.bulkCreate(documentsToCreate, {
          transaction: t,
        });
      }

      // Create associated payment if provided
      let newPayment = null;
      if (payment) {
        newPayment = await db.Payment.create(
          {
            application_id: newApplication.application_id,
            amount: payment.amount,
            payment_status: payment.payment_status || "Pending",
            payment_evidence: payment.payment_evidence,
            payment_date: payment.payment_date || new Date(),
          },
          { transaction: t }
        );
      }

      return {
        application: newApplication,
        documents: newDocuments,
        payment: newPayment,
      };
    });

    // Return the created data
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to create application",
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.Application.update(req.body, {
      where: { application_id: id },
    });
    if (updated) {
      const updatedApplication = await db.Application.findOne({
        where: { application_id: id },
      });
      return res.status(200).json(updatedApplication);
    }
    throw new Error("Application not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.Application.destroy({
      where: { application_id: id },
    });
    if (deleted) {
      return res.status(204).send("Application deleted");
    }
    throw new Error("Application not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
