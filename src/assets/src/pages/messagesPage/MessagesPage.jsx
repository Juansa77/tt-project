import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import {
  getChat,
  sendNewMessage,
  getConversations,
  markAsRead,
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
  const [selectOtherUser, setSelectOtherUser] = useState()
  const [messagesNotReaded, setMessagesNotReaded] = useState(false)

  const senderID = user?.id;

  const [receiverID, setReceiverID] = useState(_id);
 
useEffect(()=>{

  if(selectedUser==null){

    setSelectedUser(_id)

  }

},[])

  //* USEEFFECT PARA CARGAR LAS CONVERSACIONES DEL USUARIO

  useEffect(() => {

    //? RECUERDA QUE HAS CAMBIADO LA _ID POR SENDER ID
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
  //* USEEFFECT PARA CARGAR LAS CONVERSACIONES DE LOS USUARIOS Y SETEAR SELECTED USER EN CASO DE QUE SEA NULL



  useEffect(()=>{

    const fetchConversations = async () => {
      try {
console.log("entra en fetchconversations")
          // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
          const response = await getConversations(user?.id);
          const dataFiltered = response.filter(element => element.participant._id !== user.id)
console.log("data filtered",dataFiltered)

if(selectedUser == null){
setSelectedUser(dataFiltered[dataFiltered.length -1].participant._id)         } 

          setLastParticipantID(dataFiltered[lastParticipant]?.participant?._id)
          setConversations(dataFiltered);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();


  },[senderID, selectedUser])



  //*--------------CARGAR CHAT CON USUARIO------------------------
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
        
        console.log("chats en carga", chats)
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [senderID, receiverID, newMessage]);

 console.log("selecteduser", selectedUser)
  
 
 
 //* Función del boton del input para enviar el mensaje-----------------------------

  const handleNewMessage = async () => {
    try {
      console.log(receiverID)
      const response = await sendNewMessage(senderID, selectedUser, newMessage);
      console.log("response del mensaje", response);

      // Después de enviar el mensaje, puedes restablecer el valor de `newMessage` a una cadena vacía.
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //* USEEFFECT  1 PARA CONTROLAR QUE SI EL SELECTED USER  DEL CONTEXTO ES NULL, HAGA UN FETCH
  useEffect(() => {
    console.log(selectedUser)
    if(user?.id !== selectedUser){
      console.log("entra en el if")
      

    const fetchUserData = async () => {
      try {
        
         console.log(selectedUser)
          // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
          const response = await getUserById(selectedUser);
          setSelectOtherUser(response.data);
      
         
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();}
    
    console.log(selectOtherUser)
  }, [_id, selectedUser]);

  //*---FUNCIÓN PARA CAMBIAR DE CONVERSACIÓN-------------------------------

  const handleConversations = async (participant) => {
    console.log(participant)
   
 
    setSelectedUser(participant)
    console.log(selectedUser)
    getChat(senderID, participant)
      .then((data) => {
        
        
        setChats(data);
//*Lçogica para filtrar mensajes por si están leidos o no
        //*Filtro para quedarme con los mensajes que están sin leer y pillar sus IDS
        const messageIds = data.filter(element => element.isRead === false).map(element => element._id);
    
        console.log("messagesID",messageIds)
      console.log(messageIds.length)
if(messageIds.length==0){
  setMessagesNotReaded(true)
}
console.log(messagesNotReaded)
        markAsRead(messageIds)
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  };




  return (
    <div className="msg-page-wrapper">
      <div className="conversations-container">
        {conversations?.map((participant, index) => (
          <div
            key={index}
            className="conversation-wrapper"
            onClick={() => handleConversations(participant.participant._id)}
            style={{ backgroundColor: messagesNotReaded == true ? "#F0F0F0" : "#FFFFFF" }}
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
        <h2>Chats with {selectOtherUser?.name}</h2>
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
                    message?.sender  == user?.id ? user.image : selectOtherUser?.file
                  }
                />
                <h4>
                  <b>
                    {  message?.sender == user.id ? user.user : user?.id == selectedUser? selectedUser?.name : selectOtherUser?.name}
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
