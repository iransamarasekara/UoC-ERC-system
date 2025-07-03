"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommitteeMeeting extends Model {
    static associate(models) {
      // CommitteeMeeting belongs to one Committee
      CommitteeMeeting.belongsTo(models.Committee, {
        foreignKey: "committee_id",
        as: "committee",
      });
      
      // CommitteeMeeting has many Meeting Applications
      CommitteeMeeting.hasMany(models.MeetingApplication, {
        foreignKey: "meeting_id",
        as: "applications",
      });
    }
  }

  CommitteeMeeting.init(
    {
      meeting_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      committee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Committees",
          key: "committee_id",
        },
      },
      meeting_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      agenda: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      minutes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'SCHEDULED',
      }
    },
    {
      sequelize,
      modelName: "CommitteeMeeting",
      tableName: "CommitteeMeetings",
      timestamps: true,
      underscored: true,
    }
  );

  return CommitteeMeeting;
};