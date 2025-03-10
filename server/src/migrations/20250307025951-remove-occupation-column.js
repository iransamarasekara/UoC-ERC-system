"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the occupation column from the Users table
    await queryInterface.removeColumn("Users", "occupation");
  },

  async down(queryInterface, Sequelize) {
    // Add the occupation column back if we need to rollback
    await queryInterface.addColumn("Users", "occupation", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
