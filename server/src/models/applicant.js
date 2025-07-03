"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Applicant extends Model {
    static associate(models) {
      // Applicant belongs to one User
      Applicant.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // Applicant has many Applications
      Applicant.hasMany(models.Application, {
        foreignKey: "applicant_id",
        as: "applications",
      });
    }
  }

  Applicant.init(
    {
      applicant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      // user_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: "Users",
      //     key: "user_id",
      //   },
      // },
      applicant_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
          allowNull: false,
      },
      applicant_category: {
        type: DataTypes.ENUM(
          "academic_staff",
          "extended_faculty",
          "students",
          "pgim_trainers",
          "researcher_mou",
          "researcher_health"
        ),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      evidence_url: {
        type: DataTypes.TEXT, // Store the Cloudinary URL
        allowNull: true, // Can be null for students
      },
      evidence_public_id: {
        type: DataTypes.STRING, // Store Cloudinary public_id for deletion if needed
        allowNull: true,
      },
      application_status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Applicant",
      tableName: "Applicants",
      timestamps: false,
      underscored: true,
    }
  );

  return Applicant;
};
