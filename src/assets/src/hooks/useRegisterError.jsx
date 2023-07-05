/* eslint-disable no-unused-vars */
import Swal from "sweetalert2/dist/sweetalert2.all.js";


const useRegisterError = (res, setOkRegister, setRes, setAllUser) => {
  //! SI LA RESPUESTA ES OK, RES.STATUS
  //!SI NO ES OK, RES.RESPONSE.STATUS


  //* ----MANEJAMOS EL 200-----------------------


    


    
 if (res?.status == 201) {
  const dataToString = JSON.stringify(res);
  localStorage.setItem("data", dataToString);
  setOkRegister(()=>true)
  //setAllUser(()=> res.data)
 

    Swal.fire({
      icon: "success",
      title: "Welcome",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({})
  }

  //* ----MANEJAMOS EL 409: USER YA EXISTENTE--------

  if (res?.response?.status == 409) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "User already exists",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({})
  }


  //* ----MANEJAMOS CONTRASEÑA EN FORMATO INCORRECTO----

  if (res?.response?.data?.includes("validation failed: password")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Min 8 characters, 1 upper case, 1 lower case and a special character",
      showConfirmButton: false,
      timer: 3500,
    });
    setRes({})
  }

  //* ----USERNAME YA EXISTE------------------

  if (res?.response?.data.includes("duplicate key error collection")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Choose another name",
      showConfirmButton: false,
      timer: 3500,
    });
    setRes({})
  }

  //* ----ERROR 500: INTERNAL SERVER ERROR------------

  if (res?.response?.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Internal server error, try again",
      showConfirmButton: false,
      timer: 1500,
    });
    setRes({})
  }

  //* ----MANEJAMOS EL 404: CÓDIGO NO ENVIADO----------

  
  if(res?.response?.status ==404 && res?.data?.confirmationCode.includes("error resend code")){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Register OK, error sending code",
      showConfirmButton: false,
      timer: 3500,
    });
    setRes({})
  }
};

export default useRegisterError;
