import { APIuser } from "./serviceApiUser.config";
import axios from "axios";
import { updateToken } from "../../utils/updateToken";

export const registerUser = async (formData) => {

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "multipart/form-data",
  };


  console.log("formData de register", formData);

  return APIuser.post("http://localhost:8095/api/v1/users/register", formData, {
    headers: headers}) // Incluir los encabezados directamente en el objeto de configuración
    .then((res) => res)
    .catch((error) => error);
};
//?------------------------------------------------------
//*-----------------CHECKCODE-------------------------
//?------------------------------------------------------

export const checkCodeConfirmationUser = async (formData) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  };

  console.log(formData);
  return APIuser.post("http://localhost:8095/api/v1/users/check", formData, {
    headers,
  })
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------CODE RESEND-------------------------
//?------------------------------------------------------

export const resendCode = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  console.log(formData);
  return APIuser.post("/users/resend", formData, config)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------LOGIN-------------------------
//?------------------------------------------------------

export const loginUser = async (formData) => {
  console.log(formData);
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(formData).forEach(([key, value]) => {
    params.append(key, value);
  });
  //* Para hacer la solicitud post, metemos los params y la config
  return APIuser.post(
    "http://localhost:8095/api/v1/users/login",
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------AUTO LOGIN-------------------------
//?------------------------------------------------------

export const autoLoginUser = async (formData) => {
  console.log(formData);
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(formData).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.post(
    "http://localhost:8095/api/v1/users/login/autologin",
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------FORGOT PASSWORD-------------------------
//?------------------------------------------------------

export const forgotPassword = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  console.log(formData);
  return APIuser.post("/users/forgotpassword", formData, config)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------CHANGE PASSWORD-------------------------REVISAR
//?------------------------------------------------------

export const changePasswordUser = async (formData, token) => {
  console.log(formData.token);

  const config = {
    headers: {
      "Content-Type": "	application/json; charset=utf-8",
      Authorization: `Bearer ${formData.token}`,
    },
  };

  return APIuser.patch("/users/changepassword", formData, config)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------UPDATE-------------------------REVISAR
//?------------------------------------------------------

export const updateUser = async (formData) => {
  console.log(formData)
  return APIuser.patch("/users/update/update", formData)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------DELETE-------------------------REVISAR
//?------------------------------------------------------

export const deleteUser = async () => {
  return APIuser.delete("/users")
    .then((res) => res)
    .catch((error) => error);
};
