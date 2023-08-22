/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import "./Register.css";

import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Uploadfile from "../../components/UploadFile/UploadFile";
import { registerUser } from "../../services/API_USER/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { useForm, Controller } from "react-hook-form";
import useRegisterError from "../../hooks/useRegisterError";
import { useAuth } from "../../contexts/authContext";
import Logo from "../../components/Logo/Logo";


const Register = () => {
  //* MÉTODOS DE REACT HOOK FORM

  const { register, handleSubmit, control } = useForm();
  const [res, setRes] = useState({});
  //? Para setear cuando se llama al servicio y cuando termina la llamada
  const [send, setSend] = useState(false);
  //* Estados para manejar que la respuesta es exitosa
  const [okRegister, setOkRegister] = useState(false);

  const {
    allUser,
    setAllUser,
    bridgeData,
    setDatalogin,
    dataLogin,
    setSelectedCity,
  } = useAuth();

  //! ------------------------------------------------------------------------------
  //? 1) funcion que se encarga del formulario - de la data del formulario
  //! ------------------------------------------------------------------------------

  const formSubmit = async (formData) => {
 
    const inputFile = document.getElementById("file-upload").files;


    setDatalogin({
      password: formData.password,
      email: formData.email,
    });

    if (inputFile.length !== 0) {
      // cuando me han hayan puesto una imagen por el input

      const custonFormData = {
        ...formData,
        file: inputFile[0],
      };

      setDatalogin(custonFormData);
      console.log(dataLogin);
      console.log(custonFormData);

      setSend(true);
      setRes(await registerUser(custonFormData));

      setSend(false);
    } else {
      const custonFormData = {
        ...formData,
      };

      setSend(true);
      setRes(await registerUser(custonFormData));
      setSend(false);
    }
  };

  //! ------------------------------------------------------------------------------
  //? 2) funcion que se encarga del formulario- de la data del formulario
  //! ------------------------------------------------------------------------------
  useEffect(() => {
    useRegisterError(
      res,
      setOkRegister,
      setRes,
      setAllUser,
      setDatalogin
    );
    if (res?.status == 201) bridgeData("ALLUSER");
  }, [res]);
  //! ------------------------------------------------------------------------------
  //? 3) Estados de navegacion ----PENDIENTE
  //! ------------------------------------------------------------------------------

  if (okRegister) {
    return <Navigate to="/verifyCode" />;
  }
  return (
    <>
      <div className="register-container">
      <Logo/>
        <div className="form-wrap">
          <h1>Create your account</h1>
          <p>It’s free</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                {...register("name", { required: true })}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                username
              </label>
            </div>

            <div className="city_container form-group">
              {/* //* Código para renderizar un dropdown en REACT HOOK FORM
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <DropDownMenu
                    setSelectedCity={onChange}
                    selectedCity={value}
                    ref={ref}
                  />
                )}
              />*/}

              <input
                className="input_user"
                type="text"
                id="city"
                name="city"
                autoComplete="false"
                {...register("city", { required: true })}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                City
              </label>
            </div>

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
            </div>
            <div className="sexo">
              <input
                type="radio"
                name="sexo"
                id="hombre"
                value="hombre"
                {...register("gender")}
              />
              <label htmlFor="hombre" className="label-radio hombre">
                Hombre
              </label>
              <input
                type="radio"
                name="sexo"
                id="mujer"
                value="mujer"
                {...register("gender")}
              />
              <label htmlFor="mujer" className="label-radio mujer">
                Mujer
              </label>
            </div>

            <Uploadfile />

            <div className="btn_container">
              <button
                className="btn"
        
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#0070c9" }}
              >
                {/* SI SEND ESTÁ EN TRUE, CARGAMOS EL SPINNER DE LOADING*/}
                {send ? <Spinner /> : "Register"}
              </button>
            </div>
            <p className="bottom-text">
              <small>
                By clicking the Sign Up button, you agree to our{" "}
                <a href="#">Terms & Conditions</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </small>
            </p>
            <p className="bottom-text">
              <small>
                Have you forgotten the password?
                <Link to="/forgotpassword" className="anchorCustom2" style={{background:"0070c9"}}>
                  Change password
                </Link>
              </small>
            </p>
          </form>
          <div className="account-reminder">
            <p style={{background:"0070c9"}}>
              Already have an account? <a href="#">Login Here</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
