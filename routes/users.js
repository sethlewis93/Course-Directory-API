"use strict";

const express = require("express");
const bcrypt = require("bcrypt");

// Construct a router instance.
const router = express.Router();
const Users = require("../models").Users;
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");

// Authenticated route that returns list of users
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // Retrieve current user info
    const user = req.currentUser;
    // Retrieve authenticated user info
    const authUser = await Users.findByPk(user.id);
    // If current user is an authenticated user, return info in JSON
    if (authUser) {
      res.json(authUser);
    } else {
      throw new Error();
    }
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await Users.create(req.body);
      res.location("/");
      res.status(201).json({ message: "Account successfully created!" });
      res.end();
    } catch (error) {
      console.log("ERROR: ", error.name);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
