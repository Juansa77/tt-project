import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedCheckChildren = ({ children }) => {
  const { user, allUser, userPassRegister } = useAuth();
  console.log(allUser);
  if (allUser?.data?.user?.check == true || user?.check == true) {
    return <Navigate to="/dashboard" />;
  }


  return children;
};

export default ProtectedCheckChildren;
