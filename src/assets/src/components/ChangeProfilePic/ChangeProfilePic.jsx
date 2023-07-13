/* eslint-disable react-hooks/rules-of-hooks */
import "./ChangeProfilePic.css";

import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";

import Uploadfile from "../UploadFile/UploadFile";
import { updateUser } from "../../services/API_USER/user.service";
import { useAuth } from "../../contexts/authContext";
import useUpdateError from "../../hooks/useUpdateError";

const ChangeProfilePic = () => {
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
      title: "Are you sure you want to change your profile pic?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(73, 193, 162)",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed == true) {
        const inputfile = document.getElementById("file-upload").files;
        console.log(inputfile);
        let customFormData;

        if (inputfile.length !== 0) {
          console.log("entra en el input file");
          customFormData = { ...formData, file: inputfile[0] };
          setSend(true);
          setRes(await updateUser(customFormData));
          setSend(false);
        }
      }
    });
  };

  //! -------------- 2 ) useEffect que gestiona la parte de la respuesta ------- customHook

  useEffect(() => {
    console.log("res de profile pic", res);
    useUpdateError(res, setRes, setUser, logOut);
  }, [res]);

  return (
    <>
      <div className="changePic-container">
        <div className="containerDataNoChange"></div>
        <div className="form-wrap formProfile-pic">
          <h1>Change your data profile ♻</h1>
          <p>Please, enter your new data profile</p>
          <form onSubmit={handleSubmit(formSubmit)}>
          <Uploadfile registerForm={register} />
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

export default ChangeProfilePic;
