import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import { getChat, sendNewMessage } from "../../services/API_USER/message.service";
import "./MessagesPage.css";



import React, { useEffect, useState } from "react";

const MessagesPage = () => {
  const { user } = useAuth();
  const { _id } = useParams();
  const { selectedUser, setSelectedUser } = useUserContext();
  const [newMessage, setNewMessage] = useState("")
  const [chats, setChats] = useState();

  const senderID = user?.id;
  const receiverID = _id;
console.log(senderID)
console.log(receiverID)

  //* USEEFFECT PARA CARGAR LOS CHATS DE LOS USUARIOS 
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
    getChat(senderID, receiverID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setChats(data);
       
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, [senderID, receiverID, newMessage]);

  const handleNewMessage = async () =>{
    try {
     
      const response = await sendNewMessage(senderID, receiverID, newMessage);
      console.log("response del mensaje", response)

      // Después de enviar el mensaje, puedes restablecer el valor de `newMessage` a una cadena vacía.
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }

  }

  console.log("chats de los usuarios",chats)

  return (
    <div className="messages-container">
      <div className="header-messages">
      <div className="header-text-wrapper">  <h1>MESSAGES</h1></div>
      
        <div className="sended-messages-wrapper">{chats?.map((message, index)=>(
          <div key={index}><h4 >{message.text}</h4></div>
        ))} </div>
      </div>
      <div className="input-message-wrapper">
        <input type="text" placeholder="Type your message..."  value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}/>
        <button className="sendmsg-btn" onClick={handleNewMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessagesPage;
