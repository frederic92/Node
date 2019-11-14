if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')

// EJS
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({extended: false}))

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

// Connect flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// ROUTES
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')


app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public')) 

// DATABASE CONFIG
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Route Dispatcher
app.use('/', indexRouter)
app.use('/users', usersRouter)




app.listen(process.env.PORT || 3000)