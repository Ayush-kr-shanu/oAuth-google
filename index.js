var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const express = require("express");
const { seq } = require("./config/config");
const { User } = require("./Models/user");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>welcome to my world</h1>");
});

const { v4: uuidv4 } = require("uuid");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      //  let avatar =profile._json.picture
      let email = profile._json.email;
      let udata = await User.findOne({ where: { email } });
      if (udata) {
        return cb(null, udata);
      }
      let name = profile._json.name;

      let user = User.build({
        name,
        email,
        password: uuidv4(),
      });
      console.log(user);
      await user.save();
      return cb(null, user);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/google/login",
    session: false,
  }),
  function (req, res) {
    let user = req.user;
    var token = jwt.sign(
      { userID: user.id, username: user.name, email: user.email },
      process.env.SECRET_KEY
    );
    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 2589200000),
    //   httpOnly: true,
    // });
    console.log("User's Name:", user.name); // Log the user's name
    console.log("User's Email:", user.email); // Log the user's email
    res.redirect(`https://school.myleadingcampus.com/dashboard?token=${token}&username=${user.name}&isLoggedIn=true`);
  }
);

seq.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`connected at port ${process.env.PORT}`);
  });
});
