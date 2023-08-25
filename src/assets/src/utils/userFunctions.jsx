import { sendFriendRequest, cancelFriendRequest, addFriendToUser, rejectFriendRequest, deleteFriendInUser } from "../services/API_USER/user.service";
import Swal from "sweetalert2";


//* ---FUNCIÓN PARA ENVIAR SOLICITUDES DE AMISTAD-------

export const handleFriendRequest = async (
    userID,
    friendID,
    token,
    setResponse,
    user,
    userLogin
  ) => {
    try {
      const responseData = await sendFriendRequest(userID, friendID, token);
      setResponse(responseData);
  
      if (responseData?.status === 200) {
        Swal.fire('Friend request sended!');
      }
  
      const updatedUser = {
        ...user,
        friendRequests: [
          ...user.friendRequests,
          { user: friendID, isSender: true },
        ],
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };
  

//* ---FUNCIÓN PARA CANCELAR SOLICITUDES DE AMISTAD-------

  export const handleCancelFriendRequest = async (
    userID,
    friendID,
    token,
    setResponse,
    user,
    userLogin
  ) => {
    try {
      const responseData = await cancelFriendRequest(userID, friendID, token);
      setResponse(responseData);
      if (responseData?.status === 200) {
        Swal.fire('Request cancel!');
      }
  
      const updatedFriendRequests = user.friendRequests.filter((friendRequest) => {
        return !(friendRequest.isSender && friendRequest.user === friendID);
      });
  
      const updatedUser = {
        ...user,
        friendRequests: updatedFriendRequests,
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  //* FUNCIÓN PARA ACEPTAR REQUEST FRIEND Y AÑADIR AMIGO-----

  export const handleAddUser = async (
    userID,
    friendID,
    token,
    setAddFriendResponse,
    user,
    userLogin,
    setTotalRequests
  ) => {
    try {
      const responseData = await addFriendToUser(userID, friendID, token);
      setAddFriendResponse(responseData);
  
      const updatedFriendRequests = user.friendRequests.filter((friendRequest) => {
        return friendRequest.isSender && friendRequest.user === friendID;
      });
  
      const updatedUser = {
        ...user,
        friends: [...user.friends, friendID],
        friendRequests: updatedFriendRequests,
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
      setTotalRequests(user?.friendRequests?.length);
    } catch (error) {
      console.log(error);
    }
  };
  
  //* FUNCIÓN PARA RECHAZAR  REQUEST FRIEND-----
  export const handleRejectRequest = async (
    userID,
    friendID,
    token,
    setRejectFriendResponse,
    user,
    userLogin,
    setTotalRequests
  ) => {
    try {
      const responseData = await rejectFriendRequest(userID, friendID, token);
      setRejectFriendResponse(responseData);
  
      const updatedFriendRequests = user.friendRequests.filter((friendRequest) => {
        return friendRequest.isSender && friendRequest.user === friendID;
      });
  
      const updatedUser = {
        ...user,
        friendRequests: updatedFriendRequests,
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
      setTotalRequests(user?.friendRequests?.length);
    } catch (error) {
      console.log(error);
    }
  };

  //* FUNCIÓN PARA QUITAR AMIGO-----

  export const handleRemoveUser = async (
    userID,
    friendID,
    token,
    setResponse,
    user,
    userLogin
  ) => {
    try {
      const responseData = await deleteFriendInUser(userID, friendID, token);
      setResponse(responseData);
  
      if (responseData?.status === 200) {
        Swal.fire('Friend deleted!');
      }
  
      const updatedUser = {
        ...user,
        friends: user.friends.filter((friend) => friend !== friendID),
      };
      const dataString = JSON.stringify(updatedUser);
      userLogin(dataString);
    } catch (error) {
      console.log(error);
    }
  };

  //* FUNCIÓN PARA ACCEDER A PÁGINA DE DETALLE DE USUARIO ----

  export const handleSelectFriend = (friend, setSelectedUser, user, navigate) => {
    console.log("amigo seleccionado>", friend);
    setSelectedUser(friend);
    // Redirige a la página de detalles del juego seleccionado
    if (friend._id == user.id) {
      navigate(`/profile`);
    } else {
      navigate(`/users/${friend._id}`);
    }
  };
