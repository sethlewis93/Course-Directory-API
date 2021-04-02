"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Courses extends Sequelize.Model {}
  Courses.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  Courses.associate = (models) => {
    Courses.belongsTo(models.Users, {
      as: "student",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Courses;
};
