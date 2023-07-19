import "./FriendSearchPage.css";
import FriendSearcher from "../../components/FriendSearcher";
import { addFriendToUser, deleteFriendInUser, getUserByCity } from "../../services/API_USER/user.service";
import { useState } from "react";
import UserCard from "../../components/UserCard";
import { useAuth } from "../../contexts/authContext";




const FriendSearchPage = () => {
  
  const [selectedCitySearchUser, setSelectedCitySearchUser] = useState("");
  const [response, setResponse] = useState([]);
  const { user, userLogin } = useAuth();
  const userID = user?.id;

  const handleSearch =async () => {
  
    // Resto de la lógica de búsqueda...
    try {
      const city = selectedCitySearchUser;
      const responseData = await getUserByCity(city);
      setResponse(responseData);
      console.log("responseData", responseData)
    
    } catch (error) {
      console.log(error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCitySearchUser(city);
  };

  const handleAddUser = async (friendID) => {
    console.log(userID)
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


  
  return (
    <div className="friendSearch">
    <div className="btn-wrap">
      <FriendSearcher setSelectedCity={handleCitySelect} />
      <button className="btn-citySearch" onClick={handleSearch}>
        Search
      </button>
      </div>
      <p>Selected City: {selectedCitySearchUser}</p>
      <div className="search-result-container">
        {response?.data?.length >0 ? response.data.map((friend, index) =>
          <UserCard
              key={index}
              title={friend.name}
              image={friend.file}
              onClickAdd={() => handleAddUser(friend._id)}
              onClickRemove={() => handleRemoveUser(friend._id)}
            />
        ): <p>No users in the city </p>  }
      </div>
      
    </div>
  );
};

export default FriendSearchPage;
