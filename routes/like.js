let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    middleWare = require("../middleware")

//PUT ROUTE FOR UPDATING POST LIKES
route.put("/posts/:id/like", middleWare.isLoggedIn, (req, res) => {
    post.findById(req.params.id, (err, postupdate) => {
        if (err) {
            req.flash("error", "Post not found")
            res.redirect("/posts")
        } else {
            //for new likes
            if (postupdate.likes.find(event => event == req.user._id)) {
                let updatedlikes = postupdate.likes.filter((val => val != req.user._id));
                post.findByIdAndUpdate(postupdate._id, {
                    likes: updatedlikes
                }, (err, like) => {
                    if (err) {
                        console.log(err)
                        res.redirect("back")
                    } else {
                        res.redirect("back")
                    }
                })

            }
            //for existing like
            else {
                post.findByIdAndUpdate(postupdate._id, {
                    likes: postupdate.likes.concat([req.user._id])
                }, (err, like) => {
                    if (err) {
                        console.log(err)
                        res.redirect("back")
                    } else {
                        res.redirect("back")
                    }
                })
            }

        }
    })

})

module.exports = route