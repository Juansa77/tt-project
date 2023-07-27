

const express = require('express');
const { sendMessage, getChat, getConversations, markAllMessageAsReaded } = require('../controllers/messages.controler');

const MessageRoutes = express.Router();


//?-----Ruta SEND MESSAGE--------
MessageRoutes.post('/new-message', sendMessage);


//?-----Ruta GET CHAT--------

MessageRoutes.get('/:senderID/getchat/:receiverID', getChat);




//?-----Ruta GET CONVERSATIONS--------

MessageRoutes.get('/getconversations/:userID', getConversations);


//?-----Ruta MARCAR MENSAJES COMO LEIDOS--------

MessageRoutes.put("/markasread", markAllMessageAsReaded);


module.exports = MessageRoutes