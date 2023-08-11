const express = require("express");
const { upload } = require("../../middlewares/files.middleware");
const {
  register,
  checkNewUser,
  updateUser,
  deleteUser,
  resendCode,
  login,
  forgotPassword,
  sendPassword,
  modifyPassword,
  addFriendToUser,
  deleteFriendInUser,
  getUserByID,
  autoLogin,
  getUserByCity,
  getGamesInUser,
  getFriendsInUser,
  sendFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  cancelFriendRequest,
} = require("../controllers/users.controller");
const { isAuth } = require("../../middlewares/auth.midddleware");

const UserRoutes = express.Router();

//?------Ruta REGISTER USER--------
UserRoutes.post("/register", upload.single("file"), register);

//?-----Ruta CHECK CONFIRMATION--------
UserRoutes.post("/check", checkNewUser);

//?-------Ruta RESEND--------
UserRoutes.post("/resend", resendCode);

//?-------Ruta LOGIN--------
UserRoutes.post("/login", login);

//?-------Ruta AUTO LOGIN--------
UserRoutes.post("/login/autologin", autoLogin);

//?-------Ruta FORGOT PASSWORD--------
UserRoutes.post("/forgotpassword", forgotPassword);

//?-----GET USER BY ID--------
UserRoutes.get("/getuser/:id", getUserByID);

//?-----GET USER BY CITY--------
UserRoutes.get("/getuser/city/:city", getUserByCity);

//?-----GET GAMES IN USER--------
UserRoutes.get("/getuser/games/:id", getGamesInUser);

//?-----GET FRIENDS IN USER--------
UserRoutes.get("/getuser/friends/:id", getFriendsInUser);

//?-------Ruta CHANGE PASSWORD USER--------
UserRoutes.patch("/changepassword", [isAuth], modifyPassword);

//?-------Ruta UPDATE USER--------
UserRoutes.patch("/update/update", [isAuth], upload.single("file"), updateUser);

//?-----Ruta DELETE USER--------
UserRoutes.delete("/:id", [isAuth], deleteUser);

//?------Ruta SEND FRIEND REQUEST--------
UserRoutes.post(
  "/:userId/friend-request/:friendId",
  [isAuth],
  sendFriendRequest
);

//?-----GET FRIENDS REQUESTS--------
UserRoutes.get("/get-friend-request/:id", [isAuth], getFriendRequests);

//?------Ruta REJECT FRIEND REQUEST--------
UserRoutes.post(
  "/:userId/reject-request/:friendId",
  [isAuth],
  rejectFriendRequest
);

//?------Ruta CANCEL FRIEND REQUEST--------
UserRoutes.post(
  "/:userId/cancel-request/:friendId",
  [isAuth],
  cancelFriendRequest
);



//?------Ruta ADD FRIEND TO USER--------
UserRoutes.post("/:userId/add-friend/:friendId", [isAuth], addFriendToUser);

//?------Ruta DELETE FRIEND IN USER--------
UserRoutes.post(
  "/:userId/delete-friend/:friendId",
  [isAuth],
  deleteFriendInUser
);

//?--------------------
//*---REDIRECT ROUTE
//?--------------------

UserRoutes.get("/forgotpassword/sendpassword/:id", sendPassword);

module.exports = UserRoutes;
