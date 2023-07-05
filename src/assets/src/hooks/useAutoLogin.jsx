import { autoLoginUser } from "../services/API_USER/user.service";

const useAutoLogin = async (allUser, userLogin, setOkCheck, dataLogin) => {
  try {

    const { email, password } = allUser?.data?.user;

    const customFormData = {
      email,
      password,
    };
    const customFormDataAutoLogin = {
      email:dataLogin?.email,
      password:dataLogin?.password
    };

    console.log(customFormDataAutoLogin)
    const setData = await autoLoginUser(customFormDataAutoLogin);
    console.log("setdata.status", setData)
    if (setData?.status == 200) {
      
      const dataCustom = {
        token: setData.data.token,
        user: setData.data.user.name,
        email: setData.data.user.email,
        image: setData.data.user.image,
        check: setData.data.user.check,
      };

      const dataString = JSON.stringify(dataCustom);
      userLogin(dataString);
      setOkCheck(() => true);
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

export default useAutoLogin