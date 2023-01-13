const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const productRouter = require('./product')
const userRouter = require('./user')


<<<<<<< HEAD
router.get('/', Controller.home) // Masuk ke home - Log In
router.post('/', Controller.validasi) // Masuk ke home - Log In
// router.get('/validasi', Controller.temp) // Masuk ke home - Log In
router.get('/logout', Controller.logout) // Redirect ke ke home
=======
router.get('/', Controller.home) // Masuk ke home - Log In //! Done
router.get('/failedLogin', Controller.failedLogin) // Masuk ke home - Log In 
router.get('/logout', Controller.logout) // Redirect ke ke home //! Done
>>>>>>> 7fec5a9e768d8acf0f99857e50bc0a1f23fae068
router.use(productRouter) // Akan ambil dari router di product
router.use(userRouter) // Akan ambil dari router di user


module.exports = router