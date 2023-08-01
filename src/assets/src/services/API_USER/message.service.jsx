import { APIuser } from "./serviceApiUser.config";

//?------------------------------------------------------
//*-----------------SEND NEW MESSAGE-------------------------
//?------------------------------------------------------

export const sendNewMessage = async (senderID, receiverID, newMessage) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  };
  const messageData = {
    senderUserID: senderID,
    receiverUserID: receiverID,
    text: newMessage,
  };


  return APIuser.post(
    "http://localhost:8095/api/v1/messages/new-message",
    JSON.stringify(messageData),
    {
      headers: headers,
    }
  ) // Incluir los encabezados directamente en el objeto de configuración
    .then((res) => res.data)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------GET CHATS------------------------
//?------------------------------------------------------

export const getChat = async (senderID, receiverID) => {

  const params = new URLSearchParams();
  params.append("senderID", senderID);
  params.append("receiverID", receiverID);

  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  return APIuser.get(
    `http://localhost:8095/api/v1/messages/${senderID}/getchat/${receiverID}`,
    params,
    config
  )
    .then((res) => res.data) // Suponiendo que los datos reales de la respuesta están en la propiedad `data`
    .catch((error) => error);
};


//?------------------------------------------------------
//*-----------------GET CONVERSATIONS------------------------
//?------------------------------------------------------

export const getConversations = async (senderID) => {
  const params = new URLSearchParams();
  params.append("senderID", senderID);


  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  return APIuser.get(
    `http://localhost:8095/api/v1/messages/getconversations/${senderID}`,
    params,
    config
  )
    .then((res) => res.data) // Suponiendo que los datos reales de la respuesta están en la propiedad `data`
    .catch((error) => error);
};




//?------------------------------------------------------
//*-----------------MARK AS READ------------------------
//?------------------------------------------------------
export const markAsRead = async (messageIds) => {
  console.log(messageIds)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  };


  return APIuser.put(
    "http://localhost:8095/api/v1/messages/markasread",
    JSON.stringify(messageIds),
    {
      headers: headers,
    }
  ) // Incluir los encabezados directamente en el objeto de configuración
    .then((res) => res.data)
    .catch((error) => error);
};



//?------------------------------------------------------
//*-----------------CHATS GET ALL------------------------
//?------------------------------------------------------

export const getAllChats = async (senderID) => {
console.log(senderID)
  const params = new URLSearchParams();
  params.append("senderID", senderID);


  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  return APIuser.get(
    `http://localhost:8095/api/v1/messages/getchatsinuser/${senderID}`,
    params,
    config
  )
    .then((res) => res.data) // Suponiendo que los datos reales de la respuesta están en la propiedad `data`
    .catch((error) => error);
};
