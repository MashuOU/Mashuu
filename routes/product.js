const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/product', Controller.product)
router.get('/product/category', Controller.productCategory)


module.exports = router