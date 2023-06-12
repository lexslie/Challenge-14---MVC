const router = require("express").Router();
const {User, Post, Comment} = require("../../models");
const withAuth = require("../../utils/auth");


// get all comments
router.get("/", (req, res) => {
    Comment.findAll()
        .then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});