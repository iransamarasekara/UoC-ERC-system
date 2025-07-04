// filepath: /d:/GithubDesktop/UoC-ERC-system/server/migrations/YYYYMMDDHHMMSS-create-applicant.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Applicants", {
      applicant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      contact_details: {
        type: Sequelize.STRING,
      },
      applicant_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      registration_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Applicants");
  },
};
