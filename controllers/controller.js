const { Category, Product, History, User, UserDetail } = require('../models/index')
const { Op } = require("sequelize");
const QRCode = require('qrcode')
const { rupiah, convert } = require('../helpers/helper')
const bcrypt = require('bcryptjs')

let currentUserName = ''

class Controller {
    static home(req, res) {
        // res.send('Ini home untuk Log In')
        const { err } = req.query
        res.render('home', { err })
    }

    static validasi(req, res) {
        const { username, password } = req.body
        User.findOne({ where: { userName: username } })
            .then(user => {
                if (user) {
                    // res.send(req.body)
                    const isValidPassword = bcrypt.compareSync(password, user.password)

                    if (isValidPassword) {
                        currentUserName = username
                        return res.redirect('/product')
                    } else {
                        const error = 'invalid username/password'
                        return res.redirect(`/?err=${error}`)
                    }
                } else {
                    const error = 'invalid username/password'
                    return res.redirect(`/?err=${error}`)
                }
            })
            .catch(err => res.send("err"))
    }

    static logout(req, res) {
        // res.send('Ini log out')
        res.redirect('/')
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
            .then(() => res.redirect('/'))
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
        User.findOne({
            where: { userName: currentUserName },
            include: [UserDetail, History]
        })
            .then(data => {
                // res.send(data)
                allData.user = data
                return QRCode.toDataURL(data.userName + data.dateOfBirth + data.email)
            })
            .then(url => {
                allData.url = url
                res.render('user-detail', { allData, convert, currentUserName })
            })
            .catch(err => res.send(err))
    }

    static product(req, res) {
        let allData = {}
        let option = {}

        const { search, look, user } = req.query
        if (user !== undefined) currentUserName = user

        // console.log(user, currentUserName)
        //search by product title
        if (look) option = { where: { name: { [Op.iLike]: `%${look}%` } } }
        if (search) option = { where: { CategoryId: search } }
        if (!look && !search) option = {}

        Product.findAll(option)
            .then(product => {
                allData.product = product
                // res.send(product[0].description)
                return Category.findAll()
            })
            .then(category => {
                allData.category = category
                // res.send(allData)
                res.render('products', { allData, rupiah, currentUserName })
            })
            .catch(err => res.send(err))
    } //! DONE

    static buyProduct(req, res) {
        // res.send('Ini untuk proses beli product')
        const { id } = req.params
        // res.send(id)
        Product.findByPk(id)
            .then(data => {
                // res.send(data)
                if (data.stockBarang > 0) {
                    return Product.decrement({ stockBarang: +1 }, { where: { id: id } })
                } else {
                    throw "Stock error"
                }
            })
            .then(() => {
                return User.findOne({ where: { userName: currentUserName } })
            })
            .then((dataUser) => {
                return History.create({ ProductId: id, UserId: dataUser.id })
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
        Category.findAll()
            // .then(data => res.send(data))
            .then(data => res.render('category', { data, currentUserName }))
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller