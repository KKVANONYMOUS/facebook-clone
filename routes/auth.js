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

//PROFILE ROUTE
route.get("/profile/:id",middleWare.isLoggedIn, (req, res) => {
    let user_id=req.params.id;
    post.find({}).populate("comments").exec((err, posts) => {
        if (err) {
            console.log("error occured")
        } else {
            user.findById(user_id,(err,user)=>{
                if (err || !user){
                    req.flash('error', 'User not found')
                    res.redirect("/posts");
                }
                else{
                    res.render('user/profile', {
                        posts: posts,
                        user:user
                    })
                }
            })
            
        }
    })
})

//PROFILE EDIT ROUTE
route.get("/profile/:id/edit", middleWare.checkLoggedInUser, (req, res) => {
    user.findById(req.params.id, (err, user) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("user/edit", {
                user: user
            })
        }
    })
})
//PROFILE EDIT PUT
route.put("/profile/:id",middleWare.checkLoggedInUser, (req, res) => {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let bio = req.body.bio
    let hometown = req.body.hometown
    let workplace = req.body.workplace
    let education = req.body.education
    let contact = req.body.contact
    user.findByIdAndUpdate(req.params.id, {
        firstname: firstname,
        lastname: lastname,
        bio: bio,
        hometown:hometown,
        workplace:workplace,
        education:education,
        contact:contact
    }, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/profile")
        } else {
            req.flash('success', 'Profile updated successfully')
            res.redirect("/profile/"+req.params.id)
        }
    })

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
                req.flash('success', 'Welcome ' + user.username + " to Facebook")
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