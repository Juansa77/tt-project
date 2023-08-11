import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContext";
import "./DetailGame.css";
import { FaClock } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

import { useAuth } from "../contexts/authContext";
import {
  addGameToUser,
  removeGameInUser,
  gameByID,
  gameByCity,
  gameByType,
} from "../services/API_USER/game.service";
import MiniUserCard from "./MiniUserCard";
import { useUserContext } from "../contexts/UserContext";
import Swal from "sweetalert2";
import MiniGameCard from "./MiniGameCard";

const DetailGame = () => {
  const { _id } = useParams();
  const { selectedGame, setSelectedGame } = useGameContext();
  const [gameUsers, setGameUsers] = useState(null);
  const [blurCount, setBlurCount] = useState(40);
  const { user, userLogin } = useAuth();
  const userHasGame = user?.games?.includes(_id);
  const [response, setResponse] = useState([]);
  const [responseType, setResponseType] = useState();
  const [isLoadingResponse, setIsLoadingResponse] = useState(true);
  const userID = user?.id;

  //* --Game by category------
  const gameLikeCatan = "Strategy,Negotiation,Economic,Family";
  const gamesStarWars = "Movies: Star Wars";

  const handleGameByType = async (type) => {
    console.log(type);
    try {
      const responseData = await gameByType(type);
      setResponseType(responseData);
      setIsLoadingResponse(false);
    } catch (error) {
      console.log(error);
    }
  };

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

  console.log(selectedGame);

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
  console.log("responseType", responseType);
  console.log(responseType?.length);
  console.log(user);
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
              {user === null ? null : userHasGame === false ? ( // No renderizar nada si el usuario es null
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
              <div className="playtime-detail">
                <FaClock size={"25px"} /> {selectedGame?.playTime}
              </div>
              <div className="playtime-detail">
                <FaUsers size={"25px"} /> {selectedGame?.players}
              </div>
              <div className="playtime-detail">{selectedGame?.age}</div>
            </div>
            <div className="game-description-container">
              <h1>{selectedGame?.description}</h1>
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
        <div className="detail-category-container">
        <h1>Tags:</h1>
              <div className="detail-category-text">
                {selectedGame?.typesList.map(
                  (type, index) =>
                    index < 8 && (
                      <p className="tagGameTxt" onClick={() => handleGameByType(type)} key={type}>
                        {type}
                      </p>
                    )
                )}
              </div>
            </div>
        <div className="game-tags-selection">
      
          {!isLoadingResponse &&
            responseType?.data?.length > 0 &&
            responseType.data.map(
              (game, index) =>
                index < 11 && (
                  <div key={game.id}>
                    <MiniGameCard title={game.title} image={game.image} />
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailGame;
