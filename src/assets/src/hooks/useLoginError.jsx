import Swal from "sweetalert2/dist/sweetalert2.all.js";

const useLoginError = (res, setLoginOk, userLogin, setRes) => {
  //? ----si la respuesta es ok = res.status
  //?------ si la respuesta no esta ok= res.response.status
  //* ------------------ 200 : todo ok

  if (res?.status == 200) {
    const dataCustom = {
      token: res.data.token,
      user: res.data.user.name,
      email: res.data.user.email,
      _id: res.data.user._id,
      image: res.data.user.image,
      check: res.data.user.check,
    };



    const dataString = JSON.stringify(dataCustom);
    userLogin(dataString);
    setLoginOk(() => true);
    Swal.fire({
      icon: "success",
      title: "Welcome to my Page",
      text: "Login ok",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //* ------------------- 404: 'password dont match'

  if (res?.response?.data?.includes("password dont match")) {
    setRes(() => {});
    Swal.fire({
      icon: "error",
      title: "Error login",
      text: "Incorrect password or email ",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  //* ------------------- 404: 'User no register'

  if (res?.response?.data?.includes("user not register")) {
    Swal.fire({
      icon: "error",
      title: "User not registered",
      text: "User not registered ",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

  //* --------------------500: INTERNAL SERVER ERROR

  
  if (res?.response?.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Server error",
      text: "Server error",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes(() => {});
  }

};
export default useLoginError;
