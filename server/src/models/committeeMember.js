"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommitteeMember extends Model {
    static associate(models) {
      // Committee Member belongs to one User
      CommitteeMember.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // Committee Member belongs to one Committee
      CommitteeMember.belongsTo(models.Committee, {
        foreignKey: "committee_id",
        as: "committee",
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "CommitteeMember",
      tableName: "Committee_Members", // Based on your diagram naming convention
      timestamps: false,
      underscored: true,
    }
  );

  return CommitteeMember;
};
