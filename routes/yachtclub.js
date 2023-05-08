const express = require('express');
const router = express.Router();
const passport = require('passport');

const message_controller = require('../controllers/messageController');
const user_controller = require('../controllers/userController');
const club_controller = require('../controllers/clubController');

/// user routes ///

router.get('/', user_controller.log_in_get);

router.post('/', user_controller.log_in_post);

router.get('/user/create', user_controller.create_user_get);

router.post('/user/create', user_controller.create_user_post);

router.get('/user/:id', user_controller.user_dashboard);

/// message routes ///

router.get('/messages', message_controller.all_messages);

router.get('/message/create', message_controller.create_message_get);

router.post('/message/create', message_controller.create_message_post);

router.get('/message/:id', message_controller.message_detail);

/// club routes ///

router.get('/bouncer', club_controller.secret_password_get);

router.post('/bouncer', club_controller.secret_password_post);

module.exports = router;