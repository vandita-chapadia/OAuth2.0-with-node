const express = require("express");
const passport = require("passport");
const path = require("path");
const app = express();
const session = require("express-session");
require("dotenv").config();
require("./auth");

app.use(express.json());
app.use(express.static(path.join(__dirname, "Client")));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"],  prompt: 'consent' })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  res.send("Something went wrong");
});

app.get("/auth/protected", isLoggedIn, (req, res) => {
  let userName = req.user.displayName;

  res.send(`Hello ${userName}`);
});

app.use("/auth/logout",(req,res)=>{
    req.session.destroy();
    res.send('See you Again !!')
})

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
