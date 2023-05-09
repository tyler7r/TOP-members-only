const Message = require('../models/message')
const User = require('../models/user')
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.all_messages = asyncHandler(async (req, res, next) => {
    const [user, allMessages] = await Promise.all([
        User.findById(res.locals.currentUser._id).exec(),
        Message.find().populate('author').exec(),
    ]);

    if (user.status === false) {
        res.render('message_board', {
            title: "Message Board",
            messages: allMessages,
            member: false,
        })
    } else {
        res.render('message_board', {
            title: "Member's Message Board",
            messages: allMessages,
            member: true,
        })
    }
})

exports.message_detail = asyncHandler(async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate('author').exec();
    const user = await User.findById(res.locals.currentUser._id).exec();

    if (user.status === true) {
        res.render('message_detail', {
            title: message.title,
            message: message,
            member: true, 
        })
    } else {
        res.render('message_detail', {
            title: message.title,
            message: message,
            member: false,
        })
    }
})

exports.create_message_get = asyncHandler(async (req, res, next) => {
    res.render('message_create', {
        title: "Create Message",
    })
})

exports.create_message_post = [
    body('title', 'Title must be specified').trim().isLength({ min: 1, max: 30 }).escape(),
    body('message', 'Message must be specified').trim().isLength({ min: 1, max: 160 }).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const user = await User.findById(req.params.id).exec();

        const message = new Message({
            title: req.body.title,
            message: req.body.message,
            author: req.params.id,
        })
        if (!errors.isEmpty()) {
            res.render('message_create', {
                title: "Create Message",
                errors: errors.array(),
            })
        } else {
            await message.save();
            res.redirect(user.url);
        }
    })
]