// server/index.js
import express from "express";
import { User } from "../models/User.js";
import passport from "passport";
import bcrypt from "bcryptjs";
import { success } from "zod/v4";
import jwt from "jsonwebtoken";
import { JWT_AUTH_SECRET } from "../lib/constants.js";

function ensureAuthenticated(req, res, next) {
  console.log("Ensure Authenticated", req);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ message: "Unauthorized" });
}

const app = express.Router();

app
  .get("/", (req, res) => {
    console.log("Here");
    res.status(200).json({
      message: "Hello Welcome",
    });
  })
  .post("/login", async (req, res) => {
    console.log(req.cookies);
    if (req.cookies["JWT.AUTH_COOKIE"]) {
      const token = req.cookies["JWT.AUTH_COOKIE"];
      try {
        const decoded = jwt.verify(token, JWT_AUTH_SECRET);
        console.log(decoded);
        if (decoded) {
          return res.status(200).send({
            success: true,
            message: "Already Logged In",
            token: "Bearer " + token,
          });
        }
      } catch (err) {}
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Email doesn't exist",
      });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return req.status(401).send({
        success: false,
        message: "Incorrect Password",
      });
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_AUTH_SECRET, { expiresIn: "1d" });
    res.cookie("JWT.AUTH_COOKIE", token, {
      httpOnly: true,
      secure: false,
      path: "/",
    });
    return res.status(200).send({
      success: true,
      message: "Successfully Logged in",
      token: "Bearer " + token,
    });
  })
  .post("/register", async (req, res) => {
    const body = req.body;
    const { name, email, password } = body;
    const hashPw = bcrypt.hashSync(password, 10);
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(302).send({ message: "User Already registered" });
      }
      const registeredUser = await User.insertOne({
        name,
        email,
        password: hashPw,
      });
      if (!registeredUser) {
        return res.status(500).send({ message: "Failed to register user" });
      }
      res.status(201).json({
        message: "User registered successfully",
        data: {
          name: registeredUser.name,
          email: registeredUser.email,
          id: registeredUser._id,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Unable Registered" });
    }
  })
  .post(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      if (req.isAuthenticated()) {
        res.clearCookie("JWT.AUTH_COOKIE");
        return res.status(200).send({
          message: "Logged Out",
          user: req.user,
        });
      } else {
        res.status(401).send({
          message: "Unauthenticated",
        });
      }
    }
  )
  .get(
    "/user",
    passport.authenticate("jwt", {
      session: false,
      failureMessage: {
        success: false,
        message: "Unauthenticated, Missing Token",
      },
    }),
    (req, res) => {
      return res.status(200).send({
        success: true,
        data: {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name
        },
      });
    }
  );

export default app;
