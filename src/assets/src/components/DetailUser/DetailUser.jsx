import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./DetailUser.css";
import { useContext, useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/authContext";
import {
  deleteFriendInUser,
  getFriendsInUser,
  getGamesInUser,
  getUserById,
  sendFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  addFriendToUser, rejectFriendRequest
} from "../../services/API_USER/user.service";
import MiniUserCard from "../MiniUserCard";
import MiniGameCard from "../MiniGameCard";
import { useGameContext } from "../../contexts/GameContext";

const DetailUser = () => {
  const navigate = useNavigate();
  //* Sacamos la ID del usuario con useParams
  const { _id } = useParams();
  const { selectedUser, setSelectedUser, totalRequests, setTotalRequests } =
    useUserContext();
  const { user, userLogin } = useAuth();
  const userID = user?.id;
  const [friendRequests, setFriendRequests] = useState();
  const [addFriendResponse, setAddFriendResponse] = useState();
  const [friendSendRequest, setFriendSendRequest] = useState(false);
  const [rejectFriendResponse, setRejectFriendResponse] = useState();

  //* Nos traemos el user desde el contexto del usuario

  const [response, setResponse] = useState([]);

  //* USEEFFECT PARA CARGAR LAS FRIENDS REQUESTS DEL USUARIO----
  useEffect(() => {
    // Llamada al servicio para obtener los request del usuario
    getFriendRequests(userID)
      .then((data) => {
        setFriendRequests(data);
        setFriendSendRequest(
          friendRequests?.data?.some((item) => item.user._id == _id)
        );
      })
      .catch((error) => {
        console.error("Error fetching friend requests:", error);
      });
  }, [_id]);
  console.log(friendSendRequest);
  console.log("friendrequest en detail", friendRequests);

  const friendSendARequest = friendRequests?.data?.some(
    (item) => item.user._id == _id
  );

  //* FUNCIÓN PARA ACEPTAR REQUEST FRIEND Y AÑADIR AMIGO-----
  const handleAddUser = async (friendID) => {
    console.log(userID);
    try {
      const token = user?.token;
      const responseData = await addFriendToUser(userID, friendID, token);
      setAddFriendResponse(responseData);
      console.log("responseData de add friend", responseData);
      const updatedFriendRequests = user.friendRequests.filter(
        (friendRequest) => {
          return friendRequest.isSender && friendRequest.user === friendID;
        }
      );

      //* Objeto custom para añadir la id del amigo y almacenar el usuario actualizado en el local
      const updatedUser = {
        ...user,
        friends: [...user.friends, friendID],
        friendRequests: updatedFriendRequests,
        // Agrega el nuevo juego al array de juegos
      };
      const dataString = JSON.stringify(updatedUser);
      // Actualiza la variable userLogin en el contexto
      userLogin(dataString);
      setTotalRequests(user?.friendRequests?.length);
    } catch (error) {
      console.log(error);
    }
  };

  //* FUNCIÓN PARA ACCEDER A LA PÁGINA DE DETALLE DEL AMIGO-------------

  const handleSelectFriend = (friend) => {
    console.log("amigo seleccionado>", friend);
    setSelectedUser(friend);
    // Redirige a la página de detalles del juego seleccionado
    if (friend._id == user.id) {
      navigate(`/profile`);
    } else {
      navigate(`/users/${friend._id}`);
    }
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

  console.log("userlogin en detailuser", user);

  //* -----FUNCIONALIDAD PARA ENVIAR SOLICITUD DE AMISTAD------
  const handleFriendRequest = async (friendID) => {
    try {
      const token = user?.token;
      const responseData = await sendFriendRequest(userID, friendID, token);
      setResponse(responseData);
      console.log("respondata de request friend", responseData);
      if (responseData?.status == 200) {
        Swal.fire("Friend request sended!");
      }
      //* Objeto custom para añadir la id de la solicitud y almacenar el usuario actualizado en el local
      const updatedUser = {
        ...user,
        friendRequests: [
          ...user.friendRequests,
          { user: friendID, isSender: true },
        ], // Agrega el nuevo juego al array de juegos
      };
      const dataString = JSON.stringify(updatedUser);
      // Actualiza la variable userLogin en el contexto
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  //* -----FUNCIONALIDAD PARA QUITAR AMIGO------
  const handleRemoveUser = async (friendID) => {
    try {
      const token = user?.token;
      const responseData = await deleteFriendInUser(userID, friendID, token);
      setResponse(responseData);
      if (responseData?.status == 200) {
        Swal.fire("Friend deleted!");
      }

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

  //* -----FUNCIONALIDAD PARA CANCELAR  REQUEST------
  const handleCancelFriendRequest = async (friendID) => {
    try {
      const token = user?.token;
      const responseData = await cancelFriendRequest(userID, friendID, token);
      setResponse(responseData);
      if (responseData?.status == 200) {
        Swal.fire("Request cancel!");
      }

      const updatedFriendRequests = user.friendRequests.filter(
        (friendRequest) => {
          return !(friendRequest.isSender && friendRequest.user === friendID);
        }
      );

      //* Objeto custom para extraer la id del amigo  y almacenar el usuario actualizado en el local
      const updatedUser = {
        ...user,
        friendRequests: updatedFriendRequests, // Elimina la ID del amigo del array de amigos
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };


  //* -----FUNCIONALIDAD PARA RECHAZAR SOLICITUD DE AMISTAD------
  const handleRejectRequest = async (friendID) => {
    try {
      const token = user?.token;
      const responseData = await rejectFriendRequest(userID, friendID, token);
      setRejectFriendResponse(responseData);
      console.log("respondata de request friend", responseData);
      const updatedFriendRequests = user.friendRequests.filter(
        (friendRequest) => {
          return friendRequest.isSender && friendRequest.user === friendID;
        }
      );
      //* Objeto custom para extraer la id del amigo  y almacenar el usuario actualizado en el local
      const updatedUser = {
        ...user,
        friendRequests: updatedFriendRequests, // Elimina la ID del amigo del array de amigos
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
      setTotalRequests(user?.friendRequests?.length)
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

  const friendRequestSended = user.friendRequests.some(
    (request) => request.user == _id
  );

  console.log(friendSendARequest);

  return (
    <div className="profileDetail-main">
      <div className="profile-container-detail">
        <div className="profile-card-user">
          <div className="profile-header-detail">
            <img
              className="profile-image"
              src={selectedUser?.file}
              alt="Profile"
            />
            <div className="text-btn-detail-wrap">
              <h2 className="userNameTextDetail">{selectedUser?.name}</h2>
              <div className="msgContainer">
                <Link to={`/messages/${_id}`} id="msg-buttom">
                  ENVIAR MENSAJE
                </Link>
              </div>
              <div className="btn-userDetailWrapper">
                {!user.friends.includes(_id) ? (
                  !friendRequestSended ? (
                    <button
                      className=" btn-user"
                      onClick={() => handleFriendRequest(selectedUser._id)}
                    >
                      Send friend request
                    </button>
                  ) : friendSendARequest == true ? (
                    <>
                      <button
                        className=" btn-user"
                        onClick={() => handleAddUser(selectedUser._id)}
                      >
                        Add friend
                      </button>

                      <button
                        className=" btn-user"
                        onClick={() =>
                          handleRejectRequest(selectedUser._id)
                        }
                      >
                        Cancel request
                      </button>
                    </>
                  ) : (
                    <button
                      className=" btn-user"
                      onClick={() =>
                        handleCancelFriendRequest(selectedUser._id)
                      }
                    >
                      Cancel request
                    </button>
                  )
                ) : (
                  <button
                    className=" btn-user"
                    onClick={() => handleRemoveUser(selectedUser._id)}
                  >
                    Quitar amigo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section-detail">
              <div>
                <div className="friends-sectionName-detail">
                  <h3 className="section-title">Friends</h3>
                </div>

                <ul className="friends-list-detail">
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
            </div>
            <div className="profile-section-detail">
              <div className="friends-sectionName-detail">
                {" "}
                <h3 className="section-title">Games</h3>
              </div>
              <div className="games-list-detail">
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
          </div>
          <div className="fluidContainerProfile"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
