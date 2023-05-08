const Club = require('../models/club');
const asyncHandler = require('express-async-handler');
const clubPassword = require('../app');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.secret_password_get = asyncHandler(async (req, res, next) => {
    res.render('club_entry', {
        title: "Bouncer",
    })
})

exports.secret_password_post = [
    body('secret', 'You must make a guess').trim().isLength({ min: 1, max: 20 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('club_entry', {
                title: "Club Entry",
                errors: errors.array(),
            })
            return
        } else {
            if (req.body.secret === clubPassword.password) {
                await User.findByIdAndUpdate(res.locals.currentUser._id, { status: true })
                res.redirect('/yachtclub/entrysuccess')
            } else {
                res.render('club_entry', {
                    title: "Not the right password",
                })
            }
        }
    })
]

exports.entry_success = asyncHandler(async (req, res, next) => {
    res.render('entry_success', {
        title: "You are now an official Yacht Club Member"
    })
})

