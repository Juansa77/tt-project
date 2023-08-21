import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import { FaArrowLeft } from 'react-icons/fa';

import "./GameSearch.css";
import {
  addGameToUser,
  gameByName,
  gameByPlayingTime,
  removeGameInUser,
  gameByRating, gameByType, gameByPlayers
} from "../../services/API_USER/game.service";
import GameCard from "../../components/GameCard";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";



const GameSearch = () => {
  const { user, userLogin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState([]);
  const userID = user?.id;

//* FUNCIONES PARA LA BÚSQUEDA------------------------

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const title = searchTerm;
      const responseData = await gameByName(title);
      setResponse(responseData);
    } catch (error) {
      console.log(error);
    }
  };
 
//* FUNCIONES AÑADIR JUEGO------------------------

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

  //* FUNCIÓN PARA ALMACENAR LOS DATOS DEL JUEGO SELECCIONADO PARA USARLO EN DETAIL Y NO HACER UNA NUEVA LLAMADA

    //* SACAMOS DEL CONTEXTO DE GAME PARA ALMACENAR LOS DATOS DEL JUEGO
    const { setSelectedGame } = useGameContext();


  //* Instancia de la historia del enrutador para redirigir a la página de detail
  const navigate = useNavigate();

  const handleSelectGame = (game) => {
    console.log(game)
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);

  };

//*----- SERVICIOS PARA LOS DIVS PRESELECCIONADOS-----------------------
//?--------------------------------------------------------------------------

//* --Game by time------
const  gameShort = "20 Min"
const gameLong= "60 Min"
const handleGameByTime = async(time)=>{

  try {
    const responseData = await gameByPlayingTime(time);
    setResponse(responseData);
  } catch (error) {
    console.log(error);
  }

}

//* --Game by rating------
const gameRating = "8.5"

const handleGameByRating = async(rating)=>{

  try {
    const responseData = await gameByRating(rating);
    setResponse(responseData);
  } catch (error) {
    console.log(error);
  }

}

//* --Game by category------
const gameLikeCatan = "Strategy,Negotiation,Economic,Family"
const gamesStarWars = "Movies: Star Wars"
const handleGameByType = async(type)=>{

  try {
    const responseData = await gameByType(type);
    setResponse(responseData);
  } catch (error) {
    console.log(error);
  }

}

//* --Game by players------

const onePlayer= "1 Players"
const twoPlayers= "2 Players"
const fourPlayers= "2–4 Players"
const handleGameByPlayers= async(players)=>{

  try {
    const responseData = await gameByPlayers(players);
    setResponse(responseData);
  } catch (error) {
    console.log(error);
  }

}

//* FUNCIÓN PARA VOLVER ATRÁS DESPUES DE BÚSQUEDA

const handleReset = () => {
  // Restablece los valores de búsqueda a sus valores iniciales
  setSearchTerm("");
  setResponse([]);
}

  return (
    <>
      <div className="gamesearch-main">
        <div className="gameSearch">
          <SearchBar
            placeholder="Type a name..."
            searchTerm={searchTerm}
            handleChange={handleChange}
            handleSearch={handleSearch}
          />
          {response?.response?.data === "Game not found" && (
            <h1>Game not found</h1>
          )}
          {response?.data?.length > 0 && <button className= "back-btn" onClick={handleReset}><FaArrowLeft size="25px"/></button>}
        </div>
        <div className="gameSearch-container">
     
          {response?.data?.length > 0 ? (
            
            response?.data?.map((game, index) => (
              <div
                key={game._id}
                onClick={() => handleSelectGame(game)}
              >
                <GameCard
                  key={index}
      
                  image={game.image}
                
                />
              </div>
            ))
          ) : (
            <>
              <div className="gamesearchSelection-container" id= "gameShort" onClick={()=> handleGameByTime(gameShort)}>Juegos cortos</div>
              <div className="gamesearchSelection-container" id= "gameLong" onClick={()=> handleGameByTime(gameLong)}>Juegos largos</div>
              <div className="gamesearchSelection-container" id="gameBest" onClick={()=>handleGameByRating(gameRating)}>Los mejores</div>
              <div className="gamesearchSelection-container" id="gameLikeCatan" onClick={()=> handleGameByType(gameLikeCatan)}>Juegos como Catán</div>
              <div className="gamesearchSelection-container" id= "gamesStarWars" onClick={()=>handleGameByType(gamesStarWars)}>Para fans de Star Wars</div>
              <div className="gamesearchSelection-container" id="gameOneplayer" onClick={()=>{handleGameByPlayers(onePlayer)}}>Para jugar solo</div>
              <div className="gamesearchSelection-container"  id="gameTwoplayer" onClick={()=>{handleGameByPlayers(twoPlayers)}}>Juegos para parejas</div>
              <div className="gamesearchSelection-container"  id="gameFourplayer" onClick={()=>{handleGameByPlayers(fourPlayers)}}>Para cuatro jugadores</div>
              </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameSearch;
