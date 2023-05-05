const User = require('../models/user');
const Message = require('../models/message');
const asyncHandler = require('express-async-handler');

exports.log_in = asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Welcome to the Yacht Club' })
})

exports.user_detail = asyncHandler(async (req, res, next) => {

})

exports.create_user_get = asyncHandler(async (req, res, next) => {

})

exports.create_user_post = asyncHandler(async (req, res, next) => {

})