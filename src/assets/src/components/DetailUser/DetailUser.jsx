import { useParams, Link } from "react-router-dom";
import "./DetailUser.css";
import { useContext, useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import {
  addFriendToUser,
  deleteFriendInUser,
  getFriendsInUser,
  getGamesInUser,
} from "../../services/API_USER/user.service";
import MiniUserCard from "../MiniUserCard";
import MiniGameCard from "../MiniGameCard";





const DetailUser = () => {
  //* Sacamos la ID del usuario con useParams
  const { _id } = useParams();
  const { selectedUser} = useUserContext()
  console.log("selecteduser en detail user", selectedUser)

  console.log("id que entra por params en detail", _id)
  //* Nos traemos el user desde el contexto del usuario

  const { user, userLogin } = useAuth();

  const [response, setResponse] = useState([]);

  //* FUNCIONALIDAD PARA AÑADIR Y QUITAR AMIGOS AL USUARIO

  const handleAddUser = async (friendID) => {
    console.log(userID)
    try {
   

      const token = user?.token;
      const responseData = await addFriendToUser(userID, friendID, token);
      setResponse(responseData);
    
  //* Objeto custom para añadir la id del amigo y almacenar el usuario actualizado en el local
      const updatedUser = {
        ...user,
        friends: [...user.friends, friendID], // Agrega el nuevo juego al array de juegos
      };
      const dataString = JSON.stringify(updatedUser);
      // Actualiza la variable userLogin en el contexto
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveUser = async (friendID) => {
    try {
        console.log("user del usuario logeado", user);
        console.log("friend id", friendID)
      const token = user?.token;
      const responseData = await deleteFriendInUser(userID, friendID, token);
      setResponse(responseData);

      //* Objeto custom para extraer la id del amigo  y almacenar el usuario actualizado en el local
      const updatedUser = {
        ...user,
        friends: user.friends.filter((friend) => friend !== friendID), // Elimina la ID del amigo del array de amigos
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  //* FUNCIONALIDAD PARA OBTENER LOS JUEGOS Y AMIGOS DEL USUARIO

  const userID = user.id;

  const [gamesData, setGamesData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);

  //* USEEFFECT PARA CONTROLAR EL SERVICIO DE LOS JUEGOS DEL USUARIO
  useEffect(() => {
    // Llamada al servicio para obtener los juegos del usuario
    getGamesInUser(_id)
      .then((data) => {
        // Almacenar los datos en el estado local
        setGamesData(data);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      });
  }, [_id]);


    //* USEEFFECT PARA CONTROLAR EL SERVICIO DE LOS AMIGOS DEL USUARIO
    useEffect(() => {
      // Llamada al servicio para obtener los juegos del usuario
      getFriendsInUser(_id)
        .then((data) => {
          // Almacenar los datos en el estado local
          setFriendsData(data);
        })
        .catch((error) => {
          console.error("Error fetching friends:", error);
        });
    }, [_id]);
  



  return  (   <div className="profile-main">
  <div className="profile-container">
    <div className="profile-card">
      <div className="profile-header">
      <img className="profile-image" src={selectedUser.file} alt="Profile" />
        <h2 className="username">{selectedUser?.name}</h2>
       
      </div>
    
<button onClick={()=> handleAddUser(selectedUser._id)}>Añadir amigo</button>
<button onClick={()=>handleRemoveUser(selectedUser._id)}>Quitar amigo</button>
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
          <h3 className="section-title">Games</h3>
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
          <p className="bottom-text">
            <small>
              <Link
                to="/passwordchange"
                className="anchorCustom-profileLink"
              >
                Manage your account
              </Link>
            </small>
          </p>
        </div>
      </div>
      <div className="fluidContainerProfile"></div>
    </div>

    <style jsx>{`
      .profile-main {
        display: flex;
        width: 100vw;
        justify-content: center;
        background-color: #363636;
      }

      .profile-container {
        background: #363636;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
        width: 70vw;

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
        flex-direction: column;
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
        padding: 0;
        margin: 0;
      }

      .friends-list li,
      .games-list li {
        margin-bottom: 6px;
      }
    `}</style>
  </div>
</div>)
};

export default DetailUser;
