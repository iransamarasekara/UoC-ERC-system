"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Review belongs to an Application
      Review.belongsTo(models.Application, {
        foreignKey: "application_id",
        as: "application",
      });

      // Review belongs to a User (Reviewer)
      Review.belongsTo(models.User, {
        foreignKey: "reviewer_id",
        as: "reviewer",
      });
    }
  }

  Review.init(
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
      },
      reviewer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      outcome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      review_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "Reviews",
      timestamps: false,
      underscored: true,
    }
  );

  return Review;
};
