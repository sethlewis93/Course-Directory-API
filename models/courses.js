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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      estimatedTime: {
        type: Sequelize.STRING,
      },

      materialsNeeded: {
        type: Sequelize.STRING,
      },
    },
    { sequelize }
  );

  Courses.associate = (models) => {
    Courses.belongsTo(models.Users, {
      as: "student",
      foreignKey: {
        fieldName: "userId",
        // allowNull: false,
      },
    });
  };
  return Courses;
};
