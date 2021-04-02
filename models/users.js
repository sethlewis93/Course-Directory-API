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
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.VIRTUAL,
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
