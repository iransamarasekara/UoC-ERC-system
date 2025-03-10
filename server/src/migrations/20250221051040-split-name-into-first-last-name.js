"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. First add the new columns
    await queryInterface.addColumn("Users", "first_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "last_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Update the data (copy name into first_name as a starting point)
    // This is a basic migration - you may want to split the name properly in production
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET "first_name" = "name",
          "last_name" = ''
    `);

    // 3. Remove the old column
    await queryInterface.removeColumn("Users", "name");
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Add the name column back
    await queryInterface.addColumn("Users", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2. Merge the data back
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET "name" = CONCAT("first_name", ' ', "last_name")
    `);

    // 3. Remove the split columns
    await queryInterface.removeColumn("Users", "first_name");
    await queryInterface.removeColumn("Users", "last_name");
  },
};
