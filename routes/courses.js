"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const { Users, Courses } = require("../models");
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");

// Route that gets all courses
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

// Route that returns corresponding course
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Courses.findByPk(req.params.id, {
      include: [
        {
          model: Users.firstName,
          as: "student",
        },
      ],
    });
    res.json(course);
  })
);

// Route that creates a new course.
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    // Set current user req object to 'user' variable
    const user = req.currentUser;
    try {
      course = await Courses.create(req.body);
      res.location(`/courses/${course.id}`);
      // Return current user's information
      res.json({
        name: user.emailAddress,
        pass: user.password,
      });
      res.status(201).end();
    } catch (error) {
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

// Route that updates a course
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    let course;
    // Set current user req object to 'user' variable
    const user = req.currentUser;
    try {
      course = await Courses.findByPk(req.params.id);
      if (course) {
        await course.update(req.body);
        // Return current user's information
        res.json({
          name: user.emailAddress,
          pass: user.password,
        });
        res.status(204).end();
      } else {
        const err = new Error();
        err.status = 404;
        next(err);
      }
    } catch (error) {
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

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const course = await Courses.findByPk(req.params.id);
    // Set current user req object to 'user' variable
    const user = req.currentUser;
    if (course) {
      await course.destroy();
      // Return current user's information
      res.json({
        name: user.emailAddress,
        pass: user.password,
      });
      res.status(204).end();
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);

module.exports = router;
