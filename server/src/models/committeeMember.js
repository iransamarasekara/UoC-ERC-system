"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommitteeMember extends Model {
    static associate(models) {
      // CommitteeMember belongs to one User
      CommitteeMember.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // CommitteeMember belongs to one Committee
      CommitteeMember.belongsTo(models.Committee, {
        foreignKey: "committee_id",
        as: "committee",
      });
      
      // CommitteeMember has many Application reviews
      CommitteeMember.hasMany(models.ApplicationReview, {
        foreignKey: "reviewer_id",
        as: "reviews",
      });
    }
  }

  CommitteeMember.init(
    {
      member_id: {
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
      committee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Committees",
          key: "committee_id",
        },
      },
      role: {
        type: DataTypes.ENUM('CHAIR', 'MEMBER', 'STAFF'),
        allowNull: false,
        defaultValue: 'MEMBER',
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    },
    {
      sequelize,
      modelName: "CommitteeMember",
      tableName: "CommitteeMembers",
      timestamps: true,
      underscored: true,
    }
  );

  return CommitteeMember;
};