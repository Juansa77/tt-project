import { useForm } from "react-hook-form";

import "./ChangeUserName.css";


import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import useUpdateError from "../../hooks/useUpdateError";
import { useAuth } from "../../contexts/authContext";
import { updateUser } from "../../services/API_USER/user.service";


const ChangeUserName = () => {
  const { user, setUser, logOut } = useAuth();
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const defaultData = {
    name: user?.user,
  };

  //! ------------ 1) La funcion que gestiona el formulario----
  const formSubmit = (formData) => {
    console.log("entro");
    Swal.fire({
      title: "Are you sure you want to change your data profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(73, 193, 162)",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then(async (result) => {
      let customFormData;
      if (result.isConfirmed) {
        customFormData = { ...formData };
        setSend(true);
        setRes(await updateUser(customFormData));
        setSend(false);
      } 
    });
  };

  //! -------------- 2 ) useEffect que gestiona la parte de la respuesta ------- customHook

  useEffect(() => {
    console.log(res);
    useUpdateError(res, setRes, setUser, logOut);
  }, [res]);

  return (
    <>
      <div className="changeName-container">
        <div className="containerDataNoChange"></div>
        <div className="form-wrap formProfile">
          <h1>Change your user name ♻</h1>
          <p>Please, enter your new user name</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                defaultValue={defaultData?.name}
                {...register("name")}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                username
              </label>
            </div>
        
            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#49c1a2" }}
              >
                CHANGE DATA PROFILE
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangeUserName;
