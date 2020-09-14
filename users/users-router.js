const app = require('express')

const router = app.Router()

const db = require('../data/db-config')

const bcrypt = require('bcryptjs')
const hash = require('../helpers/hash')

router.get('/users', validateUser, (req, res) => {
    // console.log("---------------------------------")
    // console.log(req.session.username)
    // console.log("---------------------------------")
    if (req.session.username) {
        db('users')
            .then(users => {
                res.status(200).json({ user: req.session.username, data: users })
            })
            .catch(error => {
                res.status(500).json({ message: error.message })
            })
    } else {
        res.status(403).json({ message: 'you must login to access the db' })
    }
})

//REGISTER user
router.post('/register', (req, res) => {
    const user = req.body //use middleware to validate user inputs

    user.password = hash(req.body.password)

    db('users')
        .insert(user)
        .then(resp => {
            res.status(201).json({ message: 'You have been successfully registered' })
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
})

//LOGIN
router.post('/login', (req, res) => {
    const { username, password } = req.body //validate input
    db('users')
        .where({ username })
        .first()
        .then(user => {
            // console.log(user)
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.username = user.username
                res.status(201).json({ message: 'you have successfully signed in' })
            } else {
                res.status(401).json({ message: 'username or password is invalid' })
            }
        })
        .catch(error => {
            console.log(error)
        })
})

router.get('/logout', validateUser, (req, res) => {
    console.log(req.session.username)
    if (req.session.username) {
        req.session.destroy()
        res.status(201).json({ message: 'you have successfully logged out' })
    } else {
        res.status(204).end()
    }
})


//middleware
function validateUser(req, res, next) {
    if (req.session.username) {
        next()
    } else {
        res.status(404).json({ message: 'you are not logged in' })
    }
}

module.exports = router