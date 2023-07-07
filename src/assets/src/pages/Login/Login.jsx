/* eslint-disable react-hooks/rules-of-hooks */
import "./Login.css";
import { Link, Navigate } from "react-router-dom";
import "./Login.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../services/API_USER/user.service";
import useLoginError from "../../hooks/useLoginError";
import { useAuth } from "../../contexts/authContext";

const Login = () => {
  const { userLogin, setUser } = useAuth();
  const { handleSubmit, register, getValues } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [loginOk, setLoginOk] = useState(false);

  //* 1) ------------------ FUNCION QUE GESTIONA EL FORMULARIO----------
  const formSubmit = async (formData) => {
    setSend(true);
    console.log(formData)
    setRes(await loginUser(formData));
    setSend(false);
  };

  //* 2) ------------------ LOS USEEFFECT QUE GESTIONAN LA RESPUESTA: ERRORES Y 200
//*La primera vez que renderiza, setea el user a null, por si las moscas
  useEffect(() => {
    setUser(() => null);
  }, []);
  useEffect(() => {
    console.log(res);
    useLoginError(res, setLoginOk, userLogin, setRes);
  }, [res]);
  //* 3) ------------------ ESTADOS DE NAVEGACION O ESTADOS DE FUNCIONALIDADES OK

  if (loginOk) {
    if (res.data.user.check == false) {
      return <Navigate to="/verifyCode" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
  return (
    <>
      <div className="form-wrap-login">
        <h1>Sign In</h1>
        <p>We are happy to see you again</p>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="email_container form-group">
            <input
              className="input_user"
              type="email"
              id="email"
              name="email"
              autoComplete="false"
              {...register("email", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              email
            </label>

            <div className="password_container form-group">
              <input
                className="input_user"
                type="password"
                id="password"
                name="password"
                autoComplete="false"
                {...register("password", { required: true })}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                password
              </label>
            </div>
          </div>

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#49c1a2" }}
            >
              {send ? "Loading..." : "LOGIN"}
            </button>
          </div>
          <p className="bottom-text">
            <small>
              Have you forgotten the password?
              <Link to="/forgotpassword" className="anchorCustom">
                Change password
              </Link>
            </small>
          </p>
        </form>
      </div>
      <div className="footerForm">
        <p className="parrafoLogin">
          Are you not registered? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
