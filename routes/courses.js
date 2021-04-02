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
          model: Users,
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
  asyncHandler(async (req, res) => {
    try {
      await Courses.create(req.body);
      // set Location header to URI for newly created course
      res.status(201);
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
  asyncHandler(async (req, res, next) => {
    let course;
    try {
      course = await Courses.findByPk(req.params.id);
      if (course) {
        await course.update(req.body);
        res.status(204);
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
  asyncHandler(async (req, res, next) => {
    const course = await Courses.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.status(204);
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);

module.exports = router;
