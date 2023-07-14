import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";


 const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user == null || user?.check == false) {
    localStorage.removeItem("user");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute