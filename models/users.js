"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Users extends Sequelize.Model {}
  Users.init(
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

  Users.associate = (models) => {
    Users.hasMany(models.Courses, {
      as: "student",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Users;
};
