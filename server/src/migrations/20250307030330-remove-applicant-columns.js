"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove both columns from the Applicants table
    await queryInterface.removeColumn("Applicants", "contact_details");
    await queryInterface.removeColumn("Applicants", "registration_date");
  },

  async down(queryInterface, Sequelize) {
    // Add the columns back if we need to rollback
    await queryInterface.addColumn("Applicants", "contact_details", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Applicants", "registration_date", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
