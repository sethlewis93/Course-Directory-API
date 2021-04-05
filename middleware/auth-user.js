"use strict";

const auth = require("basic-auth");
const { Users } = require("../models");
const bcrypt = require("bcrypt");

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
  let message;

  // Parse user credentials from Auth header
  const credentials = auth(req);
  // Verify user credentials are available
  if (credentials) {
    const user = await Users.findOne({
      where: { emailAddress: credentials.name },
    });
    user.username = user.emailAddress;
    // Verify user was successfully retrieved from database
    if (user) {
      // compareSync() compares user password from Auth header to encrypted password from database
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      console.log(user.password);
      if (authenticated) {
        console.log(`Authenticated: ${authenticated}`);
        console.log(`Authentication successful for username: ${user.username}`);
        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${user.username}`;
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
