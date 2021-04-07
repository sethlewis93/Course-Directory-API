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
    // Retrieve current authenticated user info
    const user = req.currentUser;
    console.log(`CURRENT USER: ${req.currentUser}`);
    // Return current user's information
    res.json({
      name: user.username,
      pass: user.password,
    });
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
