let express = require("express"),
    route = express.Router({
        mergeParams: true
    }),
    post = require("../models/posts"),
    comment = require("../models/comments"),
    middleWare=require("../middleware")

//POST ROUTE FOR CREATING NEW COMMENT
route.post("/", middleWare.isLoggedIn, (req, res) => {
    post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/posts")
        } else {
            comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', 'Something went wrong:(')
                    console.log(err)
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    post.comments.push(comment)
                    post.save()
                    console.log("comment added")
                    req.flash('success', 'Comment added successfully')
                    res.redirect("/posts")
                }
            })
        }
    })
})

//GET ROUTE FOR EDITING COMMENT
route.get("/:comment_id/edit",middleWare.checkCommentOwnership,(req,res)=>{
    post.findById(req.params.id, (err, post) => {
        if (err || !post) {
            req.flash("error","No Post found")
            console.log(err)
        } else {
       
           comment.findById(req.params.comment_id,(err,comment)=>{
               if (err){
                   res.redirect("back")
               }
               else{
                
                res.render("comments/edit", {
                    post: post,
                    comment:comment
                })
               }
           })
        }
    })
})

//PUT ROUTE FOR EDITING COMMENT
route.put("/:comment_id",middleWare.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
        if (err){
            res.redirect("back")
        }
        else{
            req.flash('success', 'Comment updated successfully')
            res.redirect("/posts")
        }
    })
})

//DELETE COMMENT ROUTE
route.delete("/:comment_id",middleWare.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndDelete(req.params.comment_id,(err,comment)=>{
        if (err) {
            res.redirect("/posts")
        } else {
            req.flash('success', 'Comment deleted successfully')
            res.redirect("/posts")
        }
    })
})

module.exports = route