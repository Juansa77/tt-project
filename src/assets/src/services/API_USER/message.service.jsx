import { APIuser } from "./serviceApiUser.config";


//?------------------------------------------------------
//*-----------------SEND NEW MESSAGE-------------------------
//?------------------------------------------------------

export const sendNewMessage = async (formData) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    };
  
    console.log("formData de sendNewMessage", formData);
  
    return APIuser.post("http://localhost:8095/api/v1/messages/new-message", formData, {
      headers: headers,
    }) // Incluir los encabezados directamente en el objeto de configuración
      .then((res) => res)
      .catch((error) => error);
  };