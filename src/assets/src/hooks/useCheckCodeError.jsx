import Swal from "sweetalert2/dist/sweetalert2.all.js";

const useCheckCodeError = (res,
  setDeleteUser,
  setOkCheck,
  setUser,
  setReloadPageError,
  setRes) => {

    console.log("entra en checkcode")
  //* ------------------ 200 : todo ok
  if (res?.data?.testCheckOk?.toString() == "true") {
    // comprobamos que vengas del login con el localStorage
    if (localStorage.getItem("user")) {
      const currentUser = localStorage.getItem("user");
      const parseCurrentUser = JSON.parse(currentUser);
      const customUser = {
        ...parseCurrentUser,
        check: true,
      };
      // como quiero volver a meterlo al local tengo que volver a convertirlo en un string
      const customUserString = JSON.stringify(customUser);
      setUser(() => customUser);
      localStorage.setItem("user", customUserString);
    }
    setOkCheck(() => true);
    Swal.fire({
      icon: "success",
      title: "Ok correct code ✅",
      showConfirmButton: false,
      timer: 1500,
    });
  }


    //?------------------------------------------------------
    //* ------------------ 200 : Todo OK pero check no cambia
   //?------------------------------------------------------
/*
    if (res?.data?.user?.check.toString() == "false") {
        Swal.fire({
          icon: "error",
          title: "User not checked",
          showConfirmButton: false,
          timer: 1500,
        });
            //*Vaciamos la res 
    setRes(()=>{})
      }

  */
    //?------------------------------------------------------ ---------   
  //* ------------------- 200--usuario NO BORRADO .includes error delet user
   //?-----------------------------------------------------------------

  if (res?.response?.data?.includes("Error deleting user")) {
 
    Swal.fire({
      icon: "error",
      title: "Wrong code",
      text: "User not deleted, please try again",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

    //?------------------------------------------
  //* ------------------- 200---usuario borrado 
  //?------------------------------------------------------
  if (res?.response?.data?.includes("User deleted")) {
    setRes(() => {});
    Swal.fire({
      icon: "error",
      title: "Wrong code, user deleted",
      text: "User deleted, try register again",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

  //?-----------------------------------------------
  //* ------------------- 404---usuario no encontrado 
  //?------------------------------------------------------
  
  if (res?.response?.data?.includes("User not found")) {

    Swal.fire({
      icon: "error",
      title: "Internal server error",
      text: "User not deleted, try register again",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

    //?----------------------------------------------------
  //* ------------------- 404---RANDOM ERROR.MESSAGE
  //?------------------------------------------------------
  
  if (res?.response?.status==404) {

    Swal.fire({
      icon: "error",
      title: "Internal server error",
      text: "User not deleted, try register again",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

    //?----------------------------------------------------
  //* ------------------- 500 internal server error----------
   //?------------------------------------------------------

  if (res?.response?.status == 500) {
    setRes(() => {});
    Swal.fire({
      icon: "error",
      title: "Server error",
      text: "Server error",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

export default useCheckCodeError;
