let express = require("express"),
    route = express.Router({
        mergeParams: true
    }),
    user = require('../models/user'),
    post = require("../models/posts"),
    middleWare = require("../middleware")

//PROFILE ROUTE
route.get("/", middleWare.isLoggedIn, (req, res) => {
    let user_id = req.params.id;
    post.find({}).populate("comments").exec((err, posts) => {
        if (err) {
            console.log("error occured")
        } else {
            user.findById(user_id, (err, user) => {
                if (err || !user) {
                    req.flash('error', 'User not found')
                    res.redirect("/posts");
                } else {
                    res.render('user/profile', {
                        posts: posts,
                        user: user
                    })
                }
            })

        }
    })
})

//PROFILE EDIT GET
route.get("/edit", middleWare.checkLoggedInUser, (req, res) => {
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
route.put("/", middleWare.checkLoggedInUser, (req, res) => {
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
        hometown: hometown,
        workplace: workplace,
        education: education,
        contact: contact
    }, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/profile")
        } else {
            req.flash('success', 'Profile updated successfully')
            res.redirect("/profile/" + req.params.id)
        }
    })

})

module.exports = route