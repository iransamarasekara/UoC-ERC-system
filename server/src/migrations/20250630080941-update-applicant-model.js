"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change applicant_category to ENUM
    await queryInterface.changeColumn("Applicants", "applicant_category", {
      type: Sequelize.ENUM(
        "academic_staff",
        "extended_faculty",
        "students",
        "pgim_trainers",
        "researcher_mou",
        "researcher_health"
      ),
      allowNull: false,
    });

    // Add evidence_url
    await queryInterface.addColumn("Applicants", "evidence_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add evidence_public_id
    await queryInterface.addColumn("Applicants", "evidence_public_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add application_status
    await queryInterface.addColumn("Applicants", "application_status", {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove new columns
    await queryInterface.removeColumn("Applicants", "evidence_url");
    await queryInterface.removeColumn("Applicants", "evidence_public_id");
    await queryInterface.removeColumn("Applicants", "application_status");

    // Change applicant_category back to STRING
    await queryInterface.changeColumn("Applicants", "applicant_category", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Drop ENUM types (optional, for clean rollback)
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Applicants_applicant_category";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_Applicants_application_status";`
    );
  },
};
