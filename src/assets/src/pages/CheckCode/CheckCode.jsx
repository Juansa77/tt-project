/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate } from "react-router-dom";
import "./CheckCode.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useCheckCodeError from "../../hooks/useCheckCodeError";
import { checkCodeConfirmationUser, resendCode } from "../../services/API_USER/user.service";
import useAutoLogin from "../../hooks/useAutoLogin";
import { useAuth } from "../../contexts/authContext";
import ButtonResendCode from "../../components/ButtonResendCode";



const CheckCode = () => {
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [okCheck, setOkCheck] = useState(false);
  const [reloadPageError, setReloadPageError] = useState(false);
  const [okAutoLogin, setOkAutoLogin] = useState(false)
  const [deleteUser, setDeleteUser] = useState(false);
  const { register, handleSubmit } = useForm();
  const { allUser, userLogin, setUser, user, dataLogin } = useAuth();
console.log(dataLogin)

  //*-----1. FUNCIONES QUE GESTIONAN LAS PETICIONES---------

  const formSubmit = async (formData) => {
    //*Comprobamos si vienes del login, ya que tienes que tener algo en localstorage
    const userLocal = localStorage.getItem("user");
    if (userLocal == null) {
      //* Alluser es la res que recibimos del registro, solo cuando venimos del registro
      //*usuario que viene del registro
      console.log("esto es all user",allUser)
      console.log("esto es Data Login",dataLogin)
      const customFormData = {
        email: allUser.data.user.email,
        confirmationCode: parseInt(formData.confirmationCode),
      };
      console.log(customFormData)
      setSend(true);
      setRes(await checkCodeConfirmationUser(customFormData));
      setSend(false);
    } else {
      //* este usuario viene del login, ya que user está en local storage
      const customFormData = {
        email: user.email,
        confirmationCode: parseInt(formData.confirmationCode),
      };
      
      setSend(true);
      setRes(await checkCodeConfirmationUser(customFormData));
      setSend(false);
    }
  };


  //*-----2--USE EFFECT PARA GESTIONAR ERRORES Y 200 CON CUSTOM HOOK Y SWAL---------

  useEffect(() => {
    console.log(res);
    useCheckCodeError(
      res,
      setDeleteUser,
      setOkCheck,
      setUser,
      setReloadPageError,
      setRes
    );
  }, [res]);


   //*-----2--ESTADOS DE NAVEGACIÓN---------
  if (okCheck) {
    if(!localStorage.getItem("user")){

      setOkCheck(()=>false)
      useAutoLogin(allUser, userLogin, setOkCheck, dataLogin)
    }
    else{
      return <Navigate to="/dashboard" />;}

  }


  if(deleteUser){
    return <Navigate to="/register" />;

  }

  if(reloadPageError){
    return <Navigate to="/login" />;

  }

  //*-----3. CONFIRMACIONES DE QUE TODO ESTÁ OK---------

  return (
    <>
    <div className="checkcode-container">
      <div className="form-wrap">
        <h1>Verify your code 👌</h1>
        <p>Write the code sent to your email</p>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              {...register("confirmationCode", { required: false })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Registration code
            </label>
          </div>

          <div className="btn_container">
            <button
              id="btnCheck"
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#49c1a2" }}
            >
              Verify Code
            </button>
          </div>
          <div className="btn_container">
          <ButtonResendCode setReloadPageError={setReloadPageError} />
        </div>

          <p className="bottom-text">
            <small>
              If the code is not correct ❌, your user will be deleted from the
              database and you will need to register again.{" "}
            </small>
          </p>
        </form>
      </div>
      </div>
    </>
  );
};

export default CheckCode;