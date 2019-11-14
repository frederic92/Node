const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// User model
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => {
    res.render('users/login')
})

// Register Page
router.get('/register', (req, res) => {
    res.render('users/register')
})

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, level, github_link, avatar, password } = req.body 
    let errors = []

    // Check required fields
    if(!name || !email || !password || !github_link || !level || !avatar) {
      errors.push({ msg: 'Please fill in all fields'})
    }

    // Check password length
    if(password < 6) {
      errors.push({msg: 'Password should be at least 6 characters'})
    }

    if(errors.length > 0) {
        res.render('users/register', { errors, name, email, password, avatar, level, github_link });
    } else {
        //No errors
        User.findOne({ email: email})
            .then(user => {
                if(user) {
                    // User isfound/exists
                    errors.push({msg: 'This email is already registered'})
                    res.render('users/register', { errors, name, email, password, avatar, level, github_link });
                } else {
                    const newUser = new User({ name, email, level, github_link, avatar, password})
                    
                    // Hashing the password
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) {
                            console.log('error generating salt');   
                        } else {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(err) {
                                    throw err;
                                }
                                newUser.password = hash 
                                // Save user
                                newUser.save()
                                    .then(user => {
                                        res.redirect('users/login')
                                    })
                                    .catch(err => console.log(err))
                            })
                        
                        }
                    })
                    
                }
                
            })
    }
})

module.exports = router 