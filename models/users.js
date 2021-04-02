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
          len: {
            args: [8, 20],
            msg: "The password should be between 8 and 20 characters in length",
          },
        },
      },

      /*
      confirmedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
        set(val) {
          if (val === this.password) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("confirmedPassword", hashedPassword);
          }
        },
        validate: {
          notNull: {
            msg: "Both passwords must match",
          },
        },
      },
      */
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
