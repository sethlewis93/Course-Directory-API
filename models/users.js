"use strict";
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class Users extends Sequelize.Model {}
  Users.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A first name must be provided",
          },
          notEmpty: {
            msg: "Please enter your first name",
          },
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A last name must be provided",
          },
          notEmpty: {
            msg: "Please enter your last name",
          },
        },
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: "Email address already in use",
        },
        validate: {
          notNull: {
            msg: "An email address is required",
          },
          isEmail: {
            msg: "Please enter a valid email address",
          },
        },
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A password is required",
          },
          notEmpty: {
            msg: "Please provide a password",
          },
        },
        set(val) {
          if (val) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hashedPassword);
          }
        },
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
