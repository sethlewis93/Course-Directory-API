"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const Users = require("../models").Users;
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");

// Route that returns a list of users.
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    let users = await Users.findAll();
    res.json(users);
  })
);

// GET USERS AUTHENTICATION MIDDLEWARE
/*
router.get("/users", authenticateUser, async (req, res) => {
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
  });
});
*/

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await Users.create(req.body);
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
