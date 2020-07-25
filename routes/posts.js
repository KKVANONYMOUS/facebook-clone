let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    middleWare=require("../middleware")

//GET ROUTES FOR INDEX POSTS
route.get("/",middleWare.isLoggedIn, (req, res) => {
    post.find({}).populate("comments").exec((err,posts)=>{
        if (err) {
            console.log("error occured")
        } else {
            res.render('posts/index', {
                posts: posts,
                currentUser: req.user
            })
        }
    })
})

//POST ROUTE FOR NEW POSTS
route.post("/", middleWare.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let img = req.body.img;
    let desc = req.body.desc;
    post.create({
        name: name,
        img: img,
        description: desc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, (err, post) => {
        if (err) {
            console.log("error")
        } else {
            req.flash('success', 'Post added successfully')
            res.redirect("/posts")
        }
    })

})

//GET ROUTE FOR NEW POSTS
route.get("/new", middleWare.isLoggedIn, (req, res) => {
    res.render('posts/new')
})

//GET ROUTE FOR EDITING POSTS
route.get("/:id/edit", middleWare.checkPostOwnership, (req, res) => {
    post.findById(req.params.id, (err, post) => {
        if (err) {
            res.redirect("/posts")
        } else {
            res.render("posts/edit", {
                post: post
            })
        }
    })

})

//PUT ROUTE FOR EDITING POSTS
route.put("/:id", middleWare.checkPostOwnership, (req, res) => {
    post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/posts")
        } else {
            req.flash('success', 'Post updated successfully')
            res.redirect("/posts")
        }
    })

})

//DELETE ROUTE FOR DELETING POSTS
route.delete("/:id", middleWare.checkPostOwnership, (req, res) => {
    post.findByIdAndDelete(req.params.id, (err, post) => {
        if (err) {
            res.redirect("/posts")
        } else {
            req.flash('success', 'Post deleted successfully')
            res.redirect("/posts")
        }
    })
})

module.exports = route