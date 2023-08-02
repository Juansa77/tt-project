import "./Home.css";
import HeroCard from "../../components/HeroCard";
GameSelectionComponent;
import { useEffect, useState } from "react";
import { gameByPlayingTime } from "../../services/API_USER/game.service";
import GameSelectionComponent from "../../components/GameSelectionComponent/GameSelectionComponent";

const Home = () => {
  const [verticalScrollPosition, setVerticalScrollPosition] = useState(0);

  //* ---LÓGICA PARA CALCULAR EL DESPLAZAMIENTO HORIZONTAL----
  useEffect(() => {
    const handleScroll = () => {
      setVerticalScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log(verticalScrollPosition);

  return (
    <div id="homeDiv" className="home">
      <div className="hero">
        <HeroCard
          image="ceramic1.jpg"
          title="Busca gente para jugar en tu ciudad"
          description="Descripción del juego"
        />
      </div>
      {verticalScrollPosition >= 0 && (
        <div className={`gameContainer ${verticalScrollPosition >= 0 ? "visible" : ""}`}>
          <GameSelectionComponent
            category={"Para partidas rápidas"}
            searchFunction={gameByPlayingTime}
            searchTerm={"20 Min"}
          />
        </div>
      )}
      {verticalScrollPosition >= 10 && (
        <div className={`gameContainer ${verticalScrollPosition >= 30 ? "visible" : ""}`}>
          <GameSelectionComponent
            category={"Si tienes una horilla..."}
            searchFunction={gameByPlayingTime}
            searchTerm={"60 Min"}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
