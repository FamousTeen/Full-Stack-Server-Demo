const express = require('express')
const router = express.Router()
const { Comments } = require('../models')
const {validateToken} = require('../middleware/AuthMiddleware')

// get all comment from spesific post
router.get('/:postId', (req, res) => {
    const postId = req.params.postId
    Comments.findAll({
        where: {
            PostId: postId
        }
    }).then(comments => {
        res.json(comments)
    });
});

// buat comment baru
router.post('/', validateToken, (req, res) => {
    const comment = req.body
    const username = req.user.username

    comment.username = username
    Comments.create(comment).then(comment => {
        res.json(comment)
    })
});

// delete comment
router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId
    await Comments.destroy({
        where: {
            id: commentId
        }
    }).then((response) => {
        if (response === 1) {
            res.json("Comment deleted successfully")
        } else {
            res.json("Comment not found")
        }
    })
})
    
module.exports = router;