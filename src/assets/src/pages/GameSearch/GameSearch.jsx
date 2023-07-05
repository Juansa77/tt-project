import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import "./GameSearch.css";
import { gameByName } from "../../services/API_USER/game.service";
import GameCard from "../../components/GameCard";

const GameSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      console.log(searchTerm);
      const title = searchTerm;
      const responseData = await gameByName(title);
      setResponse(responseData);
      console.log(response);
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
      {response?.response?.data == "Game not found"&& (<h1>Game not found</h1>)}
      {response?.data?.length > 0 && (
        <GameCard
          title={response.data[0].title}
          image={response.data[0].image}
        />
      )}
    </>
  );
};

export default GameSearch;
