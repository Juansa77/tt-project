const User = require("../models/user.model");
const Message = require("../models/message.model");

//!---------------------------------------
//?-----------SEND MESSAGE---------
//!---------------------------------------

const sendMessage = async (req, res, next) => {
  //* Sacamos los datos de los usuarios y el mensaje de req.body

  const { senderUserID, receiverUserID, text } = req.body;
 

  try {
    //*Buscamos los usuarios

    const [sender, receiver] = await Promise.all([
      User.findById(senderUserID),
      User.findById(receiverUserID),
    ]);
   
    if (!sender || !receiver) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver._id,
      text,
      senderName: sender.name,
      receiverName: receiver.name,
      senderImage: sender.file,
      receiverImage: receiver.file,

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
  senderName: sender.name,
  receiverName: receiver.name,
  senderImage: sender.file,
  receiverImage: receiver.file,
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
    const messages = await Message.find({
      $or: [
        { sender: senderID, receiver: receiverID },
        { sender: receiverID, receiver: senderID },
      ],
    });
   return res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};


//!---------------------------------------
//?-----------GET ALL CHAT---------
//!---------------------------------------

const getAllChatOfUser = async (req, res, next) => {
  const { userID } = req.params;
  console.log("entra en el controlador")

  try {
    // Buscar los mensajes donde el usuario es el emisor o el receptor
    const messages = await Message.find({
      $or: [{ sender: userID }, { receiver: userID }],
    });

    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

//!---------------------------------------
//?-----------GET CHAT IN USER POPULATE---------
//!---------------------------------------

// Controlador para obtener los chats con los diferentes usuarios del usuario actual
const getUserChats = async (req, res, next) => {
  const { userID } = req.params;

  try {
    // Buscar el usuario por su ID y popular sus mensajes
    const user = await User.findById(userID).populate("chats");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener los usuarios con los que el usuario ha tenido chat
    const chatUsers = new Set();

    user.chats.forEach((chat) => {
      if (chat.sender.toString() === userID) {
        chatUsers.add(chat.receiver);
      } else {
        chatUsers.add(chat.sender);
      }
    });

    // Convertir el conjunto de usuarios en un array
    const chatUsersArray = Array.from(chatUsers);

    // Obtener los detalles de los usuarios con los que ha tenido chat
    const usersWithChat = await User.find({
      _id: { $in: chatUsersArray },
    });

    return res.status(200).json(usersWithChat);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los chats del usuario" });
  }
};



//!---------------------------------------
//?-----------GET CONVERSATIONS
//!---------------------------------------

// eslint-disable-next-line no-unused-vars
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
          isRead: message.isRead,
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


//!---------------------------------------
//?-----------MARK AS READ------------
//!---------------------------------------


const markAllMessageAsReaded = async(req, res, next)=>{

console.log("entra en el controlador mark as read")

  const messageIds  = req.body; // Se espera que el front-end envíe los IDs de los mensajes a marcar en el cuerpo de la solicitud
console.log("messageid", req.body)
  try {
    //* Encuentra los mensajes con los IDs proporcionados y actualiza el campo 'isRead' a true
    await Message.updateMany({ _id: { $in: messageIds } }, { isRead: true });

    //* Envía una respuesta al front-end para indicar que la operación se realizó correctamente
    res.status(200).json({ message: 'Mensajes marcados como leídos correctamente' });
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
    res.status(500).json({ message: 'Hubo un error al marcar mensajes como leídos' });
  }



}

module.exports.sendMessage = sendMessage;
module.exports.getChat = getChat;
module.exports.getConversations = getConversations
module.exports.markAllMessageAsReaded= markAllMessageAsReaded
module.exports.getUserChats = getUserChats
module.exports.getAllChatOfUser = getAllChatOfUser