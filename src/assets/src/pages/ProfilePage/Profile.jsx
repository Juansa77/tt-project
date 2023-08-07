import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import {
  getFriendsInUser,
  getGamesInUser,
} from "../../services/API_USER/user.service";
import { useEffect, useState } from "react";
import MiniGameCard from "../../components/MiniGameCard";
import "./Profile.css";
import MiniUserCard from "../../components/MiniUserCard";

const Profile = () => {
  const { user, setUser } = useAuth();
  const userID = user.id;
  console.log("user en profile", user);

  const [gamesData, setGamesData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

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

  console.log(gamesData);
  console.log(friendsData);

  return (
    <div className="profile-main">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img className="profile-image" src={user.image} alt="Profile" />
            <div>
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

          <div className="profile-content">
            
            <div className="profile-section">
              <h3 className="section-title">Friends</h3>

              <ul className="friends-list">
                {friendsData?.response?.data == "Games not found" && (
                  <h1>No games in user</h1>
                )}
                {friendsData?.data?.length > 0 &&
                  friendsData?.data?.map((friend, index) => (
                    <MiniUserCard
                      key={index}
                      title={friend.name}
                      image={friend.file}
                    />
                  ))}
              </ul>
            </div>
            <div className="profile-section">
              <div className="skewed"></div>
              <h3 className="section-title">Games</h3>
              <section></section>
              <div className="games-list">
                {gamesData?.response?.data == "Games not found" && (
                  <h1>No games in user</h1>
                )}
                {gamesData?.data?.length > 0 &&
                  gamesData?.data?.map((game, index) => (
                    <MiniGameCard
                      key={index}
                      title={game.title}
                      image={game.image}
                    />
                  ))}
              </div>
              <div className="bottom-text">
                <Link to="/passwordchange" >
                  Manage your account
                </Link>
              </div>
            </div>
          </div>
          <div className="fluidContainerProfile"></div>
        </div>

        <style jsx>{`
          .profile-main {
            display: flex;
            width: 100vw;
            justify-content: center;

            justify-content: center;
            justify-items: center;
          
          }

          .profile-container {

            display: flex;

            justify-content: center;
            justify-items: center;
            align-items: center;
            min-height: 70vh;


            font-family: Arial, sans-serif;
          }

          .profile-card {
            min-height: 50vh;
            width: 70vw;
            background-color: #121b27;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            color: #ffffff;
          }

          .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }

          .username {
            font-size: 24px;
            margin-bottom: 8px;
          }

          .city {
            font-size: 14px;
          }

          .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 20px;
          }

          .profile-section {
            margin-bottom: 20px;
          }

          .section-title {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .friends-list,
          .games-list {
            list-style: none;
          }

          .friends-list li,
          .games-list li {
            margin-bottom: 6px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;
