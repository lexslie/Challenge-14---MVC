const router = require("express").Router();
const {Post, User, Comment} = require("../../models");
const withAuth = require("../../utils/auth");


// get+find all posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        order: [
            ["created_at", "DESC"]
        ],
        include: [{
            model: User,
            attributes: ["username"],
        },
        {
            model: Comment,
            attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
            include: {
                model: User,
                attributes: ["username"]
            },
        }],
    })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});


// get+find single post
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: ["id", "title", "content", "created_at"],
        include: [{
            model: User,
            attributes: ["username",]
        }
        {
            model: Comment,
            attributes: ["id", "title", "content", "created_at"],
            include: {
                model: User,
                attributes: ["username"],
            },
        }],
    })
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({
                message: "There was no post found with this id."
            });
            return;
        }
        res.json(dbPostData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err)
    });
});


// create post
router.post("/", withAuth, (req, res) => {
    console.log("Creating post");
    Post.create({
        title: req.body.title,
        content: req.body.post_content,
        user_id: req.session.user_id
    })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});


// update post
router.put("/:id", withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.post_content,
    },
        {where: {id: req.params.id},}
    )
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({
                message: "There was no post found with this id."
            });
            return;
        }
        res.join(dbPostData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}); 