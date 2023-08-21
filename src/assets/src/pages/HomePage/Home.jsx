/* eslint-disable react-hooks/exhaustive-deps */
import "./Home.css";
import { SliderData } from "../../components/SliderGallery/SliderData";
import SliderGallery from "../../components/SliderGallery/SliderGallery";
GameSelectionComponent;
import { useEffect, useState } from "react";
import {
  gameByPlayingTime,
  gameByRating,
  gameByType,
  gameByPlayers,
} from "../../services/API_USER/game.service";
import GameSelectionComponent from "../../components/GameSelectionComponent/GameSelectionComponent";
import CategorySplitter from "../../components/CategorySplitter";
import Footer from "../../components/Footer/Footer";
import { useUserContext } from "../../contexts/UserContext";
import { getAllChats } from "../../services/API_USER/message.service";
import { useAuth } from "../../contexts/authContext";
import GameRecomendationComponent from "../../components/GameRecomendationComponent/GameRecomendationComponent";

const Home = () => {
  const [verticalScrollPosition, setVerticalScrollPosition] = useState(0);
  const [scrollTotal, setScrollTotal] = useState(0);

  const { user, userLogin } = useAuth();
  const { totalMessages, setTotalMessages } = useUserContext();
  const { totalRequests, setTotalRequests } = useUserContext();
  const [responseChats, setResponseChats] = useState();
  const id = user?.id;

  console.log("user en home", user);

  //* ---LÓGICA PARA CALCULAR EL DESPLAZAMIENTO VERTICAL----
  useEffect(() => {
    const handleScroll = () => {
      const currentVerticalScroll = window.scrollY;
      setVerticalScrollPosition(currentVerticalScroll);
      setScrollTotal(
        (prevScrollTotal) => prevScrollTotal + currentVerticalScroll
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //* ---LÓGICA PARA CONTAR EL NÚMERO DE MENSAJES SIN LEER--------

  useEffect(() => {
    if (user) {
      const fetchChats = async (user) => {
        const responseChats2 = await getAllChats(user);
        setResponseChats(responseChats2);
      };

      fetchChats(user?.id);
    }
  }, []);

  if (user) {
    const countUnreadMessages = responseChats?.reduce((count, mensaje) => {
      if (mensaje?.receiver === id && mensaje?.isRead === false) {
        return count + 1;
      }
      return count;
    }, 0);

    const friendRequestsCount = user?.friendRequests.reduce(
      (count, request) => {
        if (request?.isSender == false) {
          return count + 1;
        }
        return count;
      },
      0
    );

    setTotalMessages(countUnreadMessages);
    setTotalRequests(friendRequestsCount);
  }
  console.log(verticalScrollPosition);

  return (
    <div id="homeDiv" className="home">
      <div className="hero">
        <SliderGallery slides={SliderData} />
      </div>

      {user && user?.games?.length > 0 && (
          <div className="RecomendationsContainer">
          <div className="recomendationTextWrapper">
          <h2 className="recomendationsHeaderText">Recomendaciones personalizadas</h2>
          <h4 className="recomendationsSubtext">Basado en tus juegos preferidos</h4></div>
          <div
            className={`gameContainerRecomendation ${
              verticalScrollPosition >= 0 ? "visible" : ""
            }`}
          >
            <GameRecomendationComponent />
          </div>
          </div>
        )}

      <CategorySplitter
        title={"Para partidas rápidas..."}
        text={"Si te apetecen juegos de 20 minutos"}
      />
      {verticalScrollPosition >= 0 && (
        <div
          className={`gameContainer ${
            verticalScrollPosition >= 0 ? "visible" : ""
          }`}
        >
          <GameSelectionComponent
            searchFunction={gameByPlayingTime}
            searchTerm={"20 Min"}
            collectionSetter={"collection0"}
          />
        </div>
      )}
      <CategorySplitter
        title="Si tienes una horilla"
        text={"Una selección de juegos de una hora"}
      />
      {verticalScrollPosition >= 0 && (
        <div
          className={`gameContainer ${
            verticalScrollPosition >= 0 ? "visible" : ""
          }`}
        >
          <GameSelectionComponent
            searchFunction={gameByPlayingTime}
            searchTerm={"60 Min"}
            collectionSetter={"collection1"}
          />
        </div>
      )}

      <CategorySplitter
        title={"Los más valorados"}
        text={"Una selección de los juegos preferidos"}
      />
      <div
        className={`gameContainer ${
          verticalScrollPosition >= 300 ? "visible" : ""
        }`}
      >
        <GameSelectionComponent
          searchFunction={gameByRating}
          searchTerm={"8.5"}
          collectionSetter={"collection2"}
        />
      </div>

      <CategorySplitter
        title={"En una galaxia muy lejana..."}
        text={"¿Tienes ganas de Star Wars?"}
      />
      <div
        className={`gameContainer ${
          verticalScrollPosition >= 500 ? "visible" : ""
        }`}
      >
        <GameSelectionComponent
          searchFunction={gameByType}
          searchTerm={"Movies: Star Wars"}
          collectionSetter={"collection3"}
        />
      </div>

      <CategorySplitter
        title={"Juegos para parejas"}
        text={"¿Tus amig@s no pueden quedar? No hay problema "}
      />
      <div
        className={`gameContainer ${
          verticalScrollPosition >= 900 ? "visible" : ""
        }`}
      >
        <GameSelectionComponent
          searchFunction={gameByPlayers}
          searchTerm={"2 Players"}
          collectionSetter={"collection4"}
        />
      </div>

      <CategorySplitter
        title={"Juegos como Catan"}
        text={"Si te gusta Catan, prueba estos juegos"}
      />
      <div
        className={`gameContainer ${
          verticalScrollPosition >= 900 ? "visible" : ""
        }`}
      >
        <GameSelectionComponent
          searchFunction={gameByType}
          searchTerm={"Strategy,Negotiation,Economic,Family"}
          collectionSetter={"collection5"}
        />
      </div>

      <CategorySplitter
        title={"Juegos para cuatro jugadores"}
        text={"Para jugar en grupo"}
      />
      <div
        className={`gameContainer ${
          verticalScrollPosition >= 1300 ? "visible" : ""
        }`}
      >
        <GameSelectionComponent
          searchFunction={gameByPlayers}
          searchTerm={"2–4 Players"}
          collectionSetter={"collection6"}
        />
      </div>

      
      

     
      

      <Footer />
    </div>
  );
};

export default Home;
