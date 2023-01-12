const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/product', Controller.product) // List of all product (Setelah log in langsung masuk sini)
router.get('/product/buy', Controller.buyProduct) // Redirect ke product dan stock -1
router.post('/product/buy', Controller.checkOutProduct) // Kirim data pembelian ke histories
router.get('/product/category', Controller.productCategory) // Sort product by category


module.exports = router