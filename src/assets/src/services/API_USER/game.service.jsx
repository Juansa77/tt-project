import { APIuser } from "./serviceApiUser.config";
import { updateToken } from "../../utils/updateToken";

export const gameByName = async (title) => {

    console.log(title)
      //*Creamos un objeto de configuración con los headers de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
    
      //*Creamos unos params para modificar los parámetros de la url
      const params = new URLSearchParams();
    //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
      Object.entries(title).forEach(([key, value]) => {
        params.append(key, value);
      });
    return APIuser.get(`http://localhost:8095/api/v1/games/title/${title}`, params, config)
      .then((res) => res)
      .catch((error) => error);
  };

  export const gameByID = async (id) => {

    console.log(id)
      //*Creamos un objeto de configuración con los headers de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
    
      //*Creamos unos params para modificar los parámetros de la url
      const params = new URLSearchParams();
    //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
      Object.entries(id).forEach(([key, value]) => {
        params.append(key, value);
      });
    return APIuser.get(`http://localhost:8095/api/v1/games/id/${id}`, params, config)
      .then((res) => res)
      .catch((error) => error);
  };


  
export const addGameToUser = async (userID, gameID, token) => {

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `http://localhost:8095/api/v1/games/${userID}/add-game/${gameID}`;

  return APIuser.post(url, null, config)
    .then((res) => res)
    .catch((error) => error);
};


  
export const removeGameInUser = async (userID, gameID, token) => {

  //*Creamos un objeto de configuración con los headers de la solicitud
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`, // Añade el token de autenticación en los encabezados
    },
  };

  //*Creamos unos params para modificar los parámetros de la url
  const params = new URLSearchParams();
//* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
  Object.entries(userID).forEach(([key, value]) => {
    params.append(key, value);
  });
return APIuser.post(`http://localhost:8095/api/v1/games/${userID}/delete-game-user/${gameID}`, params, config)
  .then((res) => res)
  .catch((error) => error);
};

//?----------------------------------------------
//*---GAME BY PLAYING TIME----------------------
//?----------------------------------------------

export const gameByPlayingTime = async (time) => {

  console.log(time)
    //*Creamos un objeto de configuración con los headers de la solicitud
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  
    //*Creamos unos params para modificar los parámetros de la url
    const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
    Object.entries(time).forEach(([key, value]) => {
      params.append(key, value);
    });
  return APIuser.get(`http://localhost:8095/api/v1/games/playing-time/${time}`, params, config)
    .then((res) => res)
    .catch((error) => error);
};

export const gameByCity = async (game, city) => {

console.log(game, city)
    //*Creamos un objeto de configuración con los headers de la solicitud
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  
    //*Creamos unos params para modificar los parámetros de la url
    const params = new URLSearchParams();
  //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
    Object.entries(game).forEach(([key, value]) => {
      params.append(key, value);
    });
  return APIuser.get(`http://localhost:8095/api/v1/games/${game}/gamebycity/${city}`, params, config)
    .then((res) => res)
    .catch((error) => error);
};
