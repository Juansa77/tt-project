/* eslint-disable react/prop-types */
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./GameRecomendationComponent.css";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";
import { gameByMultiQuery } from "../../services/API_USER/game.service";
import { useAuth } from "../../contexts/authContext";
import { handleSelectGame } from "../../utils/gameFunctions";


const GameRecomendationComponent = () => {
  const [response, setResponse] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { setSelectedGame } = useGameContext();
  const navigate = useNavigate();
  const { user } = useAuth();

  //*-------------LÓGICA PARA RECOMENDADOR DE JUEGOS
  const userGamesData = [];
  user?.games?.map((game, index) =>
    userGamesData.push({
      title: game?.title,
      types: game?.typesList?.slice(0, 2),
      players: game?.players,
      rating: game?.rating,
      playTime: game?.playTime,
    })
  );


  //*-----LÓGICA PARA EL SCROLL HORIZONTAL-----
  const handleScroll = (direction) => {
    console.log("entra");
    const container = document.getElementById("gameRecomendationContainer");
    const containerWidth = container.offsetWidth / 3;
    //*Aumenta el divisor para aumentar el tamaño del div de scroll con los botones
    const containerScrollWidth = container.scrollWidth / 2.4;
    console.log(containerWidth);
    console.log(containerScrollWidth);

    if (direction === "left") {
      setScrollPosition(Math.max(0, scrollPosition - 600));
    } else if (direction === "right") {
      console.log(scrollPosition);
      const maxScrollRight = containerScrollWidth - containerWidth;
      const newScrollPosition = Math.min(maxScrollRight, scrollPosition + 600);
      if (newScrollPosition !== scrollPosition) {
        setScrollPosition(newScrollPosition);
      }
    }
  };

  //* ---LÓGICA PARA EL FETCH Y ALMACENAMIENTO EN GAMECONTEXT DE LA LLAMADA

  useEffect(() => {
    const fetchData = async () => {
      const promises = userGamesData?.map(async (game) => {
        const data = await gameByMultiQuery(
          game.types,
          game.rating,
          game.players,
          game.playTime
        );
        return data;
      });

      const responseData = await Promise.all(promises);
      console.log("LLamada hecha");
      setResponse(responseData);
    };
    fetchData();
  }, []);




  return (
    <div className="GameRecomendationWrapper">
      <div
        id="gameRecomendationContainer"
        className="game-recomendation-container"
        style={{
          overflowX: "hidden",
          transition: "transform 0.3s ease", // Agrega la transición para el desplazamiento suave
          transform: `translateX(-${scrollPosition}px)`,
        }}
      >
      
        {response.map(
          (res, resIndex) =>
            res.data && (
              <div  className="recomendationWrapper" key={resIndex}>
                {res.data.map((game, gameIndex) => (
                  <div className="card-container-recomendation" key={gameIndex}>
                    <>
                      <div onClick={() => handleSelectGame(game, setSelectedGame, navigate)}>
                        <img
                          className="image-recomendation"
                          src={game.image}
                          alt={`${game.title} cover`}
                        />
                      </div>
                      <div className="title-container-recomendation">
                        <h2 className="title-recomendation">{game.title}</h2>
                      </div>
                    </>
                  </div>
                ))}
              </div>
            )
        )}

        
      </div>

      <div
        className="scroll-buttons-container"
        style={{
          maxWidth: `100vw`,
        }}
      >
        <button className="arrow-btn" onClick={() => handleScroll("left")}>
          <FaChevronLeft
            style={scrollPosition == 0 ? { fill: "transparent" } : {}}
          />
        </button>
        <button className="arrow-btn" onClick={() => handleScroll("right")}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GameRecomendationComponent;
