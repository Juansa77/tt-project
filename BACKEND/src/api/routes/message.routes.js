

const express = require('express');
const { sendMessage, getChat, getConversations } = require('../controllers/messages.controler');

const MessageRoutes = express.Router();


//?-----Ruta SEND MESSAGE--------
MessageRoutes.post('/new-message', sendMessage);


//?-----Ruta GET CHAT--------

MessageRoutes.get('/:senderID/getchat/:receiverID', getChat);

module.exports = MessageRoutes


//?-----Ruta GET CONVERSATIONS--------

MessageRoutes.get('/getconversations/:userID', getConversations);

module.exports = MessageRoutes