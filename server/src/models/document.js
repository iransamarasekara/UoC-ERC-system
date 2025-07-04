"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      // Document belongs to an Application
      Document.belongsTo(models.Application, {
        foreignKey: "application_id",
        as: "application",
      });
    }
  }

  Document.init(
    {
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      document_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      upload_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_mandatory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Document",
      tableName: "Documents",
      timestamps: false,
      underscored: true,
    }
  );

  return Document;
};
