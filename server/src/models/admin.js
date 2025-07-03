"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // Admin belongs to one User
      Admin.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  Admin.init(
    {
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      admin_type: {
        type: DataTypes.ENUM('ERC_TECHNICAL', 'CTSC_CHAIR', 'ARWC_CHAIR'),
        allowNull: false,
      },
      committee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Committees",
          key: "committee_id",
        },
      }
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "Admins",
      timestamps: true,
      underscored: true,
    }
  );

  return Admin;
};