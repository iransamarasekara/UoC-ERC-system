"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-one relationship: A user can be an applicant
      User.hasOne(models.Applicant, {
        foreignKey: "user_id",
        as: "applicant",
      });

      // One-to-many relationship: A user can be a member of multiple committees
      User.hasMany(models.CommitteeMember, {
        foreignKey: "user_id",
        as: "committeeMembers",
      });

      // A user can be a reviewer
      User.hasMany(models.Review, {
        foreignKey: "reviewer_id",
        as: "reviews",
      });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      identity_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      validity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: false,
      underscored: true,
    }
  );

  return User;
};
