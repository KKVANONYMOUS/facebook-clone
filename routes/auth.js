let express = require("express"),
    route = express.Router(),
    user = require('../models/user'),
    passport = require('passport'),
    post = require("../models/posts"),
    middleWare = require("../middleware")

//DEFAULT ROUTE    
route.get("/", (req, res) => {
    res.redirect("/login")
})


//REGISTER ROUTES
route.get("/register", (req, res) => {
    res.render("register")
})

route.post("/register", (req, res) => {
    user.register(new user({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            req.flash('error', err.message)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash('success', 'Welcome ' + user.username + " to Fakebook")
                res.redirect('/posts')
            })
        }
    })
})

//LOGIN ROUTES
route.get("/login", (req, res) => {
    res.render("login")
})
route.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"

}), (req, res) => {})

//LOGOUT ROUTES
route.get("/logout", (req, res) => {
    req.logOut()
    req.flash("success", "Successfully logged out!")
    res.redirect("/login")
})


module.exports = route