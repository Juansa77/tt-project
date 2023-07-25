const User = require("../models/user.model");
const Message = require("../models/message.model");

//!---------------------------------------
//?-----------SEND MESSAGE---------
//!---------------------------------------

const sendMessage = async (req, res, next) => {
  //* Sacamos los datos de los usuarios y el mensaje de req.body

  const { senderUserID, receiverUserID, text } = req.body;
  console.log(req.body);

  try {
    //*Buscamos los usuarios

    const [sender, receiver] = await Promise.all([
      User.findById(senderUserID),
      User.findById(receiverUserID),
    ]);
    console.log("sender", sender);
    console.log("sender", receiver);
    if (!sender || !receiver) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      text,
    });
    await newMessage.save();

    // Agregar el nuevo mensaje a los chats de ambos usuarios
    sender.chats.push(newMessage._id);
    receiver.chats.push(newMessage._id);
    await Promise.all([sender.save(), receiver.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

//!---------------------------------------
//?-----------GET CHAT---------
//!---------------------------------------

const getChat = async (req, res, next) => {
  const { senderID, receiverID } = req.params;

  try {
    const [sender, receiver] = await Promise.all([
      User.findById(senderID).populate("chats"),
      User.findById(receiverID).populate("chats"),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener los mensajes entre los dos usuarios
    const messages = sender.chats.filter(
      (chat) =>
        chat.receiver.toString() === receiverID ||
        chat.sender.toString() === receiverID
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

module.exports.sendMessage = sendMessage;
module.exports.getChat = getChat;
