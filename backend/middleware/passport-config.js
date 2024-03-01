const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/user");
const dotenv = require("dotenv");

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Make sure to define this in your environment
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload._id });
    // console.log(payload);
    // console.log(user);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    console.error(error);
    return done(error, false);
  }
});

passport.use(strategy);
