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