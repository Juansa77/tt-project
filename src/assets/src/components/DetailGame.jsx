import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContext";
import "./DetailGame.css";

import { useAuth } from "../contexts/authContext";
import {
  addGameToUser,
  removeGameInUser,
} from "../services/API_USER/game.service";

const DetailGame = () => {
  const { _id } = useParams();
  const { selectedGame } = useGameContext();
  console.log(_id);

  console.log(selectedGame);

  //*--------------FUNCIONALIDAD PARA AGREGAR EL JUEGO AL USUARIO-----

  const { user, userLogin } = useAuth();
  const [response, setResponse] = useState([]);
  const userID = user?.id;

  const handleAddGame = async (gameId) => {
    try {
      console.log("esto es user", user);

      const token = user?.token;
      const responseData = await addGameToUser(userID, gameId, token);
      setResponse(responseData);

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

  const handleRemoveGame = async (gameId) => {
    try {
      const userID = user?._id;
      const token = user?.token;
      const responseData = await removeGameInUser(userID, gameId, token);
      setResponse(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="game-detail">
      <div className="game-detail-container">
        <img className="game-cover-detail" src={selectedGame.image} />
        <h1 className="game-name-detail">{selectedGame.title}</h1>
      </div>
      <div className="btn-detail-container">
        <button className="btn-game" onClick={() => handleAddGame(selectedGame._id)}>
          AÑADIR JUEG0
        </button>
        <button className="btn-game" onClick={() => handleRemoveGame(selectedGame._id)}>
          ELIMINAR JUEGO
        </button>
      </div>
      <div className="game-data-detail">
        <p className="playtime-detail">
          Tiempo de juego: {selectedGame.playTime}
        </p>
        <p className="playtime-detail">Jugadores/as: {selectedGame.players}</p>
        <p className="playtime-detail">Categorias: {selectedGame.typesList}</p>
      </div>
    </div>
  );
};

export default DetailGame;
