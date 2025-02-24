const express = require('express')
const router = express.Router()
const { Posts, Likes } = require('../models')
const {validateToken} = require('../middleware/AuthMiddleware')

// req/request is standard, async dan wait wajib untuk function sequelize (kalo gk pake then)
// get all post
router.get('/', validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

// get spesific post by id
router.get('/byId/:id', (req, res) => {
    const id = req.params.id
    const post = Posts.findByPk(id).then(post => {
        res.json(post)
    })
});

router.get('/byuserId/:id', (req, res) => {
    const id = req.params.id
    const post = Posts.findAll({where: {UserId: id}, include: [Likes]}).then(post => {
        res.json(post)
    })
});

// buat post baru
router.post('/', validateToken, (req, res) => {
    const post = req.body
    post.username = req.user.username
    post.UserId = req.user.id
    Posts.create(post).then(post => {
        res.json(post)
    })
});

router.put('/title', validateToken, (req, res) => {
    const {newTitle, id} = req.body
    Posts.update({title: newTitle}, {where: {id: id}}).then(post => {
        res.json(newTitle)
    })
});

router.put('/postText', validateToken, (req, res) => {
    const {newText, id} = req.body
    Posts.update({postText: newText}, {where: {id: id}}).then(post => {
        res.json(newText)
    })
});

// delete post
router.delete('/:id', validateToken, async (req, res) => {
    const id = req.params.id
    await Posts.destroy({
        where: {
            id: id
        }
    })
    res.json("DELETED SUCCESSFULLY")
});

module.exports = router