"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Committee extends Model {
    static associate(models) {
      // Committee has many Committee Members
      Committee.hasMany(models.CommitteeMember, {
        foreignKey: "committee_id",
        as: "members",
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
      },
      committee_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Committee",
      tableName: "Committees",
      timestamps: false,
      underscored: true,
    }
  );

  return Committee;
};
