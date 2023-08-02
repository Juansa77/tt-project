import { FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./GameSelectionComponent.css";

const GameSelectionComponent = ({
  searchFunction,
  searchTerm,
}) => {
  const [response, setResponse] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const[containerWidth, setContainerWidth] = useState(0)

  const handleScroll = (direction) => {
    console.log("entra");
    const container = document.getElementById("gameSelectionContainer");
    const containerWidth = (container.offsetWidth/1.8)
    const containerScrollWidth = (container.scrollWidth/1.8);
    console.log(containerWidth);
    console.log(containerScrollWidth)
  
    if (direction === "left") {
      setScrollPosition(Math.max(0, scrollPosition - 600));
     
    } else if (direction === "right") {
        console.log(scrollPosition)
      const maxScrollRight = containerScrollWidth - containerWidth;
      const newScrollPosition = Math.min(maxScrollRight, scrollPosition + 600);
      if (newScrollPosition !== scrollPosition) {
        setScrollPosition(newScrollPosition);
      }
    }
  };

  const search = searchTerm;
  useEffect(() => {
    const fetchData = async () => {
      const data = await searchFunction(search);
      setResponse(data);
    };
    fetchData();
    
  }, [search, searchFunction]);


  useEffect(() => {
    // Recalculate the container width when response changes
    const updateContainerWidth = () => {
      const responseLength = response?.data?.length || 0;
      setContainerWidth(20 * responseLength);
    };
    updateContainerWidth();
  }, [response]);

  console.log(containerWidth)
  return (
    <div>
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
          <div
            className="card-container-selection"
            key={index}
          >
          
            <img
              className="image-selection"
              src={game.image}
              alt={`${game.title} cover`}
            />
            <div className="title-container-selection">
              <h2 className="title-selection">{game.title}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="scroll-buttons-container" style={{
         maxWidth: `100vw`
        }}>
        <button onClick={() => handleScroll("left")}><FaChevronLeft/></button>
        <button onClick={() => handleScroll("right")}><FaChevronRight/></button>
      </div>
    </div>
  );
};

export default GameSelectionComponent;