"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "Applications", // table name
      "represent_type", // old column name
      "research_type" // new column name
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "Applications", // table name
      "research_type", // new column name
      "represent_type" // old column name
    );
  },
};
