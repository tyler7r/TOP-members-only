const Message = require('../models/message')
const User = require('../models/user')
const asyncHandler = require('express-async-handler');

exports.all_messages = asyncHandler(async (req, res, next) => {

})

exports.message_detail = asyncHandler(async (req, res, next) => {

})

exports.create_message_get = asyncHandler(async (req, res, next) => {
    res.render('index', {
        title: "Create Message",
    })
})

exports.create_message_post = asyncHandler(async (req, res, next) => {

})