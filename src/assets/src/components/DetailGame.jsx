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
  gameByMultiQuery,
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
  const userHasGame = user?.games?.some((game) => game._id == _id);
  const [response, setResponse] = useState([]);
  const [responseSimilarGames, setResponseSimilarGames] = useState([]);
  const [responseType, setResponseType] = useState();
  const [isLoadingResponse, setIsLoadingResponse] = useState(true);
  const userID = user?.id;

  //* --Game by category------

  const handleGameByType = async (type) => {

    try {
      const responseData = await gameByType(type);
      setResponseType(responseData);
      setIsLoadingResponse(false);
    } catch (error) {
      console.log(error);
    }
  };

  //* FUNCIÓN PARA ACCEDER A LA PÁGINA DE  DETALLE DE CADA JUEGO

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);
    window.scrollTo(0, 0);
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
  const handleAddGame = async (
    gameId,
    rating,
    playTime,
    players,
    typesList
  ) => {
    try {
     

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
        games: [
          ...user.games,
          {
            _id: gameId,
            rating: rating,
            playTime: playTime,
            players: players,
            typesList: typesList,
          },
        ], // Agrega el nuevo juego al array de juegos
      };
      const dataString = JSON.stringify(updatedUser);
      // Actualiza la variable userLogin en el contexto
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  //* ---LÒGICA PARA QUITAR JUEGO AL USUARIO -------------------
  const handleRemoveGame = async (
    gameId,
    rating,
    playTime,
    players,
    typesList
  ) => {
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
  const userGamesData = [];

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

  //* LÓGICA PARA MOSTRAR JUEGOS SIMILARES



  useEffect(() => {
    userGamesData.push({
      title: selectedGame?.title,
      types: selectedGame?.typesList?.slice(0, 2),
      players: selectedGame?.players,
      rating: selectedGame?.rating,
      playTime: selectedGame?.playTime,
    });
    const fetchData = async () => {
  
      const data = await gameByMultiQuery(
        selectedGame?.typesList?.slice(0, 1),
        selectedGame?.rating,
        selectedGame?.players,
        selectedGame?.playTime
      );

 
      setResponseSimilarGames(data);
      console.log(data);
    };
    fetchData();
  }, [selectedGame]);


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
    window.scrollTo(0, 0);
  };

  console.log(userHasGame);
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
              <div className="gameDetailBasics">
                <div className="playtime-detail">
                  <FaClock size={"25px"} /> {selectedGame?.playTime}
                </div>
                <div className="playtime-detail">
                  <FaUsers size={"25px"} /> {selectedGame?.players}
                </div>
                <div className="playtime-detail">{selectedGame?.age}</div>
              </div>
              <h1 className="game-name-detail">{selectedGame?.title}</h1>
              <h1 className="detailRating">{selectedGame?.rating}</h1>
              <div className="btn-detail-container">
                <>
                  {user == null ? null : userHasGame == false ? ( // No renderizar nada si el usuario es null
                    <button
                      className="btn-game"
                      onClick={() =>
                        handleAddGame(
                          selectedGame._id,
                          selectedGame.rating,
                          selectedGame.playTime,
                          selectedGame.players,
                          selectedGame.typesList
                        )
                      }
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
            </div>
          </div>

          <div className="game-data-detail">
            <h1>{selectedGame?.description}</h1>
          </div>
        </div>

        {gameUsers?.length > 0 && (
          <div className="detailGame-userWrap">
            {gameUsers?.length > 0 && (
              <>
                <div className="textDetailUserGame">
                  <h1>En tu ciudad lo tienen...</h1>
                </div>
                <div className="usersGameDetailWrapper">
                  {gameUsers?.length > 0 &&
                    gameUsers?.map((friend, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectFriend(friend)}
                      >
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
        )}

        {responseSimilarGames?.data?.length > 0 && (
          // Agrega un h1 si hay datos en responseSimilarGames.data
          <h1 className="similarGamesHeaderText">Juegos similares:</h1>
        )}

        {responseSimilarGames?.data?.length > 0 && (
          <div className="similarGamesWrap">
            {responseSimilarGames?.data?.map(
              (game, index) =>
                index < 7 && (
                  <div key={index}>
                    <>
                      <div
                        className="card-detail-recomendation"
                        onClick={() => handleSelectGame(game)}
                      >
                        <img
                          className="image-detailSimilar"
                          src={game.image}
                          alt={`${game.title} cover`}
                        />
                        <div className="title-detail-recomendation">
                          <h2 className="title-recomendationDetail">
                            {game.title}
                          </h2>
                        </div>
                      </div>
                    </>
                  </div>
                )
            )}
          </div>
        )}

        <div className="detail-category-container">
          <h1>Tags:</h1>
          <div className="detail-category-text">
            {selectedGame?.typesList.map(
              (type, index) =>
                index < 10 && (
                  <p
                    className="tagGameTxt"
                    onClick={() => handleGameByType(type)}
                    key={type}
                  >
                    {type}
                  </p>
                )
            )}
          </div>
        </div>
        <div className="similarGamesWrap">
          {!isLoadingResponse &&
            responseType?.data?.length > 0 &&
            responseType.data.map(
              (game, index) =>
                index < 7 && (
                  <div key={index}>
                    <>
                      <div
                        className="card-detail-recomendation"
                        onClick={() => handleSelectGame(game)}
                      >
                        <img
                          className="image-detailSimilar"
                          src={game.image}
                          alt={`${game.title} cover`}
                        />
                        <div className="title-detail-recomendation">
                          <h2 className="title-recomendationDetail">
                            {game.title}
                          </h2>
                        </div>
                      </div>
                    </>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailGame;
