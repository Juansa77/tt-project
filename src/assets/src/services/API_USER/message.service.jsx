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

  console.log(messageData);
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
  console.log("receiverID en ser, chats", receiverID)
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
