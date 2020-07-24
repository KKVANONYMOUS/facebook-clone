let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    middleWare = require("../middleware")

route.put("/posts/:id/like", (req, res) => {
    post.findById(req.params.id, (err, postupdate) => {
        if (err) {
            console.log(err)
            res.redirect("/posts")
        } else {
            let flag = 0;
            postupdate.likes.forEach((like) => {
                if (like == req.user._id) {
                    flag = 1;
                }
            })
            //for new likes
            if (flag == 0) {
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
            //for existing like
            else{
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

        }
    })

})

module.exports = route