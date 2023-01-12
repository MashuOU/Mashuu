const { Category, Product, History, User, UserDetail } = require('../models/index')
const { Op } = require("sequelize");

class Controller {
    static home(req, res) {
        // res.send('Ini home untuk Log In')
        res.render('homepage')
    }

    static logout(req, res) {
        // res.send('Ini log out')
        res.redirect('/')
    }

    static addUser(req, res) {
        // res.send('Ini nanti form add user')
        const { errors } = req.query
        res.render('addUser', { errors })
    } //! Done

    static createUser(req, res) {
        let accountId = {}
        const { userName, email, password, role } = req.body
        const { firstName, lastName, address, phoneNumber, dateOfBirth } = req.body
        User.create({ userName, email, password, role })
            .then(data => {
                accountId.id = data.id
                return UserDetail.create({ firstName, lastName, address, phoneNumber, dateOfBirth, UserId: accountId.id })
            })
            // .then(data => res.send(data))
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
        // res.send('Ini nampilin detail user')
        User.findAll({
            include: [UserDetail, History]
        })
            // .then(data => res.send(data))
            .then(data => {
                res.render('userDetail', { data })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static product(req, res) {
        // res.send('Ini nampilin list product')
        const { search } = req.query
        const option = {
            order: [['id', 'ASC']]
        }

        // if (search) {
        //     option.where.name = {
        //         [Op.iLike]: `%${search}%`
        //     }
        // } //! Masih belum berhasil buat search karena bentuknya array, jadi ga bisa langsung di tambahin option.where.name

        Product.findAll(option)
            .then(product => {
                // res.send(product)
                res.render('productPage', { product })
            })
            .catch(err => {
                res.send(err)
            })
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
            .then(data => {
                // res.send(data)
                res.render('categoriesPage', { data })
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller