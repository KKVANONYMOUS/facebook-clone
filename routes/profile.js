let express = require("express"),
    route = express.Router({
        mergeParams: true
    }),
    user = require('../models/user'),
    post = require("../models/posts"),
    middleWare = require("../middleware")

//GET ROUTE FOR PROFILE
route.get("/", middleWare.isLoggedIn, (req, res) => {
    let user_id = req.params.id;
    post.find({}).populate("comments").exec((err, posts) => {
        if (err) {
            console.log("error occured")
        } else {
            user.findById(user_id, (err, User) => {
                if (err || !User) {
                    req.flash('error', 'User not found')
                    res.redirect("/posts");
                } else {
                    user.find({}, (err, users) => {
                        if (err) {
                            console.log(err)
                            res.redirect("/posts")
                        } else {
                            res.render('user/profile', {
                                posts: posts,
                                user: User,
                                users:users
                            })
                        }
                    })
                   
                }
            })

        }
    })
})

//GET ROUTE FOR EDITING PROFILE
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

//PUT ROUTE FOR EDITING PROFILE
route.put("/", middleWare.checkLoggedInUser, (req, res) => {
    user.findByIdAndUpdate(req.params.id, req.body.profile , (err, post) => {
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