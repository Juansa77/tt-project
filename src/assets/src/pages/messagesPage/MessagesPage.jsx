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
  const [selectOtherUser, setSelectOtherUser] = useState()

  const senderID = user?.id;
  const [receiverID, setReceiverID] = useState(_id);
 
useEffect(()=>{

  if(user.id !== _id){

    setSelectedUser(_id)

  }

},[])

  //* USEEFFECT PARA CARGAR LAS CONVERSACIONES DEL USUARIO
/*
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

  console.log("last pàrticipant index", lastParticipantID)*/
  //* USEEFFECT PARA CARGAR LOS CHATS DE LOS USUARIOS



  useEffect(()=>{

    const fetchConversations = async () => {
      try {

          // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
          const response = await getConversations(_id);
          const dataFiltered = response.filter(element => element.participant._id !== user.id)
   
          setLastParticipant(dataFiltered?.length -1)
          console.log(lastParticipant)
          setLastParticipantID(dataFiltered[lastParticipant]?.participant?._id)
          setConversations(dataFiltered);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();


  },[senderID])

  console.log("last pàrticipant index", lastParticipantID)


  //*--------------CARGAR CHAT CON USUARIO------------------------
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
/*
    if (senderID == receiverID) {
      setReceiverID(lastParticipantID);
    }
*/console.log(receiverID)
    getChat(senderID, receiverID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setChats(data);
        console.log("chats en data", data)
        
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [senderID, receiverID, newMessage]);

 console.log("selecteduser", selectedUser)
  
 
 
 //* Función del boton del input para enviar el mensaje-----------------------------

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
    console.log("participant en cambio de conversación",participant)
    
    setSelectedUser(participant)
    console.log(selectedUser)
    getChat(senderID, participant)
      .then((data) => {
        // Almacenar los datos en el estado local
        
        setChats(data);
        console.log("data de conversation handle", data)
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  };


  const handleReadMessage = async() =>{

    console.log()
  }
console.log("selecteduser", selectedUser)
console.log("select other user", selectOtherUser)


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
                    message.sender == user.id ? user.image : user?.id == selectedUser?  selectedUser?.file : selectOtherUser?.file
                  }
                />
                <h4>
                  <b>
                    {  message.sender == user.id ? user.user : user?.id == selectedUser? selectedUser?.name : selectOtherUser?.name}
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
