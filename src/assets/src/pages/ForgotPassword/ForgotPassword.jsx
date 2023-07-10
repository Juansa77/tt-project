/* eslint-disable react-hooks/rules-of-hooks */
import "./ForgotPassword.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { forgotPassword } from "../../services/API_USER/user.service";
import useForgotPassword from "../../hooks/useForgotPassword";


const ForgotPassword = () => {
  //* Seteamos la respuesta de la llamada
  const [res, setRes] = useState({});
  //* Seteamos la llamada
  const [send, setSend] = useState(false);
  //* Sacamos el HandleSubmit y register de useForm
  const { handleSubmit, register } = useForm();
  //* variables para controlar si se ha hecho OK
  const [forgotOK, setForgotOK] = useState(false);

  //*-----FUNCIÓN PARA CONTROLAR EL FORMULARIO----------------
  const formSubmit = async (formData) => {
    //* ponemos a true la llamada
    setSend(true);
    //*Le pasamos al servicio forgotpassword el formData
    setRes(await forgotPassword(formData));
    //*Cortamos la llamada
    setSend(false);
  };

  //*------------USEEFFECT PARA GESTIONAR LA RES

  useEffect(() => {
    console.log(res);
    useForgotPassword(res, setRes, setForgotOK);
  }, [res]);

  //*------------ESTADOS DE NAVEGACIÓN

  if (forgotOK) {
    console.log("password send");
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="form-wrap">
        <h1>Change your password 💱</h1>

        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <input
              className="input_user"
              type="text"
              id="email"
              name="email"
              autoComplete="false"
              {...register("email", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Email
            </label>
          </div>

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#49c1a2" }}
            >
              Change password
            </button>
          </div>

          <p className="bottom-text">
            <small>Enter your email to send you the new password 💌</small>
          </p>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
