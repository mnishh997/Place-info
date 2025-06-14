import express from "express";
import cors from "cors";
import LocalStrategy from "passport-local";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express_session from "express-session";
import auth from "./server/auth.js";
import search from "./server/search.js";
import passport from "passport";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";
import { Strategy as JWTStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { JWT_AUTH_SECRET } from "./lib/constants.js";
import cookieParser from "cookie-parser";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET;

mongoose.connect(MONGODB_URI);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (req) => {
        console.log(req.cookies)
        const token = req.cookies["JWT.AUTH_COOKIE"];
        return token;
      },
      secretOrKey: JWT_AUTH_SECRET,
    },
    async (jwt_payload, done) => {
      console.log(jwt_payload);
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user._id);
  });
});
passport.deserializeUser((id, done) => {
  process.nextTick(async () => {
    try {
      let user = await User.findById(id);
      if (!user) {
        return done(new Error("user not found"));
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  });
});

const app = express();
app.set("trust proxy", true);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.options("{*any}", cors());

app.use(
  express_session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/search", search);



app.listen(5000, () => {
  console.log("Server running on port", 5000);
});
