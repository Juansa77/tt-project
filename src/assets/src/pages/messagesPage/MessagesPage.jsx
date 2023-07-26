import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import {
  getChat,
  sendNewMessage,
  getConversations,
} from "../../services/API_USER/message.service";
import "./MessagesPage.css";
import React, { useEffect, useState } from "react";
import { getUserById } from "../../services/API_USER/user.service";

const MessagesPage = () => {
  const { user } = useAuth();
  const { _id } = useParams();
  const { selectedUser, setSelectedUser } = useUserContext();
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState();
  const [conversations, setConversations] = useState();
  const [lastParticipant, setLastParticipant] =useState(null)
  const [lastParticipantID, setLastParticipantID] = useState(null)

  const senderID = user?.id;
  const [receiverID, setReceiverID] = useState(_id);
  console.log(senderID);
  console.log(receiverID);
  console.log("slected user:", selectedUser);
  console.log("user:", user);



  //* USEEFFECT PARA CARGAR LAS CONVERSACIONES DEL USUARIO

  useEffect(() => {
    getConversations(senderID)
      .then((data) => {
        console.log("data de conversation", data)
        // Almacenar los datos en el estado local
        const dataFiltered = data.filter(element => element.participant._id !== user.id)
        console.log("datafiltered", dataFiltered)
        setLastParticipant(dataFiltered?.length -1)
        setLastParticipantID(dataFiltered[lastParticipant]?.participant?._id)
        setConversations(dataFiltered);
      })
      .catch((error) => {
        console.error("Error fetching conversarions:", error);
      });
  }, [senderID]);

  console.log("last pàrticipant index", lastParticipantID)
  //* USEEFFECT PARA CARGAR LOS CHATS DE LOS USUARIOS
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
/*
    if (senderID == receiverID) {
      setReceiverID(lastParticipantID);
    }
*/
    getChat(senderID, receiverID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setChats(data);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [senderID, receiverID, newMessage]);

  //* Función del boton del input para enviar el mensaje

  const handleNewMessage = async () => {
    try {
      const response = await sendNewMessage(senderID, receiverID, newMessage);
      console.log("response del mensaje", response);

      // Después de enviar el mensaje, puedes restablecer el valor de `newMessage` a una cadena vacía.
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //* USEEFFECT  1 PARA CONTROLAR QUE SI EL SELECTED USER  DEL CONTEXTO ES NULL, HAGA UN FETCH
  useEffect(() => {
    console.log("hace el useEffect");
    console.log("selected user del useeefect", selectedUser);
    const fetchUserData = async () => {
      try {
        if (!selectedUser) {
          console.log("el user en contexto es null y entra en el useeeffect");
          // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
          const response = await getUserById(_id);
          setSelectedUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [_id]);

  //*---FUNCIÓN PARA CAMBIAR DE CONVERSACIÓN

  const handleConversations = async (receiverID) => {
    
    getChat(senderID, receiverID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setChats(data);
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  };

  console.log("chats de los usuarios", chats);

  return (
    <div className="msg-page-wrapper">
      <div className="conversations-container">
        {conversations?.map((participant, index) => (
          <div
            key={index}
            className="conversation-wrapper"
            onClick={() => handleConversations(participant.participant._id)}
          >
            <img
              className="conversation-user-img"
              src={participant.participant.image}
            />
            <div className="conversation-text-wrapper">
              <h3>{participant.participant.name}</h3>
              <p>
                {participant?.messages[participant.messages.length - 1]?.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="messages-container">
      {selectedUser ? (
        <h2>Chats with {selectedUser.name}</h2>
      ) : (
        <h2>Chats with Friends</h2>
      )}
        <div className="header-messages">
          <div className="header-text-wrapper"></div>

          <div className="sended-messages-wrapper">
            {chats?.map((message, index) => (
              <div key={index} className="message">
                <img
                  className="chat-user-img"
                  src={
                    message.sender == user.id ? user.image : selectedUser.file
                  }
                />
                <h4>
                  <b>
                    {message.sender == user.id ? user.user : selectedUser.name}
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
  );
};

export default MessagesPage;
