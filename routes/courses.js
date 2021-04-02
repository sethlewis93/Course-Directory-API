"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const { Users, Courses } = require("../models");
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");

router.get("/courses", async (req, res) => {
  // Retrieve courses
  const courses = await Courses.findAll({
    include: [
      {
        model: Users,
        as: "student",
      },
    ],
  });
  res.json(courses);
});

module.exports = router;
