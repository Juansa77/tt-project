import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./GameSelectionComponent.css";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";


const GameSelectionComponent = ({ category, searchFunction, searchTerm }) => {
  const [response, setResponse] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { setSelectedGame } = useGameContext();
  const navigate = useNavigate();


  //*-----LÓGICA PARA EL SCROLL HORIZONTAL-----
  const handleScroll = (direction) => {
    console.log("entra");
    const container = document.getElementById("gameSelectionContainer");
    const containerWidth = container.offsetWidth / 1.2;
    const containerScrollWidth = container.scrollWidth / 1.2;
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

  //* ---LÓGICA PARA EL FETCH----
  const search = searchTerm;
  useEffect(() => {
    const fetchData = async () => {
      const data = await searchFunction(search);
      setResponse(data);
    };
    fetchData();
  }, [search, searchFunction]);



  console.log(scrollPosition);

//** -----LÓGICA PARA NAVIGATE Y LLEVAR A DETAIL

  const handleSelectGame = (game) => {
    console.log(game)
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);

  };


  return (
    <div>
    <div className="CategoryTextContainer">
      <h2 className="CategoryText ">{category}</h2>
    </div>
      <div
        id="gameSelectionContainer"
        className="game-selection-container"
        style={{
          overflowX: "hidden",
          transition: "transform 0.3s ease", // Agrega la transición para el desplazamiento suave
          transform: `translateX(-${scrollPosition}px)`,
        }}
      >
        {response?.data?.map((game, index) => (
          <div className="card-container-selection" key={index}>
          <div onClick={() => handleSelectGame(game)}>
            <img
              className="image-selection"
              src={game.image}
              alt={`${game.title} cover`}
            />
            <div className="title-container-selection">
              <h2 className="title-selection">{game.title}</h2>
            </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="scroll-buttons-container"
        style={{
          maxWidth: `100vw`,
        }}
      >
        <button
          className="arrow-btn"
          onClick={() => handleScroll("left")}
        >
          <FaChevronLeft   style={scrollPosition == 0 ? { fill: 'transparent' } : {}} />
        </button>
        <button className="arrow-btn" onClick={() => handleScroll("right")}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GameSelectionComponent;
