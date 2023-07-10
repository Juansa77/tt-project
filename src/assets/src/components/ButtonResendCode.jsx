/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from "../contexts/authContext";
import { useEffect, useState } from "react";
import { resendCode } from "../services/API_USER/user.service";
import useResendCode from "../hooks/useResendCode";

const ButtonResendCode = ({setReloadPageError}) => {
  const [res, setRes] = useState(false);
  const [resend, setResend] = useState(false);
  const { allUser, user } = useAuth();

  //*----FUNCIÓN PARA GESTIONAR EL FORMULARIO
  const handleResend = async () => {
    const getEmailLocalStorage = () => {
      const local = localStorage.getItem("user");
      const parseUserLocal = JSON.parse(local);
      return parseUserLocal.email;
    };

    setResend(true);
    setRes(
      await resendCode({
        email: localStorage.getItem("user")
          ? getEmailLocalStorage()
          : allUser?.data?.user?.email,
      })
    );
    setResend(false);
  };

  //* ---USEEFFECT PARA GESTIONAR RESPUESTA

  useEffect(() => {
    console.log("resend res", res)
    useResendCode(res,setReloadPageError, setRes )
  }, [res]);

  return (
    <button
      id="btnResend"
      className="btn"
      disabled={resend}
      style={{ background: resend ? "#49c1a388" : "#49c1a2" }}
      onClick={() => handleResend()}
    >
      Resend Code
    </button>
  );
};

export default ButtonResendCode;
