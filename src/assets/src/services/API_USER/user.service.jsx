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
    headers: headers,
  }) // Incluir los encabezados directamente en el objeto de configuración
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
  console.log(formData);
  return APIuser.patch("/users/update/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------DELETE-------------------------REVISAR
//?------------------------------------------------------

export const deleteUser = async (user) => {
  console.log(user.token);
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const userID = user?.id;
  return APIuser.delete(`/users/${userID}`, config)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------GET USER BY CITY-------------------------
//?------------------------------------------------------

export const getUserByCity = async (city) => {
  console.log(city);
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(city).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.get(
    `http://localhost:8095/api/v1/users/getuser/city/${city}`,
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------SEND REQUEST-------------------------
//?------------------------------------------------------

export const sendFriendRequest = async (userID, friendID, token) => {
 
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `http://localhost:8095/api/v1/users/${userID}/friend-request/${friendID}`;

  return APIuser.post(url, null, config)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------GET FRIEND REQUEST-------------------------
//?------------------------------------------------------

export const getFriendRequests = async (id) => {

  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(id).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.get(
    `http://localhost:8095/api/v1/users/get-friend-request/${id}`,
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*----------------- REJECT REQUEST-------------------------
//?------------------------------------------------------

export const rejectFriendRequest = async (userID, friendID, token) => {
  console.log(userID);
  console.log(friendID);
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `http://localhost:8095/api/v1/users/${userID}/reject-request/${friendID}`;

  return APIuser.post(url, null, config)
    .then((res) => res)
    .catch((error) => error);
};


//?------------------------------------------------------
//*----------------- CANCEL REQUEST-------------------------
//?------------------------------------------------------

export const cancelFriendRequest = async (userID, friendID, token) => {
  console.log(userID);
  console.log(friendID);
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `http://localhost:8095/api/v1/users/${userID}/cancel-request/${friendID}`;

  return APIuser.post(url, null, config)
    .then((res) => res)
    .catch((error) => error);
};




//?------------------------------------------------------
//*-----------------ADD FRIEND TO USER-------------------------
//?------------------------------------------------------

export const addFriendToUser = async (userID, friendID, token) => {
  console.log(friendID);
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `http://localhost:8095/api/v1/users/${userID}/add-friend/${friendID}`;

  return APIuser.post(url, null, config)
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------DELETE FRIEND IN USER-------------------------
//?------------------------------------------------------

export const deleteFriendInUser = async (userID, friendID, token) => {
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`, // Añade el token de autenticación en los encabezados
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(userID).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.post(
    `http://localhost:8095/api/v1/users/${userID}/delete-friend/${friendID}`,
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------GET GAMES IN USER-------------------------
//?------------------------------------------------------

export const getGamesInUser = async (id) => {
  console.log(id);
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(id).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.get(
    `http://localhost:8095/api/v1/users/getuser/games/${id}`,
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------GET FRIENDS IN USER-------------------------
//?------------------------------------------------------

export const getFriendsInUser = async (id) => {
  console.log(id);
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(id).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.get(
    `http://localhost:8095/api/v1/users/getuser/friends/${id}`,
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};

//?------------------------------------------------------
//*-----------------GET USER BY ID-------------------------
//?------------------------------------------------------

export const getUserById = async (id) => {
  console.log("id de user by id", id);
  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(id).forEach(([key, value]) => {
    params.append(key, value);
  });
  return APIuser.get(
    `http://localhost:8095/api/v1/users/getuser/${id}`,
    params,
    config
  )
    .then((res) => res)
    .catch((error) => error);
};
