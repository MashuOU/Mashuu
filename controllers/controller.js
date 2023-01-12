const { Category, Product, History, User, UserDetail } = require('../models/index')
const { Op } = require("sequelize");
const QRCode = require('qrcode')
const rupiah = require('../helpers/helper')

class Controller {
    static home(req, res) {
        // res.send('Ini home untuk Log In')
        // const { email, password } = req.query
        // User.findOne({
        //     where: {
        //         email: email,
        //         password: password
        //     }
        // })
        //     .then(data => res.send(data))
        res.render('home')
    }

    static logout(req, res) {
        // res.send('Ini log out')
        res.redirect('/')
    }

    static failedLogin(req, res) {

    }

    static addUser(req, res) {
        // res.send('Ini nanti form add user')
        const { errors } = req.query
        res.render('add-user', { errors })
    } //! Done

    static createUser(req, res) {
        let accountId = {}
        const { userName, email, password, role } = req.body
        const { firstName, lastName, address, phoneNumber, dateOfBirth } = req.body
        User.create({ userName, email, password, role })
            .then(data => {
                accountId.id = data.id
                // res.send(data)
                return UserDetail.create({ firstName, lastName, address, phoneNumber, dateOfBirth, UserId: accountId.id })
            })
            .then(() => res.redirect('/product'))
            .catch(err => {
                if (err.name == 'SequelizeValidationError') {
                    const errors = err.errors.map(el => el.message)
                    res.redirect(`/user/add?errors=${errors}`) // Nanti tinggal passing data ERRORS di static addUser kalo codenya udah jadi
                } else {
                    res.send(err)
                }
            })
    } //! DONE

    static userDetail(req, res) {
        let allData = {}
        User.findAll({
            include: [UserDetail, History]
        })
            .then(data => {
                allData.user = data
                return QRCode.toDataURL(data[0].userName)
            })
            .then(url => {
                allData.url = url
                // res.send(allData)
                res.render('user-detail', { allData })
            })
            .catch(err => res.send(err))
    }

    static product(req, res) {
        let allData = {}
        let option = {}
        const { search, look } = req.query

        //search by product title
        if (look) option = { where: { name: { [Op.iLike]: `%${look}%` } } }
        if (search) option = { where: { CategoryId: search } }
        if (!look && !search) option = {}

        Product.findAll(option)
            .then(product => {
                allData.product = product
                return Category.findAll()
            })
            .then(category => {
                allData.category = category
                // res.send(allData)
                res.render('products', { allData, rupiah })
            })
            .catch(err => res.send(err))
    } //! DONE

    static buyProduct(req, res) {
        // res.send('Ini untuk proses beli product')
        const { id } = req.params
        Product.findByPk(id)
            .then(data => {
                // res.send(data)
                if (data.stock > 0) {
                    return Product.decrement({ stock: +1 }, { where: { id: id } })
                } else {
                    throw "Stock error"
                }
            })
            .then(() => {
                return History.create({ ProductId: id, UserId: 2 })
            })
            .then(() => res.redirect('/product'))
            .catch(err => {
                if (err == "Stock error") {
                    // res.redirect('/product?error=stock sudah 0')
                    res.send('Stock barang habis')
                } else {
                    res.send(err)
                }
            })
    }

    static productCategory(req, res) {
        // res.send('Ini ngesort product based on category, nanti isinya cuma jumlah product di category tsb dengan eager loading')
        Product.findAll()
            .then(data => res.render('category', { data }))
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller