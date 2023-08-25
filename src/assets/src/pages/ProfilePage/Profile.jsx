/* eslint-disable react/no-unknown-property */
import { useAuth } from "../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import {
  getFriendsInUser,
  getGamesInUser,
  getFriendRequests,

} from "../../services/API_USER/user.service";
import { useEffect, useState } from "react";
import MiniGameCard from "../../components/MiniGameCard";
import "./Profile.css";
import MiniUserCard from "../../components/MiniUserCard";
import { useUserContext } from "../../contexts/UserContext";
import { useGameContext } from "../../contexts/GameContext";
import { handleAddUser, handleRejectRequest } from "../../utils/userFunctions";
import { handleSelectGame } from "../../utils/gameFunctions";

const Profile = () => {
  const { user, userLogin } = useAuth();
  const userID = user.id;
  console.log("user en profile", user);

  const [gamesData, setGamesData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [friendRequests, setFriendRequests] = useState();
  const [addFriendResponse, setAddFriendResponse] = useState();
  const [rejectFriendResponse, setRejectFriendResponse] = useState();
  const [userCover, setUserCover] = useState(null)
  const navigate = useNavigate();
  const { setSelectedUser, totalRequests, setTotalRequests } = useUserContext();




  //* USEEFFECT PARA CARGAR LAS FRIENDS REQUESTS DEL USUARIO----
  useEffect(() => {
    // Llamada al servicio para obtener los request del usuario
    getFriendRequests(userID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setFriendRequests(data);
      })
      .catch((error) => {
        console.error("Error fetching friend requests:", error);
      });
  }, [userID, addFriendResponse]);

console.log("friendrequest en profile",friendRequests)
  //* USEEFFECT PARA CARGAR LAS FRIENDS REQUESTS DEL USUARIO----
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
    getFriendRequests(userID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setFriendRequests(data);
      })
      .catch((error) => {
        console.error("Error fetching friend requests:", error);
      });
  }, [rejectFriendResponse]);

  console.log(rejectFriendResponse);
  //* FUNCIÓN PARA ACCEDER A LA PÁGINA DE DETALLE DEL AMIGO

  const handleSelectFriend = (friend) => {
    console.log("amigo seleccionado>", friend);
    setSelectedUser(friend);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/users/${friend._id}`);
    window.scrollTo(0, 0);
  };




  //* FUNCIÓN PARA ALMACENAR LOS DATOS DEL JUEGO SELECCIONADO PARA USARLO EN DETAIL Y NO HACER UNA NUEVA LLAMADA

  //* SACAMOS DEL CONTEXTO DE GAME PARA ALMACENAR LOS DATOS DEL JUEGO
  const { setSelectedGame } = useGameContext();



  //* USEEFFECT PARA CONTROLAR EL SERVICIO DE LOS JUEGOS DEL USUARIO
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
    getGamesInUser(userID)
      .then((data) => {
        // Almacenar los datos en el estado local
        setGamesData(data);
        setUserCover(data.data[0].image)
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
  }, [addFriendResponse]);



  return (
    <div className="profile-main">
      <div className="profile-container">
        <div className="profile-card-user">
          <div className="profile-header">
     
            <img className="profile-image" src={user.image} alt="Profile" />
            <div className="profile-dataUserWrap">
              <h2 className="userNameText">{user.user}</h2>
              <div className="msgContainer">
                <Link
                  to={`/messages/${userID}`}
                  id="msg-buttom"
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
            <div className="games-list-user">
              {gamesData?.response?.data == "Games not found" && (
                <h1>No games in user</h1>
              )}
              {gamesData?.data?.length > 0 &&
                gamesData?.data?.map((game, index) => (
                  <div key={game._id} onClick={() => handleSelectGame(game, setSelectedGame, navigate)}>
                    <MiniGameCard
                      key={index}
                      title={game.title}
                      image={game.image}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="profile-section-friendRequest">
            <div className="friends-sectionName">
              <h3 className="section-title">Friend requests</h3>
            </div>
            <div className="request-list">
              {friendRequests?.response?.data == "No friend requests" && (
                <h1>No friend requests</h1>
              )}
              {friendRequests?.data?.length > 0 &&
                friendRequests?.data?.map(
                  (request) =>
                    request.isSender == false && (
                      <div className="requestWrap" key={request.id}>
                        <img className="requestPic" src={request.user.file} />{" "}
                        <div className="requestDataWrap">
                          <p>{request.user.name}</p>
                          <div className="requestBtnWrap">
                            <button
                              className="request-button-add"
                              onClick={() => handleAddUser(userID, request.user._id,user?.token, setAddFriendResponse, user, userLogin, setTotalRequests)}
                            >
                              Add
                            </button>
                            <button
                              className="request-button-reject"
                              onClick={() =>
                                handleRejectRequest(userID, request.user._id, user?.token, setRejectFriendResponse, user, userLogin, setTotalRequests)
                              }
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}
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
