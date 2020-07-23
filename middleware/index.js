let post = require("../models/posts"),
    comment = require("../models/comments"),
    user = require('../models/user')

middlewareObj = {}
//checkPostOwnership middleware
middlewareObj.checkPostOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        post.findById(req.params.id, (err, post) => {
            if (err || !post) {
                req.flash('error', 'Post not found')
                res.redirect("back")
            } else {
                if (post.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', 'Permission denied')
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash('error', 'Please Login first!')
        res.redirect("back")
    }
}
//check the current loggedIn user
middlewareObj.checkLoggedInUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        user.findById(req.params.id, (err, user) => {
            if (err || !user) {
                req.flash('error', 'User not found')
                res.redirect("/profile/"+req.user._id)
            } else {
                
                if (user._id.equals(req.user._id)) {
                   next()
                } else {
                    req.flash('error', 'Permission denied')
                    res.redirect("/profile/"+req.user._id)
                }
            }
        })
    } else {
        req.flash('error', 'Please Login first!')
        res.redirect("/login")
    }
}
//checkCommentOwnership middleware
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, (err, comment) => {
            if (err || !comment) {
                req.flash('error', 'Comment not found')
                res.redirect("back")
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', 'Permission denied')
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash('error', 'Please Login first!')
        res.redirect("back")
    }
}


//isLoggedIn middleware
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login first!')
    res.redirect("/login")
}
module.exports = middlewareObj