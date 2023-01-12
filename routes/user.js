const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/user/add', Controller.addUser) // Masuk ke form add user //! Done
router.post('/user/add', Controller.createUser) // Kirim data dari form add user ke DB //! Done
router.get('/user/detail', Controller.userDetail) // Nampilin detail users //! Done


module.exports = router