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
route.put("/friends/:id/addfriend",middleWare.isLoggedIn, (req, res) => {
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
route.put("/friends/:firstid/removefriendrequest/:secondid",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.firstid, (err, foundUser) => {
        if (err || !foundUser) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            let updatedfriendrequests = foundUser.friend_requests.filter((val => val != req.params.secondid));
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
route.put("/friends/:id/acceptfriendrequest",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.id, (err, senderUser) => {
        if (err || !senderUser) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            user.findByIdAndUpdate(senderUser._id, {
                friends: senderUser.friends.concat([req.user._id])
            }, (err, friend) => {
                if (err) {
                    res.redirect("back")
                } else {
                    user.findByIdAndUpdate(req.user._id, {
                        friends: req.user.friends.concat([senderUser._id]),
                        friend_requests:req.user.friend_requests.filter((val => val != senderUser._id))
                    }, (err, recipientUser) => {
                        if (err){
                            req.flash("error", "User not found")
                            res.redirect("/friends")
                        }
                        else{
                            res.redirect("back")
                        }
                    })
                }
            })

        }
    })
})

//PUT ROUTE TO REMOVE FRIEND 
route.put("/friends/:id/removefriend",middleWare.isLoggedIn, (req, res) => {
    user.findById(req.params.id, (err, friend) => {
        if (err || !friend) {
            req.flash("error", "User not found")
            res.redirect("/friends")
        } else {
            user.findByIdAndUpdate(friend._id, {
                friends: friend.friends.filter((val => val != req.user._id))
            }, (err, friend) => {
                if (err) {
                    res.redirect("back")
                } else {
                    user.findByIdAndUpdate(req.user._id, {
                        friends: req.user.friends.filter((val => val != req.params.id))
                    }, (err, recipientUser) => {
                        if (err){
                            req.flash("error", "User not found")
                            res.redirect("/friends")
                        }
                        else{
                            res.redirect("back")
                        }
                    })
                }
            })

        }
    })
})
module.exports = route