"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Committee extends Model {
    static associate(models) {
      // Committee has many CommitteeMembers
      Committee.hasMany(models.CommitteeMember, {
        foreignKey: "committee_id",
        as: "members",
      });

      // Committee has many Applications
      Committee.hasMany(models.Application, {
        foreignKey: "assigned_committee_id",
        as: "applications",
      });
    }
  }

  Committee.init(
    {
      committee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      committee_name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "committee_name",
      },
      committee_type: {
        type: DataTypes.ENUM("ERC", "CTSC", "ARWC"),
        allowNull: false,
        field: "committee_type",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Committee",
      tableName: "Committees",
      timestamps: true,
      underscored: true,
    }
  );

  return Committee;
};
