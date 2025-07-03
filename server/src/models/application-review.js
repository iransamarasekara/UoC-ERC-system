"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApplicationReview extends Model {
    static associate(models) {
      // ApplicationReview belongs to one Application
      ApplicationReview.belongsTo(models.Application, {
        foreignKey: "application_id",
        as: "application",
      });

      // ApplicationReview belongs to one Reviewer (CommitteeMember)
      ApplicationReview.belongsTo(models.CommitteeMember, {
        foreignKey: "reviewer_id",
        as: "reviewer",
      });
    }
  }

  ApplicationReview.init(
    {
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Applications",
          key: "application_id",
        },
      },
      reviewer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "CommitteeMembers",
          key: "member_id",
        },
      },
      status: {
        type: DataTypes.ENUM(
          'PENDING', 
          'IN_PROGRESS', 
          'COMPLETED'
        ),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      recommendation: {
        // Changed this to remove NULL from the ENUM values
        type: DataTypes.ENUM(
          'APPROVE', 
          'REJECT', 
          'REVISE', 
          'EXPEDITE'
        ),
        // We still allow the field itself to be null
        allowNull: true,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ApplicationReview",
      tableName: "ApplicationReviews",
      timestamps: true,
      underscored: true,
    }
  );

  return ApplicationReview;
};