/* eslint-disable react-hooks/exhaustive-deps */
import "./Home.css";
import { SliderData } from "../../components/SliderGallery/SliderData";
import SliderGallery from "../../components/SliderGallery/SliderGallery";
GameSelectionComponent;
import { useEffect, useState } from "react";
import { gameByPlayingTime } from "../../services/API_USER/game.service";
import GameSelectionComponent from "../../components/GameSelectionComponent/GameSelectionComponent";
import CategorySplitter from "../../components/CategorySplitter";
import Footer from "../../components/Footer/Footer";
import { useUserContext } from "../../contexts/UserContext";
import { getAllChats } from "../../services/API_USER/message.service";
import { useAuth } from "../../contexts/authContext";

const Home = () => {
  const [verticalScrollPosition, setVerticalScrollPosition] = useState(0);
  const [scrollTotal, setScrollTotal] = useState(0);

  const { user, userLogin } = useAuth();
  const { totalMessages, setTotalMessages } = useUserContext();
  const {totalRequests, setTotalRequests} = useUserContext();
  const [responseChats, setResponseChats] = useState();
  const id = user?.id;

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

const friendRequestsCount= user?.friendRequests.reduce((count, request) => {
  if (request?.isSender == false) {
    return count + 1;
  }
  return count;
}, 0);

    setTotalMessages(countUnreadMessages);
    setTotalRequests(friendRequestsCount)

  }

  console.log(user.friendRequests.length)
  console.log(totalRequests)
console.log("user en home", user)

  return (
    <div id="homeDiv" className="home">
      <div className="hero">
        <SliderGallery slides={SliderData} />
      </div>
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
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
