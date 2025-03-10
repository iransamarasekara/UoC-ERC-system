"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "Applications", // table name
      "equity_date", // old column name
      "expiry_date" // new column name
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "Applications", // table name
      "expiry_date", // new column name
      "equity_date" // old column name
    );
  },
};
