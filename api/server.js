const express = require('express')
const app = express()

const helmet = require('helmet')

const bcrypt = require('bcryptjs')
const userRouter = require('../users/users-router')
const session = require('express-session')

app.use(helmet())
app.use(express.json())
app.use(session({
    name: 'mysession',
    secret: 'newsecretname',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
}))
app.use('/api', userRouter)

module.exports = app