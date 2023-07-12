/* eslint-disable react-hooks/rules-of-hooks */
import "./ChangeProfilePic.css";

import { useForm } from "react-hook-form";
import { FigureUser } from "./FigureUser";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useUpdateError } from "../hooks";
import Uploadfile from "../UploadFile/UploadFile";
import { updateUser } from "../../services/API_USER/user.service";
import { useAuth } from "../../contexts/authContext";

export const FormProfile = () => {
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
      if (result.isConfirmed) {
        const inputfile = document.getElementById("file-upload").files;
        let customFormData;

        if (inputfile.length !== 0) {
          customFormData = { ...formData, image: inputfile[0] };
          setSend(true);
          setRes(await updateUser(customFormData));
          setSend(false);
        }
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
      <div className="containerProfile">
        <div className="containerDataNoChange">
          <FigureUser user={user} />
        </div>
        <div className="form-wrap formProfile">
          <h1>Change your data profile ♻</h1>
          <p>Please, enter your new data profile</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <Uploadfile />
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
