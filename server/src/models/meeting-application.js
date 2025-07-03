"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MeetingApplication extends Model {
    static associate(models) {
      // MeetingApplication belongs to one Meeting
      MeetingApplication.belongsTo(models.CommitteeMeeting, {
        foreignKey: "meeting_id",
        as: "meeting",
      });
      
      // MeetingApplication belongs to one Application
      MeetingApplication.belongsTo(models.Application, {
        foreignKey: "application_id",
        as: "application",
      });
    }
  }

  MeetingApplication.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      meeting_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "CommitteeMeetings",
          key: "meeting_id",
        },
      },
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Applications",
          key: "application_id",
        },
      },
      decision: {
        type: DataTypes.ENUM('APPROVED', 'REJECTED', 'REVISE', 'PENDING'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      decision_comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ratified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: "MeetingApplication",
      tableName: "MeetingApplications",
      timestamps: true,
      underscored: true,
    }
  );

  return MeetingApplication;
};