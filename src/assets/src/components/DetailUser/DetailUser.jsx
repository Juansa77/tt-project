import { useParams, Link, useNavigate } from "react-router-dom";
import "./DetailUser.css";
import { useContext, useState, useEffect} from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import {
  addFriendToUser,
  deleteFriendInUser,
  getFriendsInUser,
  getGamesInUser,
  getUserById,
} from "../../services/API_USER/user.service";
import MiniUserCard from "../MiniUserCard";
import MiniGameCard from "../MiniGameCard";
import { useGameContext } from "../../contexts/GameContext";


const DetailUser = () => {
  const navigate= useNavigate()
  //* Sacamos la ID del usuario con useParams
  const { _id } = useParams();
  const { selectedUser, setSelectedUser } = useUserContext();

  //* Nos traemos el user desde el contexto del usuario

  const { user, userLogin } = useAuth();

  const [response, setResponse] = useState([]);


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
  console.log(game)
  setSelectedGame(game);
  // Redirige a la página de detalles del juego seleccionado
  navigate(`/games/${game._id}`);

};


  //* FUNCIONALIDAD PARA AÑADIR Y QUITAR AMIGOS AL USUARIO

  const handleAddUser = async (friendID) => {
    console.log(userID);
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
      console.log("friend id", friendID);
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

  //* USEEFFECT  1 PARA CONTROLAR QUE SI EL USER DEL CONTEXTO ES NULL, HAGA UN FETCH

  useEffect(() => {
    console.log("hace el useEffect");
    console.log("selected user del useeefect", selectedUser);
    const fetchUserData = async () => {
      try {
        if (!selectedUser) {
          console.log("el user en contexto es null y entra en el useeeffect");
          // Realiza una llamada a la API para obtener los detalles del juego con el ID _id
          const response = await getUserById(_id);
          setSelectedUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [_id]);

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

  return (
    <div className="profile-main">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img
              className="profile-image"
              src={selectedUser?.file}
              alt="Profile"
            />
            <div>
            <h2 className="userNameText">{selectedUser?.name}</h2>
            <div className="msgContainer">
              <Link
                to={`/messages/${_id}`}
                className="anchorCustom-profileLink apple-tv-button"
              >
                ENVIAR MENSAJE
              </Link>
            </div>
            </div>
          </div>
<div className="btn-userDetailWrapper">
          <button  className=" btn-user" onClick={() => handleAddUser(selectedUser._id)}>
            Añadir amigo
          </button>
          <button className=" btn-user"  onClick={() => handleRemoveUser(selectedUser._id)}>
            Quitar amigo
          </button>
          </div>
          <div className="profile-content">
            <div className="profile-section">
            <div>
            <div className="friends-sectionName">
              <h3 className="section-title">Friends</h3></div>

              <ul className="friends-list">
                {friendsData?.response?.data == "Games not found" && (
                  <h1>No games in user</h1>
                )}
                {friendsData?.data?.length > 0 &&
                  friendsData?.data?.map((friend, index) => (
                    <div key={friend._id}
                    onClick={() => handleSelectFriend(friend)}>
                    <MiniUserCard
                      key={index}
                      title={friend.name}
                      image={friend.file}
                    />
                    </div>
                  ))}
              </ul>
              </div>
            </div>
            <div className="profile-section">
            <div className="friends-sectionName"> <h3 className="section-title">Games</h3></div>    
              <div className="games-list">
                {gamesData?.response?.data == "Games not found" && (
                  <h1>No games in user</h1>
                )}
                {gamesData?.data?.length > 0 &&
                  gamesData?.data?.map((game, index) => (
                    <div key={game._id}
                onClick={() => handleSelectGame(game)}>
                    <MiniGameCard
                      key={index}
                      title={game.title}
                      image={game.image}
                    />
                    </div>
                  ))}
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
            background: #363636;
            border-radius: 8px;
            padding: 20px;
     
            color: #ffffff;
          }

          .profile-header {
          
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
            background: #363636;
          }

          .section-title {
            font-size: 20px;
            margin-bottom: 10px;
          }

          .friends-list,
          .games-list {
            list-style: none;
            background: #363636;
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

export default DetailUser;
