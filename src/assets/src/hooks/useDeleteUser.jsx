
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { deleteUser } from "../services/API_USER/user.service";
import { Navigate } from "react-router-dom";



 const useDeleteUser = (setUser, user) => {
  console.log(user.id)
  Swal.fire({
    title: "Are you sure you want to delete your profile?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(73, 193, 162)",
    cancelButtonColor: "#d33",
    confirmButtonText: "YES",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await deleteUser(user);
      switch (res.status) {
        case 200:
          Swal.fire({
            icon: "success",
            title: "Delete User",
            text: "See you soon",
            showConfirmButton: false,
            timer: 1500,
          });
          setUser(() => null);
          localStorage.removeItem("user");
  
          return  <Navigate to="/register" />

        default:
          Swal.fire({
            icon: "error",
            title: "No delete User ❎",
            text: "Please, try again",
            showConfirmButton: false,
            timer: 1500,
          });
          break;
      }
     
    }
  });
};


export default useDeleteUser