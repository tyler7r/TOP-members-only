const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { body, validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.log_in_get = asyncHandler(async (req, res, next) => {
    res.render('index', { 
        title: 'Welcome to the Yacht Club',
        user: req.user,
        messages: req.session.messages,
    })
    req.session.messages = [];
})

exports.log_in_post = [
    body('username', "Username must be specified").trim().isLength({ min: 2 }).escape(),
    body('password', 'Password must be specified').trim().isLength({ min: 4 }).escape(),
    passport.authenticate('local', {
        failureRedirect: '/',
        failureMessage: "Incorrect Password",
    }),
    (req, res) => {
        res.redirect(req.user.url)
    }
]

exports.user_dashboard = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec();

    if (user === null) {
        const err = new Error('User not found')
        err.status = 404;
        return next(err)
    }
    res.render('dashboard', {
        user: user,
        title: "User Dashboard",
    })
})

exports.create_user_get = asyncHandler(async (req, res, next) => {
    res.render('user_create', {
        title: "Sign Up!",
    })
})

exports.create_user_post = [
    body('first_name', "First name must be specified").trim().isLength({ min: 2 }).escape(),
    body('last_name', "Last name must be specified").trim().isLength({ min: 2 }).escape(),
    body('username_sign_up', "Username must be specified").trim().isLength({ min: 2 }).escape(),
    body('password_sign_up', "Password must be between 4 and 20 characters").trim().isLength({ min: 4 }).escape(),
    check('confirm_password').trim().isLength({ min: 4 }).withMessage('Password must be between 4 and 20 characters')
        .custom(async (confirmPassword, {req}) => {
            const password = req.body.password_sign_up
            if (password !== confirmPassword) {
                throw new Error('Passwords must be the same')
            }
        }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username_sign_up,
            password: req.body.password_sign_up,
        })
        if (!errors.isEmpty()) {
            res.render('user_create', {
                title: 'Sign Up!',
                errors: errors.array(),
            })
        } else {
            const userExists = await User.findOne({ username: req.body.username_sign_up });
            if (userExists) {
                res.render('user_create', {
                    title: "Username Not Available, Sign Up",
                    user: req.user,
                })
            } else {
                bcrypt.hash(user.password, 10, async(err, hashedPassword) => {
                    if (err) {
                        return new Error('Hashing did not work')
                    } else {
                        user.password = hashedPassword;
                        await user.save();
                        res.redirect('/');
                    }
                })
            }
        }
    })
]