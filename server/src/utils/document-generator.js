const PDFDocument = require('pdfkit');

// Function to generate PDF approval letter
const generateApprovalLetter = (application, isExpedited = false) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: 'A4'
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add University logo/header
      doc.fontSize(16).font('Helvetica-Bold').text('University of Colombo', { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text('Faculty of Medicine', { align: 'center' });
      doc.fontSize(12).font('Helvetica-Bold').text('Ethics Review Committee', { align: 'center' });
      
      doc.moveDown(2);
      
      // Current date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.fontSize(10).font('Helvetica').text(`Date: ${currentDate}`, { align: 'right' });
      
      doc.moveDown();
      
      // Reference number
      doc.text(`Reference: ERC/${application.application_id}/${new Date().getFullYear()}`, { align: 'left' });
      
      doc.moveDown();
      
      // Applicant details
      doc.text(`${application.applicant.user.first_name} ${application.applicant.user.last_name}`);
      doc.text(`${application.applicant.user.email}`);
      
      doc.moveDown(2);
      
      // Letter subject
      doc.fontSize(12).font('Helvetica-Bold').text(`RE: ${isExpedited ? 'EXPEDITED APPROVAL' : 'APPROVAL'} OF RESEARCH PROJECT`, { align: 'center' });
      doc.fontSize(12).font('Helvetica-Bold').text(`"${application.title}"`, { align: 'center' });
      
      doc.moveDown();
      
      // Letter body
      doc.fontSize(10).font('Helvetica').text(
        `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},`,
        { align: 'left' }
      );
      
      doc.moveDown();
      
      doc.text(
        `This is to inform you that the Ethics Review Committee of the Faculty of Medicine, University of Colombo has ${isExpedited ? 'granted expedited approval' : 'approved'} your research project titled "${application.title}" on ${currentDate}.`,
        { align: 'justify' }
      );
      
      doc.moveDown();
      
      if (isExpedited) {
        doc.text(
          'This expedited approval has been granted as your research proposal meets the criteria for expedited review as determined by the ERC technical committee.',
          { align: 'justify' }
        );
      } else {
        doc.text(
          'This approval has been granted following a thorough review of your research proposal by the Ethics Review Committee.',
          { align: 'justify' }
        );
      }
      
      doc.moveDown();
      
      doc.text(
        'Please note that this approval is valid for a period of one year from the date of this letter. If your research extends beyond this period, you will need to apply for an extension.',
        { align: 'justify' }
      );
      
      doc.moveDown();
      
      doc.text(
        'Any changes to the approved protocol must be submitted to the ERC for review and approval before implementation.',
        { align: 'justify' }
      );
      
      doc.moveDown(2);
      
      // Signature
      doc.text('Sincerely,', { align: 'left' });
      doc.moveDown(2);
      doc.text('Chairperson', { align: 'left' });
      doc.text('Ethics Review Committee', { align: 'left' });
      doc.text('Faculty of Medicine', { align: 'left' });
      doc.text('University of Colombo', { align: 'left' });
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Function to generate PDF rejection letter
const generateRejectionLetter = (application) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: 'A4'
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add University logo/header
      doc.fontSize(16).font('Helvetica-Bold').text('University of Colombo', { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text('Faculty of Medicine', { align: 'center' });
      doc.fontSize(12).font('Helvetica-Bold').text('Ethics Review Committee', { align: 'center' });
      
      doc.moveDown(2);
      
      // Current date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.fontSize(10).font('Helvetica').text(`Date: ${currentDate}`, { align: 'right' });
      
      doc.moveDown();
      
      // Reference number
      doc.text(`Reference: ERC/${application.application_id}/${new Date().getFullYear()}`, { align: 'left' });
      
      doc.moveDown();
      
      // Applicant details
      doc.text(`${application.applicant.user.first_name} ${application.applicant.user.last_name}`);
      doc.text(`${application.applicant.user.email}`);
      
      doc.moveDown(2);
      
      // Letter subject
      doc.fontSize(12).font('Helvetica-Bold').text('RE: REJECTION OF RESEARCH PROJECT', { align: 'center' });
      doc.fontSize(12).font('Helvetica-Bold').text(`"${application.title}"`, { align: 'center' });
      
      doc.moveDown();
      
      // Letter body
      doc.fontSize(10).font('Helvetica').text(
        `Dear ${application.applicant.user.first_name} ${application.applicant.user.last_name},`,
        { align: 'left' }
      );
      
      doc.moveDown();
      
      doc.text(
        `This is to inform you that the Ethics Review Committee of the Faculty of Medicine, University of Colombo has reviewed your research project titled "${application.title}" and regrets to inform you that the application has been rejected.`,
        { align: 'justify' }
      );
      
      doc.moveDown();
      
      // Add rejection reasons if available
      if (application.admin_comments) {
        doc.text('The committee has provided the following reasons for this decision:', { align: 'justify' });
        doc.moveDown(0.5);
        doc.text(application.admin_comments, { align: 'justify', indent: 20 });
        doc.moveDown();
      }
      
      doc.text(
        'You may revise your proposal addressing these concerns and resubmit for further consideration if you wish to do so.',
        { align: 'justify' }
      );
      
      doc.moveDown(2);
      
      // Signature
      doc.text('Sincerely,', { align: 'left' });
      doc.moveDown(2);
      doc.text('Chairperson', { align: 'left' });
      doc.text('Ethics Review Committee', { align: 'left' });
      doc.text('Faculty of Medicine', { align: 'left' });
      doc.text('University of Colombo', { align: 'left' });
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateApprovalLetter,
  generateRejectionLetter
};