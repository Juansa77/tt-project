import "./Home.css";
import HeroCard from "../../components/HeroCard";
import CategorySplitter from "../../components/CategorySplitter";
import GameCard from "../../components/GameCard";
import GameSelection from "../../components/GameSelection";
GameSelectionComponent
import { useEffect, useState } from "react";
import { gameByPlayingTime } from "../../services/API_USER/game.service";
import GameSelectionComponent from "../../components/GameSelectionComponent/GameSelectionComponent";




const Home = () => {

  const [response, setResponse] = useState()

  useEffect(()=>{
    const playingTime = "20%20Min"
    const fetchData = async()=>{
    const data =  await gameByPlayingTime(playingTime)
    setResponse(data)}
    fetchData()
  },[])

  const gamebyTime = gameByPlayingTime
  const searchTerm = "20%20Min"

  console.log(response)
  return (
    <div className="home">
    <div className="hero">
      <HeroCard
        image="ceramic1.jpg"
        title="Busca gente para jugar en tu ciudad"
        description="Descripción del juego"
      />
       <CategorySplitter title="Categoría" />
      </div>
     
<div className="gameContainer">


<GameSelectionComponent
        searchFunction={gameByPlayingTime}
        searchTerm={searchTerm}
      />
</div>

    </div>
  );
};

export default Home;
