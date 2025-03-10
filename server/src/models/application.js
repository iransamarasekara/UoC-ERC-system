"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      // Application belongs to an Applicant
      Application.belongsTo(models.Applicant, {
        foreignKey: "applicant_id",
        as: "applicant",
      });

      // Application has many Documents
      Application.hasMany(models.Document, {
        foreignKey: "application_id",
        as: "documents",
      });

      // Application has one Payment
      Application.hasOne(models.Payment, {
        foreignKey: "application_id",
        as: "payment",
      });

      // Application has many Reviews
      Application.hasMany(models.Review, {
        foreignKey: "application_id",
        as: "reviews",
      });
    }
  }

  Application.init(
    {
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      applicant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      research_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      application_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_extension: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Application",
      tableName: "Applications",
      timestamps: false,
      underscored: true,
    }
  );

  return Application;
};
