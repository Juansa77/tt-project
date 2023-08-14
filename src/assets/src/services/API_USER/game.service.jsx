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


//?----------------------------------------------
//*---GAME BY CITY----------------------
//?----------------------------------------------
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


//?----------------------------------------------
//*---GAME BY RATING----------------------
//?----------------------------------------------

export const gameByRating = async (rating) => {

  console.log(rating)
      //*Creamos un objeto de configuración con los headers de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
    
      //*Creamos unos params para modificar los parámetros de la url
      const params = new URLSearchParams();
    //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
      Object.entries(rating).forEach(([key, value]) => {
        params.append(key, value);
      });
    return APIuser.get(`http://localhost:8095/api/v1/games/byrate/${rating}`, params, config)
      .then((res) => res)
      .catch((error) => error);
  };

  
//?----------------------------------------------
//*---GAME BY TYPE----------------------
//?----------------------------------------------


export const gameByType = async (type) => {

  console.log(type)
      //*Creamos un objeto de configuración con los headers de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
    
      //*Creamos unos params para modificar los parámetros de la url
      const params = new URLSearchParams();
    //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
      Object.entries(type).forEach(([key, value]) => {
        params.append(key, value);
      });
    return APIuser.get(`http://localhost:8095/api/v1/games/bytype?type=${type}`, params, config)
      .then((res) => res)
      .catch((error) => error);
  };



//?----------------------------------------------
//*---GAME BY MULTI QUERY----------------------
//?----------------------------------------------


export const gameByMultiQuery = async (types, rating, players, playTime) => {

  console.log(types)
      //*Creamos un objeto de configuración con los headers de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
    
      //*Creamos unos params para modificar los parámetros de la url
      const params = new URLSearchParams();
    //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
      Object.entries(types).forEach(([key, value]) => {
        params.append(key, value);
      });
    return APIuser.get(`http://localhost:8095/api/v1/games/gamesort?type=${types}&rating=${rating}&players=${players}&playTime=${playTime}`, params, config)
      .then((res) => res)
      .catch((error) => error);
  };



  //?----------------------------------------------
//*---GAME BY  PLAYERS----------------------
//?----------------------------------------------



export const gameByPlayers = async (players) => {

  console.log(players)
      //*Creamos un objeto de configuración con los headers de la solicitud
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
    
      //*Creamos unos params para modificar los parámetros de la url
      const params = new URLSearchParams();
    //* Por cada clave y valor en formdata, los metemos en los params de la URL. Convertimos sus propiedades en parámetros
      Object.entries(players).forEach(([key, value]) => {
        params.append(key, value);
      });
    return APIuser.get(`http://localhost:8095/api/v1/games/byplayers?players=${players}`, params, config)
      .then((res) => res)
      .catch((error) => error);
  };

