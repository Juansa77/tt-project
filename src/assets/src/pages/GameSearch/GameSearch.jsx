import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import "./GameSearch.css";
import {
  addGameToUser,
  gameByName,
  removeGameInUser,
} from "../../services/API_USER/game.service";
import GameCard from "../../components/GameCard";
import { useAuth } from "../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";


const GameSearch = () => {
  const { user, userLogin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState([]);
  const userID = user?.id;



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


  // Instancia de la historia del enrutador para redirigir a la página de detalles
  const navigate = useNavigate();

  const handleSelectGame = (game) => {
    console.log(game)
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);

  };

  return (
    <>
      <div className="gameSearch">
        <SearchBar
          placeholder="Type a name..."
          searchTerm={searchTerm}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />
      </div>
      <div className="gameSearch-container">
        {response?.response?.data == "Game not found" && (
          <h1>Game not found</h1>
        )}
        {response?.data?.length > 0 &&
          response?.data?.map((game, index) => (
            <div
              key={game._id}
              onClick={() => handleSelectGame(game)} // Llama a la función al hacer clic en el juego
            >
              <GameCard
                key={index}
                title={game.title}
                image={game.image}
                onClickAdd={() => handleAddGame(game._id)}
                onClickRemove={() => handleRemoveGame(game._id)}
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default GameSearch;
