/* eslint-disable react/no-unknown-property */
import { useAuth } from "../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import {
  getFriendsInUser,
  getGamesInUser,
} from "../../services/API_USER/user.service";
import { useEffect, useState } from "react";
import MiniGameCard from "../../components/MiniGameCard";
import "./Profile.css";
import MiniUserCard from "../../components/MiniUserCard";
import { useUserContext } from "../../contexts/UserContext";
import { useGameContext } from "../../contexts/GameContext";



const Profile = () => {
  const { user, setUser } = useAuth();
  const userID = user.id;
  console.log("user en profile", user);

  const [gamesData, setGamesData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const navigate = useNavigate();
  const { setSelectedUser } = useUserContext();






  //* FUNCIÓN PARA ACCEDER A LA PÁGINA DE DETALLE DEL AMIGO

  const handleSelectFriend = (friend) => {
    console.log("amigo seleccionado>", friend);
    setSelectedUser(friend);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/users/${friend._id}`);
  };

  //* FUNCIÓN PARA ALMACENAR LOS DATOS DEL JUEGO SELECCIONADO PARA USARLO EN DETAIL Y NO HACER UNA NUEVA LLAMADA

  //* SACAMOS DEL CONTEXTO DE GAME PARA ALMACENAR LOS DATOS DEL JUEGO
  const { setSelectedGame } = useGameContext();

  //* Instancia de la historia del enrutador para redirigir a la página de detail

  const handleSelectGame = (game) => {
    console.log(game);
    setSelectedGame(game);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/games/${game._id}`);
  };

  //* USEEFFECT PARA CONTROLAR EL SERVICIO DE LOS JUEGOS DEL USUARIO
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
    getGamesInUser(userID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setGamesData(data);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, [userID]);

  //* USEEFFECT PARA CONTROLAR EL SERVICIO DE LOS AMIGOS DEL USUARIO
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
    getFriendsInUser(userID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setFriendsData(data);
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
      });
  }, [userID]);

  return (
    <div className="profile-main">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img className="profile-image" src={user.image} alt="Profile" />
            <div className="profile-dataUserWrap">
              <h2 className="userNameText">{user.user}</h2>
              <div className="msgContainer">
                <Link
                  to={`/messages/${userID}`}
                  className="anchorCustom-profileLink apple-tv-button"
                >
                  VER MENSAJES
                </Link>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="friends-sectionName">
              <h3 className="section-title">Friends</h3>
            </div>

            <ul className="friends-list">
              {friendsData?.response?.data == "Games not found" && (
                <h1>No games in user</h1>
              )}
              {friendsData?.data?.length > 0 &&
                friendsData?.data?.map((friend, index) => (
                  <div
                    key={friend._id}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <MiniUserCard
                      key={index}
                      title={friend.name}
                      image={friend.file}
                    />
                  </div>
                ))}
            </ul>
            </div>
            <div className="profile-section">
              <div className="friends-sectionName">
                {" "}
                <h3 className="section-title">Games</h3>
              </div>
              <div className="games-list">
                {gamesData?.response?.data == "Games not found" && (
                  <h1>No games in user</h1>
                )}
                {gamesData?.data?.length > 0 &&
                  gamesData?.data?.map((game, index) => (
                    <div key={game._id} onClick={() => handleSelectGame(game)}>
                      <MiniGameCard
                        key={index}
                        title={game.title}
                        image={game.image}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="userSettings-text">
              <Link className="linkText" to="/passwordchange">
                Manage your account
              </Link>
            </div>
    
        
        </div>

      </div>
    </div>
  );
};

export default Profile;
