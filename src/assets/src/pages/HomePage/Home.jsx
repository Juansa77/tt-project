import "./Home.css";
import HeroCard from "../../components/HeroCard";
import CategorySplitter from "../../components/CategorySplitter";
import GameCard from "../../components/GameCard";

const Home = () => {
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
<GameCard
        image="popheart1.jpg"
        title="Nombre del juego"
        description="Descripción del juego"
      />
       <GameCard
        image="news1.jpg"
        title="Nombre del juego"
        description="Descripción del juego"
      />

<GameCard
        image="sara1.jpg"
        title="Nombre del juego"
        description="Descripción del juego"
      />
      <GameCard
        image="mural1.jpg"
        title="Nombre del juego"
        description="Descripción del juego"
      />

<GameCard
        image="cristian1.jpg"
        title="Nombre del juego"
        description="Descripción del juego"
      />

</div>

    </div>
  );
};

export default Home;
