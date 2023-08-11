import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContext";
import "./DetailGame.css";

import { useAuth } from "../contexts/authContext";
import {
  addGameToUser,
  removeGameInUser,
  gameByID,
  gameByCity,
} from "../services/API_USER/game.service";
import MiniUserCard from "./MiniUserCard";
import { useUserContext } from "../contexts/UserContext";
import Swal from "sweetalert2";

const DetailGame = () => {
  const { _id } = useParams();
  const { selectedGame, setSelectedGame } = useGameContext();
  const [gameUsers, setGameUsers] = useState(null);
  const [blurCount, setBlurCount] = useState(40);
  const { user, userLogin } = useAuth();
  const userHasGame = user?.games?.includes(_id);
  const [response, setResponse] = useState([]);
  const userID = user?.id;

  //*--------------FUNCIONALIDAD PARA AGREGAR EL JUEGO AL USUARIO-----

  //* USEEFFECT PARA EL BLUR DE LA IMAGEN DE FONDO----

  useEffect(() => {
    const interval = setInterval(() => {
      // Incrementa el valor de blurCount en 10 cada segundo hasta llegar a 100
      if (blurCount < 100) {
        setBlurCount((prevBlurCount) => prevBlurCount + 1);
      }
    }, 10); // 1000 milisegundos = 1 segundo

    return () => {
      // Limpia el intervalo cuando el componente se desmonte
      clearInterval(interval);
    };
  }, [blurCount]);



  //* ---LÒGICA PARA AÑADIR JUEGO AL USUARIO ---------
  const handleAddGame = async (gameId) => {
    try {
      console.log("esto es user", user);

      const token = user?.token;
      const responseData = await addGameToUser(userID, gameId, token);
      setResponse(responseData);
      if (responseData?.status == 200) {
        Swal.fire({
          title: "Game added to your profile",
          icon: "success",
          confirmButtonText: "OK",
          background: "#363636",
          confirmButtonColor: {
            background: "beige", // Cambia el color de fondo del botón de confirmación
            text: "#363636", // Cambia el color del texto del botón de confirmación
          },
          color: `beige`, // Cambia el color de fondo del cuadro de alerta
          // Aplica un fondo personalizado como backdrop
        });
      }

      const updatedUser = {
        ...user,
        games: [...user.games, gameId], // Agrega el nuevo juego al array de juegos
      };
      const dataString = JSON.stringify(updatedUser);
      // Actualiza la variable userLogin en el contexto
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  //* ---LÒGICA PARA QUITAR JUEGO AL USUARIO -------------------
  const handleRemoveGame = async (gameId) => {
    try {
      const token = user?.token;
      const responseData = await removeGameInUser(userID, gameId, token);
      setResponse(responseData);
      console.log(responseData);
      if (responseData?.status == 200) {
        Swal.fire({
          title: "Game deleted in your profile",
          icon: "success",
          confirmButtonText: "OK",
          background: "#363636",
          confirmButtonColor: {
            background: "beige", // Cambia el color de fondo del botón de confirmación
            text: "#363636", // Cambia el color del texto del botón de confirmación
          },
          color: `beige`, // Cambia el color de fondo del cuadro de alerta
          // Aplica un fondo personalizado como backdrop
        });
      }

      const updatedGames = user.games.filter((game) => game !== gameId);

      const updatedUser = {
        ...user,
        games: updatedGames,
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

 
  //* USEEFFECT  1 PARA CONTROLAR QUE SI EL GAME DEL CONTEXTO ES NULL, HAGA UN FETCH
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!selectedGame) {
          console.log("el juego en contexto es null y entra en el useeeffect");
          // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
          const response = await gameByID(_id);
          setSelectedGame(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [_id]);

  //* ---USEFFECT PARA CONTROLAR LA CARGA DE LOS USUARIOS QUE TIENEN EL JUEGO
  useEffect(() => {
    const fetchGameUsers = async () => {
      try {
        console.log("el juego en contexto es null y entra en el useeeffect");
        // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
        const response = await gameByCity(selectedGame?.title, user?.city);
        setGameUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGameUsers();
  }, [selectedGame]);

  //* LÓGICA PARA NAVIGATE A PÁGINA DE DETALLE DEL USUARIO

  const { setSelectedUser } = useUserContext();

  // Instancia de la historia del enrutador para redirigir a la página de detalles
  const navigate = useNavigate();

  const handleSelectFriend = (friend) => {
    console.log("amigo seleccionado>", friend);
    setSelectedUser(friend);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/users/${friend._id}`);
  };

  return (
    <div
      className="game-detail"
      style={{ backgroundImage: `url("${selectedGame?.image}")` }}
    >
      <div
        className="detail-wrapper"
        style={{ backdropFilter: `blur(${blurCount}px)` }}
      >
        <div className="game-detail-container">
          <div className="detailGameMain">
            <img className="game-cover-detail" src={selectedGame?.image} />
            <div className="detailMainTextWrapper">
              <h1 className="game-name-detail">{selectedGame?.title}</h1>
              <h1 className="detailRating">{selectedGame?.rating}</h1>
            </div>
          </div>
          <div className="btn-detail-container">
            <>
              {userHasGame == false ? (
                <button
                  className="btn-game"
                  onClick={() => handleAddGame(selectedGame._id)}
                >
                  + ADD GAME
                </button>
              ) : (
                <button
                  className="btn-game"
                  onClick={() => handleRemoveGame(selectedGame._id)}
                >
                  - DELETE GAME
                </button>
              )}
            </>
          </div>
          <div className="game-data-detail">
            <div className="gameDetailBasics">
              <p className="playtime-detail">
                Tiempo de juego: {selectedGame?.playTime}
              </p>
              <p className="playtime-detail">
                Jugadores/as: {selectedGame?.players}
              </p>
            </div>
            <div className="detail-category-container">
              <p className="detail-category-text">
                Categorias: {selectedGame?.typesList}
              </p>
            </div>
          </div>
        </div>
        <div className="detailGame-userWrap">
          {gameUsers?.length > 0 && (
            <>
              <div className="textDetailUserGame">
                <h1>En tu ciudad lo tienen...</h1>
              </div>
              <div className="usersGameDetailWrapper">
                {gameUsers?.length > 0 &&
                  gameUsers?.map((friend, index) => (
                    <div key={index} onClick={() => handleSelectFriend(friend)}>
                      <MiniUserCard
                        key={index}
                        title={friend.name}
                        image={friend.file}
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailGame;
