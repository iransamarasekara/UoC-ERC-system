"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change address column type from TEXT to STRING
    await queryInterface.changeColumn("Users", "address", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Change it back to TEXT if needed
    await queryInterface.changeColumn("Users", "address", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
