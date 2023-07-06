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


const GameSearch = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState([]);

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
      const userID = user?._id;
      const token = user?.token;
      const responseData = await addGameToUser(userID, gameId, token);
      setResponse(responseData);
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
            <GameCard
              key={index}
              title={game.title}
              image={game.image}
              onClickAdd={() => handleAddGame(game._id)}
              onClickRemove={() => handleRemoveGame(game._id)}
            />
          ))}
      </div>
    </>
  );
};

export default GameSearch;
