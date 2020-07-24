let express = require("express"),
    route = express.Router(),
    post = require("../models/posts"),
    middleWare=require("../middleware")//no need for writing index.js as it will require it itself due to its name which is index.js


//RESTful Routes

//get routes for posts
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


//post route for new posts
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

//get route for new posts
route.get("/new", middleWare.isLoggedIn, (req, res) => {
    res.render('posts/new')
})

//show 
// route.get("/:id", (req, res) => {

//     post.findById(req.params.id).populate("comments").exec((err, post) => {
//         if (err) {
//             console.log("error")
//         } else {
//             res.render("posts/show", {
//                 post: post
//             })
//         }
//     })
// })

//get route for edit posts
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
//put route for edit posts
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

//delete route for deleting posts
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