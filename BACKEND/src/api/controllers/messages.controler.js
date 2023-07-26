const User = require("../models/user.model");
const Message = require("../models/message.model");

//!---------------------------------------
//?-----------SEND MESSAGE---------
//!---------------------------------------

const sendMessage = async (req, res, next) => {
  //* Sacamos los datos de los usuarios y el mensaje de req.body

  const { senderUserID, receiverUserID, text } = req.body;
  console.log("req.body",senderUserID);

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

    // * Agregar el nuevo mensaje a los chats de ambos usuarios
    sender.chats.push(newMessage._id);
    receiver.chats.push(newMessage._id);


 //*------ Actualizar el campo conversations para ambos usuarios
 let senderConversation = sender.conversations.find(
  (c) => c.participant.toString() === receiverUserID
);
if (!senderConversation) {
  senderConversation = {
    participant: receiverUserID,
    messages: [],
  };
  sender.conversations.push(senderConversation);
}
senderConversation.messages.push(newMessage._id);

let receiverConversation = receiver.conversations.find(
  (c) => c.participant.toString() === senderUserID
);
if (!receiverConversation) {
  receiverConversation = {
    participant: senderUserID,
    messages: [],
  };
  receiver.conversations.push(receiverConversation);
}
receiverConversation.messages.push(newMessage._id);


 //*tomamos todas las variables del objeto user y friend exceptuando la contraseña y después actualizamos, así no modificamos la contraseña
 const { password: userPassword, ...updatedSender} = sender.toObject()

 const {password: friendPassword, ...updatedReceiver} = receiver.toObject()
 
  await User.findByIdAndUpdate(senderUserID, updatedSender);
  await User.findByIdAndUpdate(receiverUserID, updatedReceiver);
 
  const populatedSender = await sender.populate("chats");
  const populatedReceiver = await receiver.populate("chats");
 
  return res.status(200).json({
    message: "Message send",
    sender: populatedSender,
  receiver: populatedReceiver,
  });



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

   return res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};


const getConversations = async (req, res, next) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID).populate({
      path: 'conversations.participant',
      select: 'name email file' , 
    }).populate({
      path: 'conversations.messages',
      populate: {
        path: 'sender',
        select: 'name',
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const conversations = user.conversations.map((conversation) => {
      const messages = conversation.messages.map((message) => {
        return {
          _id: message._id,
          sender: message.sender.name,
          text: message.text,
          createdAt: message.createdAt,
        };
      });

      return {
        participant: {
          _id: conversation.participant._id,
          name: conversation.participant.name,
          image:conversation.participant.file,
          email: conversation.participant.email,
       
        },
        messages: messages,
      };
    });

    return res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las conversaciones' });
  }
};

module.exports.sendMessage = sendMessage;
module.exports.getChat = getChat;
module.exports.getConversations = getConversations
