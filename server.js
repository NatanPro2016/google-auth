const express = require("express");
const passport = require("passport");
const session = require("express-session");
const app = express();

app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./passport-config");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.status(401).send("unauthorised");
}

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);
app.get("/auth/google/success", isLoggedIn, (req, res) => {
  res.send(req.user.displayName);
});
app.get("/auth/google/failure", (req, res) => {
  res.send("something went wrong");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is listning on port ${PORT}`);
});
