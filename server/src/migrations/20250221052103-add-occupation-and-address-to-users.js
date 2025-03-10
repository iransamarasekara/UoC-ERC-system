"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add occupation column
    await queryInterface.addColumn("Users", "occupation", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add address column
    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns if migration needs to be reversed
    await queryInterface.removeColumn("Users", "occupation");
    await queryInterface.removeColumn("Users", "address");
  },
};
