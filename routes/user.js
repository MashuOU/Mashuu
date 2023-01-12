const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/user/add', Controller.addUser) // Masuk ke form add user
router.post('/user/add', Controller.createUser) // Kirim data dari form add user ke DB
router.get('/user/detail', Controller.userDetail) // Nampilin detail users


module.exports = router