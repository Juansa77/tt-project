import { sendFriendRequest, cancelFriendRequest } from "../services/API_USER/user.service";
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