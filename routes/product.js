const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/product', Controller.product) // List of all product (Setelah log in langsung masuk sini) -- //! Done
router.get('/product/buy/:id', Controller.buyProduct) // Redirect ke product dan stock -1
router.get('/product/category', Controller.productCategory) // Sort product by category


module.exports = router