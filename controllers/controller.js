const { Category, Product, History, User, UserDetail } = require('../models/index')

class Controller {
    static home(req, res) {
        res.send('Ini home')
    }

    static logout(req, res) {
        res.send('Ini log out')
    }

    static addUser(req, res) {
        res.send('Ini nanti form add user')
    }

    static createUser(req, res) {
        res.send('Ini nanti kirim data dari form add user ke DB')
    }

    static userDetail(req, res) {
        res.send('Ini nampilin detail user')
    }

    static product(req, res) {
        // res.send('Ini nampilin list product')
        Product.findAll()
            .then(product => {
                // res.send(product)
                res.render('productPage', { product })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static productCategory(req, res) {
        res.send('Ini ngesort product based on category, nanti isinya cuma jumlah product di category tsb dengan eager loading')
    }
}

module.exports = Controller