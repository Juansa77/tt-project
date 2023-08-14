/* eslint-disable react/prop-types */
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./GameSelectionComponent.css";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useGameContext } from "../../contexts/GameContext";

const GameSelectionComponent = ({
  category,
  searchFunction,
  searchTerm,
  collectionSetter,
}) => {
  const [response, setResponse] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { setSelectedGame } = useGameContext();
  const navigate = useNavigate();
  const {
    selectedCollection,
    setSelectedCollection,
    selectedCollection1,
    setSelectedCollection1,
    selectedCollection2,
    setSelectedCollection2,
    selectedCollection3,
    setSelectedCollection3,
    selectedCollection4,
    setSelectedCollection4,
    selectedCollection5,
    setSelectedCollection5,
    selectedCollection6,
    setSelectedCollection6,
  } = useGameContext();

  //*-----LÓGICA PARA EL SCROLL HORIZONTAL-----
  const handleScroll = (direction) => {
    console.log("entra");
    const container = document.getElementById("gameSelectionContainer");
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

  const search = searchTerm;
  useEffect(() => {

    //* Break para setear en el contexto la llamada de cada componente 
    switch (collectionSetter) {
      case "collection0":
        if (selectedCollection == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection);
        }

        break;

      case "collection1":
        if (selectedCollection1 == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection1(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection1);
        }

        break;

      case "collection2":
        if (selectedCollection2 == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection2(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection2);
        }

        break;
      case "collection3":
        if (selectedCollection3 == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection3(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection3);
        }

        break;

      case "collection4":
        if (selectedCollection4 == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection4(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection4);
        }

        break;

      case "collection5":
        if (selectedCollection5 == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection5(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection5);
        }

        break;

      case "collection6":
        if (selectedCollection6 == null) {
          const fetchData = async () => {
            const data = await searchFunction(search);
            console.log("LLamada hecha");
            setResponse(data);
            setSelectedCollection6(data);
          };
          fetchData();
        } else {
          setResponse(selectedCollection6);
        }

        break;
    }
  }, [search, searchFunction]);



  //** -----LÓGICA PARA NAVIGATE Y LLEVAR A DETAIL

  const handleSelectGame = (game) => {
    console.log(game);
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);
  };

  return (
    <div className="GameSelectionWrapper">
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
        {response?.data?.map(
          (game, index) =>
            index <= 15 && (
              <div className="card-container-selection" key={index}>
                <div onClick={() => handleSelectGame(game)}>
                  <img
                    className="image-selection"
                    src={game.image}
                    alt={`${game.title} cover`}
                  />
                </div>
                <div className="title-container-selection">
                  <h2 className="title-selection">{game.title}</h2>
                </div>
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

export default GameSelectionComponent;
