import "./FriendSearchPage.css";
import FriendSearcher from "../../components/FriendSearcher";
import {
  addFriendToUser,
  deleteFriendInUser,
  getUserByCity,
} from "../../services/API_USER/user.service";
import { useState } from "react";
import UserCard from "../../components/UserCard";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { FaSearch } from "react-icons/fa";

const FriendSearchPage = () => {
  const [selectedCitySearchUser, setSelectedCitySearchUser] = useState("");
  const [response, setResponse] = useState([]);
  const { user, userLogin } = useAuth();
  const userID = user?.id;

  const handleSearch = async () => {
    // Resto de la lógica de búsqueda...
    try {
      const city = selectedCitySearchUser;
      const responseData = await getUserByCity(city);
      setResponse(responseData);
      console.log("responseData de la búsqueda", responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCitySearchUser(city);
  };

  const handleAddUser = async (friendID) => {
    console.log(userID);
    try {
      console.log("esto es user", user);

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

  //* FUNCIÓN PARA ALMACENAR LOS DATOS DEL JUEGO SELECCIONADO PARA USARLO EN DETAIL Y NO HACER UNA NUEVA LLAMADA

  //* SACAMOS DEL CONTEXTO DE GAME PARA ALMACENAR LOS DATOS DEL JUEGO
  const { setSelectedUser } = useUserContext();

  // Instancia de la historia del enrutador para redirigir a la página de detalles
  const navigate = useNavigate();

  const handleSelectFriend = (friend) => {
    console.log("amigo seleccionado>", friend);
    setSelectedUser(friend);
    // Redirige a la página de detalles del juego seleccionado
    navigate(`/users/${friend._id}`);
  };

  return (
    <div className="friendSearch" >
      <div className="search-result-container">
        <div className="btn-wrap">
          <div>
            <FriendSearcher setSelectedCity={handleCitySelect} />
            <button
              className="btn-citySearch"
              onClick={handleSearch}
              style={{ backgroundColor: "transparent" }}
            >
              <FaSearch size="20px" />
            </button>
          </div>
        </div>
        <div className="friendSearch-main">
          {response?.data?.length > 0 ? (
            response.data.map(
              (friend, index) =>
                friend._id != userID && (
                  <div
                    key={friend._id}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <UserCard
                      key={index}
                      title={friend.name}
                      image={friend.file}
                    />
                  </div>
                )
            )
          ) : response?.response?.data == "User not found" ? (
            <div className="friendSearchAdvice">
              <div className="adviceTextWrapper">
                <h3>No users in the city </h3>
              </div>
            </div>
          ) : (
            <div className="friendSearchAdvice">
              <div className="adviceTextWrapper">
                <h1>Busca amigos en tu ciudad</h1>
                <p>
                  Selecciona tu ciudad y encuentra amigos y amigas para jugar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendSearchPage;
