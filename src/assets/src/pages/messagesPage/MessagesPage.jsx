import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import {
  getChat,
  sendNewMessage,
  getConversations,
  markAsRead,
  getAllChats,
} from "../../services/API_USER/message.service";
import "./MessagesPage.css";
import React, { useEffect, useState } from "react";
import { getUserById } from "../../services/API_USER/user.service";


const MessagesPage = () => {
  const { user } = useAuth();
  const { _id } = useParams();

  const { selectedUser, setSelectedUser } = useUserContext();
  const [conversationName, setConversationName] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState();
  const [newMessageSent, setNewMessageSent] = useState(false);
  const { totalMessages, setTotalMessages } = useUserContext();

  const [selectOtherUser, setSelectOtherUser] = useState();

  const senderID = user?.id;
  const [differentUserConversations, setDifferentUserConversations] =
    useState();

  //* ---USEEFFECT PARA SETEAR EL USUARIO A UNA NUEVA LLAMADA EN CASO DE QUE SEA NULL
  console.log(selectedUser);
  useEffect(() => {
    setSelectOtherUser(selectedUser);

    if (selectedUser == null && _id != user.id) {
      console.log("entra en el if");

      const fetchUserData = async () => {
        try {
          console.log(selectedUser);

          const response = await getUserById(_id);
          setSelectOtherUser(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchUserData();
    }

    console.log(selectOtherUser);
  }, []);

  //*USEEFEFECT PARA CARGAR LAS CONVERSACIONES DEL USUARIO y CREAR OBJETO CUSTOM CON EL RESULTADO DE LA LLAMADA

  useEffect(() => {
    //* llamamos al controlador para obtener todos los chats del usuario
    getAllChats(senderID)
      .then((data) => {
        //* Con la data de la llamada creamos objeto custom con las conversaciones del usuario para iterar fácil
        const getDifferentUserIds = (response, userId) => {
          const differentUserIds = [];

          response.forEach((conversation) => {
            const otherUserId =
              conversation.sender === userId
                ? conversation.receiver
                : conversation.receiver === userId && conversation.sender;
            if (otherUserId !== userId) {
              //* Buscar si ya existe el usuario en el array differentUserIds
              const existingUser = differentUserIds.find(
                (userObj) => userObj.user === otherUserId
              );

              if (existingUser) {
                //* Si el usuario ya existe, agregar la nueva conversación al array de conversaciones
                existingUser.conversation.push({
                  senderID: conversation.sender,
                  receiverID: conversation.receiver,
                  text: conversation.text,
                  senderName: conversation.senderName,
                  receiverImage: conversation.receiverImage,
                  senderImage: conversation.senderImage,
                  createdAt: conversation.createdAt,
                  receiverName: conversation.receiverName,
                  isRead: conversation.isRead,
                  id: conversation._id,
                });
              } else {
                //* Si el usuario no existe, crear un nuevo objeto con el usuario y su conversación
                differentUserIds.push({
                  user: otherUserId,
                  image:
                    conversation.sender === userId
                      ? conversation.receiverImage
                      : conversation.receiver === userId &&
                        conversation.senderImage,
                  name:
                    conversation.sender === userId
                      ? conversation.receiverName
                      : conversation.receiver === userId &&
                        conversation.senderName,
                  conversation: [
                    {
                      senderID: conversation.sender,
                      receiverID: conversation.receiver,
                      text: conversation.text,
                      senderName: conversation.senderName,
                      senderImage: conversation.senderImage,
                      createdAt: conversation.createdAt,
                      receiverName: conversation.receiverName,
                      receiverImage: conversation.receiverImage,
                      isRead: conversation.isRead,
                      id: conversation._id,
                    },
                  ],
                });
              }
            }
          });

          return differentUserIds;
        };

        //* Utilizamos la función para obtener los arrays ordenados con las conversaciones

        const differentUserConversations = getDifferentUserIds(data, user.id);

        var index = differentUserConversations.findIndex(
          (element) => element.user === selectedUser
        );

        setDifferentUserConversations(differentUserConversations);

        //* VAMOS A SETEAR EL USUARIO AL ÚLTIMO CHAT QUE TENGA ABIERTO
        if (newMessageSent === true) {
          console.log("entra");
          setSelectedUser(selectedUser);
          setChats(differentUserConversations[index]);
          console.log("respuesta de chats en useeefect", chats);
        }
        if (newMessageSent == false && index == -1) {
          //*EL FALLO ESTÁ AQUÍ, CUANDO VUELVE A RENDERIZAR EL SENT SE PONE EN
          console.log("aquí noi tiene que entrar");
          setSelectedUser(_id);
          setChats();
        }
        setNewMessageSent(false);
        console.log("el chat después del camnio del seteo", chats);
        console.log("otra vez", differentUserConversations);

        console.log("RESPONDE DE LA NUEVA FUNCIÓN", chats);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [user.id, newMessageSent]);

  //* USEEFFECT PARA VOLVER A RENDERIZAR EL CHAT CUANDO SE MANDA UN MENSAJE

  //* ------------------Función del boton del input para enviar el mensaje-----------------------------

  const handleNewMessage = async () => {
    try {
      if (_id !== user?.id && _id == selectedUser) {
        await sendNewMessage(senderID, _id, newMessage); // Enviar el nuevo mensaje
        setNewMessage(""); // Restablecer el campo de entrada para el nuevo mensaje
        setNewMessageSent(true); // Activar useEffect para obtener las conversaciones actualizadas
        console.log(newMessageSent);
      } else {
        await sendNewMessage(senderID, selectedUser, newMessage); // Enviar el nuevo mensaje
        setNewMessage(""); // Restablecer el campo de entrada para el nuevo mensaje
        setNewMessageSent(true); // Activar useEffect para obtener las conversaciones actualizadas
        console.log(newMessageSent);
      }

      // Usar el valor actualizado de selectedUser para setSelectedUser
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //* USEEFFECT  1 PARA CONTROLAR QUE SI EL SELECTED USER  DEL CONTEXTO ES NULL, HAGA UN FETCH

  //*---FUNCIÓN PARA CAMBIAR DE CONVERSACIÓN Y SETEAR A LEIDO-------------------------------

  const handleConversations = async (participant, index, user) => {
    console.log(participant);
    console.log(index);
    setConversationName(user);
    setSelectedUser(participant);

    setChats(differentUserConversations[index]);
    console.log("chats en handle", chats);
    //*Función para ver los mensajes que están leidos
    const messageIds = chats.conversation
      .filter(
        (element) =>
          typeof element.isRead === "boolean" &&
          !element.isRead &&
          element.senderID != user?.id
      )
      .map((element) => element.id);
    //*Seteamos a leido

      const response = await markAsRead(messageIds)
      setTotalMessages(0)
    

    console.log("messagesid", messageIds);
  };
console.log(totalMessages)
  return (
    <div className="chat-main">
      <div className="headerChatText">
        <div className="headerChatOne">
          <h3>Mensajes</h3>
        </div>
        <div className="headerChatTwo">
          <h3>
            {conversationName != null &&
              `Conversation with ${conversationName}`}
          </h3>
        </div>
      </div>
      <div className="msg-page-wrapper">
        <div className="conversations-container">
          {differentUserConversations?.map((participant, index) => {
            //* Filtrar los mensajes no leídos para el usuario actual si el reciever es el user y el estado es falso
            const unreadMessages = participant.conversation.filter(
              (message) =>
                message.receiverID === user?.id && message.isRead === false
            );
            return (
              <div
                key={index}
                className="conversation-wrapper"
                onClick={() =>
                  handleConversations(participant.user, index, participant.name)
                }
                style={{
                  backgroundColor:
                    unreadMessages.length > 0 ? "#0070c9" : "#1d1b1f4b",
                }}
              >
                <img
                  className="conversation-user-img"
                  src={participant.image}
                />
                <div className="conversation-text-wrapper">
                  <h4 className="conversation-userName">{participant?.name}</h4>
                  <h5 className="conversation-userText">
                    {participant.conversation.length > 0
                      ? participant.conversation[
                          participant.conversation.length - 1
                        ].text
                      : ""}
                  </h5>
                  {/* Agregar el número de mensajes no leídos a la etiqueta p */}
                  {unreadMessages.length > 0 && (
                    <span>{unreadMessages.length} mensajes no leídos</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="messages-container">
          <div className="header-messages">
            <div className="sended-messages-wrapper">
              {chats?.conversation?.map((message, index) => (
                <div key={index} className="message">
                  <img
                    className="chat-user-img"
                    src={
                      message?.sender == user?.id
                        ? user.image
                        : message.senderImage
                    }
                  />
                  <h4>
                    <b>
                      {message?.sender == user?.id
                        ? user.user
                        : message.senderName}
                    </b>
                  </h4>
                  <p>{message.text}</p>
                  <h5>{message.createdAt}</h5>
                </div>
              ))}{" "}
            </div>
          </div>
          <div className="input-message-wrapper">
            <input
              className="input-msg"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="sendmsg-btn" onClick={handleNewMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
