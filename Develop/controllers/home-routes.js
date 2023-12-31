const router = require("express").Router();
const sequelize = require("../config/connection");
const {User, Post, Comment} = require("../models");


// gets+finds all posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "title", "content", "created_at"],
        include: [{
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
                model: User,
                attributes: ["username"]
            }
        },
        {
            model: User,
            attributes: ["username"]
        }]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post =>.get({
            plain: true
        }));
        res.render("homepage", {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// gets+finds one post
router.get("/post/:id", (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: ["id", "title", "content", "created_at"],
        include: [{
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
                model: User,
                attributes: ["username"]
            }
        },
        {
            model: User,
            attributes: ["username"]
        }]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({
                message: "No post has been found with this id"
            });
            return;
        }
        const post = dbPostData.get({plain: true});
        res.render("single-post", {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



// login + signup
router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("signup");
});

router.get("*", (req, res) => {
    res.status(404).send("Whoops!");
})


module.exports = router;