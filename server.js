const express = require('express');
const app = express();
const { connectMongoose, User } = require("./databse.js");
const ejs = require("ejs");
const passport = require("passport");
const { initializeingPassport, isAuthenticated } = require('./passportConfig.js');
const expressSession = require("express-session");

connectMongoose();

initializeingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", (req, res) => {
    res.render("register");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/register", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send("User already exists");
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);

})

app.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/register",
        successRedirect: "/"
    }),
);

app.get("/profile", isAuthenticated, (req, res) => {
    res.send(req.user)
})

app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.send("Logged out")
    });
})

app.listen(3000, () => {
    console.log("Server is working http://localhost:3000");
})