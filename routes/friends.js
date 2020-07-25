let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    user = require("../models/user"),
    middleWare = require("../middleware")

//GET ROUTE TO GET ALL USERS
route.get("/friends", middleWare.isLoggedIn, (req, res) => {
    user.find({}, (err, users) => {
        if (err) {
            console.log(err)
            res.redirect("/posts")
        } else {
            res.render("friends/index", {
                users: users,
                currentUser: req.user
            })
        }
    })
})

//PUT ROUTE TO ADD FRIEND
route.put("/friends/:id/addfriend", (req, res) => {
    user.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            user.findByIdAndUpdate(foundUser._id, {
                friend_requests: foundUser.friend_requests.concat([req.user._id])
            }, (err, friend) => {
                if (err) {
                    res.redirect("back")
                } else {
                    res.redirect("back")
                }
            })

        }
    })
})

//PUT ROUTE TO DELETE FRIEND REQUEST
route.put("/friends/:id/removefriendrequest", (req, res) => {
    user.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            let updatedfriendrequests = foundUser.friend_requests.filter((val => val != req.user._id));
            user.findByIdAndUpdate(foundUser._id, {
                friend_requests: updatedfriendrequests
            }, (err, friend) => {
                if (err) {
                    res.redirect("back")
                } else {
                    res.redirect("back")
                }
            })
        }
    })
})

//PUT ROUTE TO ACCEPT FRIEND REQUEST
route.put("/friends/:id/acceptfriendrequest", (req, res) => {
    user.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            user.findByIdAndUpdate(foundUser._id, {
                friends: foundUser.friends.concat([req.user._id])
            }, (err, friend) => {
                if (err) {
                    res.redirect("back")
                } else {
                    res.redirect("back")
                }
            })

        }
    })
})

//PUT ROUTE TO REMOVE FRIEND 
route.put("/friends/:id/removefriend", (req, res) => {
    user.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            let updatedfriends = foundUser.friends.filter((val => val != req.user._id));
            user.findByIdAndUpdate(foundUser._id, {
                friends: updatedfriends
            }, (err, friend) => {
                if (err) {
                    res.redirect("back")
                } else {
                    res.redirect("back")
                }
            })
        }
    })
})
module.exports = route