import "./Home.css";
import { SliderData } from "../../components/SliderGallery/SliderData"
import SliderGallery from "../../components/SliderGallery/SliderGallery"
GameSelectionComponent;
import { useEffect, useState } from "react";
import { gameByPlayingTime } from "../../services/API_USER/game.service";
import GameSelectionComponent from "../../components/GameSelectionComponent/GameSelectionComponent";
import CategorySplitter from "../../components/CategorySplitter";




const Home = () => {
  const [verticalScrollPosition, setVerticalScrollPosition] = useState(0);
  const [scrollTotal, setScrollTotal] = useState(0)

  //* ---LÓGICA PARA CALCULAR EL DESPLAZAMIENTO HORIZONTAL----
  useEffect(() => {
    const handleScroll = () => {
      const currentVerticalScroll = window.scrollY;
      setVerticalScrollPosition(currentVerticalScroll);
      setScrollTotal((prevScrollTotal) => prevScrollTotal + currentVerticalScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div id="homeDiv" className="home">
      <div className="hero">
      <SliderGallery slides={SliderData}/>
       
      </div>
      <CategorySplitter title= {"Para partidas rápidas..."}/>
      {verticalScrollPosition >= 0 && (
        <div className={`gameContainer ${verticalScrollPosition >= 0 ? "visible" : ""}`}>
          <GameSelectionComponent
            searchFunction={gameByPlayingTime}
            searchTerm={"20 Min"}
          />
        </div>
      )}
      <CategorySplitter title="Si tienes una horilla" />
      {verticalScrollPosition >= 0 && (
        <div className={`gameContainer ${verticalScrollPosition >= 0 ? "visible" : ""}`}>
          <GameSelectionComponent
            searchFunction={gameByPlayingTime}
            searchTerm={"60 Min"}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
