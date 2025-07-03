const db = require("../models");

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await db.Application.findAll();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; // Fixed missing closing bracket

exports.getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    console.log('Fetching applications with query:', { page, limit, status });
    
    // Updated to use Applicant instead of User and submission_date instead of created_at
    const { rows, count } = await db.Application.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: db.Applicant, // Changed from User to Applicant
          as: "applicant",
          attributes: ["applicant_id", "first_name", "last_name", "email"] // Update attributes
        },
        {
          model: db.Committee,
          as: "committee",
          attributes: ["committee_id", "committee_name", "committee_type"]
        }
      ],
      order: [["submission_date", "DESC"]] // Changed from created_at to submission_date
    });
    
    console.log(`Found ${count} applications`);
    
    return res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      applications: rows
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ 
      error: "Failed to fetch applications", 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

exports.getApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Find the application with all related data
    const application = await db.Application.findOne({
      where: { application_id: applicationId },
      include: [
        {
          model: db.Applicant,
          as: "applicant",
          where: { user_id: userId }, // Ensure user owns this application
        },
        {
          model: db.Review,
          as: "reviews",
          include: [
            {
              model: db.User,
              as: "reviewer",
              attributes: ["user_id", "first_name", "last_name"],
            },
          ],
          order: [["review_date", "DESC"]],
        },
        {
          model: db.Document,
          as: "documents",
        },
        {
          model: db.Payment,
          as: "payment",
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found or you do not have permission to view it",
      });
    }

    // Get the latest review status
    const latestReview =
      application.reviews && application.reviews.length > 0
        ? application.reviews[0]
        : null;

    res.status(200).json({
      success: true,
      application: {
        application_id: application.application_id,
        applicant_id: application.applicant_id,
        research_type: application.research_type,
        application_type: application.application_type,
        status: application.status,
        submission_date: application.submission_date,
        last_updated: application.last_updated,
        is_extension: application.is_extension,
        expiry_date: application.expiry_date,
        latest_review: latestReview
          ? {
              review_id: latestReview.review_id,
              comments: latestReview.comments,
              outcome: latestReview.outcome,
              review_date: latestReview.review_date,
              reviewer: latestReview.reviewer,
            }
          : null,
        documents_count: application.documents
          ? application.documents.length
          : 0,
        payment_status: application.payment
          ? application.payment.payment_status
          : "pending",
      },
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all applications for a user
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const applications = await db.Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Applicant,
          as: "applicant",
          where: { user_id: userId },
          attributes: [],
        },
        {
          model: db.Review,
          as: "reviews",
          limit: 1,
          order: [["review_date", "DESC"]],
          required: false,
        },
      ],
      order: [["submission_date", "DESC"]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.status(200).json({
      success: true,
      applications: applications.rows,
      pagination: {
        total: applications.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(applications.count / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update application status (for admin/reviewer use)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, comments } = req.body;
    const reviewerId = req.user.id;

    // Validate status
    const validStatuses = [
      "submitted",
      "review",
      "revisions",
      "approved",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: " + validStatuses.join(", "),
      });
    }

    // Check if application exists
    const application = await db.Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update application status
    await application.update({
      status: status,
      last_updated: new Date(),
    });

    // Create a review record
    const review = await db.Review.create({
      application_id: applicationId,
      reviewer_id: reviewerId,
      comments: comments || "",
      outcome: status,
      review_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: {
        application_id: application.application_id,
        status: application.status,
        last_updated: application.last_updated,
      },
      review: {
        review_id: review.review_id,
        outcome: review.outcome,
        review_date: review.review_date,
      },
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get application details with full information
exports.getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await db.Application.findOne({
      where: { application_id: applicationId },
      include: [
        {
          model: db.Applicant,
          as: "applicant",
          where: { user_id: userId },
        },
        {
          model: db.Review,
          as: "reviews",
          include: [
            {
              model: db.User,
              as: "reviewer",
              attributes: ["user_id", "first_name", "last_name", "email"],
            },
          ],
          order: [["review_date", "DESC"]],
        },
        {
          model: db.Document,
          as: "documents",
          order: [["upload_date", "DESC"]],
        },
        {
          model: db.Payment,
          as: "payment",
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found or you do not have permission to view it",
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get application statistics for dashboard
exports.getApplicationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await db.Application.findAll({
      attributes: [
        "status",
        [
          db.Application.sequelize.fn(
            "COUNT",
            db.Application.sequelize.col("status")
          ),
          "count",
        ],
      ],
      include: [
        {
          model: db.Applicant,
          as: "applicant",
          where: { user_id: userId },
          attributes: [],
        },
      ],
      group: ["status"],
      raw: true,
    });

    const statusCounts = {
      submitted: 0,
      review: 0,
      revisions: 0,
      approved: 0,
      rejected: 0,
    };

    stats.forEach((stat) => {
      if (statusCounts.hasOwnProperty(stat.status)) {
        statusCounts[stat.status] = parseInt(stat.count);
      }
    });

    const totalApplications = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        total: totalApplications,
        by_status: statusCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching application statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
