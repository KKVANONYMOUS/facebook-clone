let post = require("../models/posts"),
    comment = require("../models/comments")

middlewareObj = {}
//checkCampgroundOwnership middleware
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

//checkCampgroundOwnership middleware
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, (err, comment) => {
            if (err  || !comment) {
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