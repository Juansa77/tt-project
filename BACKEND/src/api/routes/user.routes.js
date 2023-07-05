const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
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
  autoLogin
} = require('../controllers/users.controller');
const { isAuth } = require('../../middlewares/auth.midddleware');

const UserRoutes = express.Router();

//?------Ruta REGISTER USER--------
UserRoutes.post('/register', upload.single('image'), register);

//?-----Ruta CHECK CONFIRMATION--------
UserRoutes.post('/check', checkNewUser);

//?-------Ruta RESEND--------
UserRoutes.post('/resend', resendCode);

//?-------Ruta LOGIN--------
UserRoutes.post('/login', login);

//?-------Ruta AUTO LOGIN--------
UserRoutes.post('/login/autologin', autoLogin);

//?-------Ruta FORGOT PASSWORD--------
UserRoutes.post('/forgotpassword', forgotPassword);

//?-----GET USER BY ID--------
UserRoutes.get('/getuser/:id',  getUserByID);


//?-------Ruta CHANGE PASSWORD USER--------
UserRoutes.patch('/changepassword', [isAuth], modifyPassword);

//?-------Ruta UPDATE USER--------
UserRoutes.patch(
  '/update/update',
  [isAuth],
  upload.single('image'),
  updateUser
);

//?-----Ruta DELETE USER--------
UserRoutes.delete('/:id', [isAuth], deleteUser);

//?------Ruta ADD FRIEND TO USER--------
UserRoutes.post('/:userId/add-friend/:friendId', [isAuth], addFriendToUser);

//?------Ruta DELETE FRIEND IN USER--------
UserRoutes.post(
  '/:userId/delete-friend/:friendId',
  [isAuth],
  deleteFriendInUser
);

//?--------------------
//*---REDIRECT ROUTE
//?--------------------

UserRoutes.get('/forgotpassword/sendpassword/:id', sendPassword);

module.exports = UserRoutes;
