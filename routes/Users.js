const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require("bcrypt")
const { validateToken } = require('../middleware/AuthMiddleware')

const { sign } = require('jsonwebtoken')

// buat akun baru
router.post('/', (req, res) => {
    const { username, password } = req.body
    // 10 adalah angka kerumitan bcrypt
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash
        })
        res.json("User Created")
    })
});

// login
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await Users.findOne({ where: { username: username } });

        if (!user) {
            return res.json({ error: "User Doesn't Exist" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ error: "Wrong Username and Password Combination" });
        }

        const accessToken = sign({ username: user.username, id: user.id }, "importantsecret")

        res.json({ token: accessToken, username: username, id: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user)
})

router.get("/basicinfo/:id", (req, res) => {
    const id = req.params.id
    // dapatein semua data user kecuali password
    Users.findByPk(id, { attributes: { exclude: ["password"] } }).then((user) => {
        res.json(user)
    })
})

router.put('/changepassword', validateToken, async (req, res) => {
    const { oldPass, newPass } = req.body
    const user = await Users.findOne({ where: { username: req.user.username } });

    bcrypt.compare(oldPass, user.password).then(async (match) => {
        if (!match) {
            res.json({ error: "Old Password is incorrect" })
        } else {
            bcrypt.hash(newPass, 10).then((hash) => {
                Users.update({ password: hash }, { where: { username: req.user.username } })
                res.json("Success")
            })
        }
        })
})

module.exports = router