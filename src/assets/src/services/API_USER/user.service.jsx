import { APIuser } from "./serviceApiUser.config";
import { updateToken } from "../../utils/updateToken";

export const registerUser = async (formData) => {
  const updatedToken = updateToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${updatedToken}`
  };

  console.log(formData)

  return APIuser.post("http://localhost:8095/api/v1/users/register", formData, { headers })
    .then((res) => res)
    .then(console.log(formData))
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------CHECKCODE-------------------------
//?------------------------------------------------------

export const checkCodeConfirmationUser = async (formData) => {
  const headers = {
  
    "Access-Control-Allow-Origin":	"*",
    "Content-Type":	"application/json; charset=utf-8"
  
  };

  console.log(formData)
  return APIuser.post("http://localhost:8095/api/v1/users/check", formData, {headers})
    .then((res) => res)
    .catch((error) => error);
};



//?------------------------------------------------------
//*-----------------LOGIN-------------------------
//?------------------------------------------------------

export const loginUser = async (formData) => {

  console.log(formData)
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
//* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(formData).forEach(([key, value]) => {
    params.append(key, value);
  });
//* Para hacer la solicitud post, metemos los params y la config
  return APIuser.post("http://localhost:8095/api/v1/users/login", params, config)
    .then((res) => res)
    .catch((error) => error);
};



//?------------------------------------------------------
//*-----------------AUTO LOGIN-------------------------
//?------------------------------------------------------

export const autoLoginUser = async (formData) => {

  console.log(formData)
    //*Creamos un objeto de configuración con los headers de la solicitud
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  
    //*Creamos unos params para modificar los parámetros de la url
    const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
    Object.entries(formData).forEach(([key, value]) => {
      params.append(key, value);
    });
  return APIuser.post("http://localhost:8095/api/v1/users/login/autologin", params, config)
    .then((res) => res)
    .catch((error) => error);
};




//?------------------------------------------------------
//*-----------------FORGOT PASSWORD-------------------------
//?------------------------------------------------------

export const forgotPassword = async (formData) => {
  return APIuser.patch("/users/forgotpassword", formData)
    .then((res) => res)
    .catch((error) => error);
};


//?------------------------------------------------------
//*-----------------CHANGE PASSWORD-------------------------REVISAR
//?------------------------------------------------------

export const changePassword = async (formData) => {
  return APIuser.patch("/users/changepassword", formData)
    .then((res) => res)
    .catch((error) => error);
};



//?------------------------------------------------------
//*-----------------UPDATE-------------------------REVISAR
//?------------------------------------------------------

export const updateUser = async (formData) => {
  return APIuser.patch("/users/update", formData)
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
