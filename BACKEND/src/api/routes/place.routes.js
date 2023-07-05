const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
const { isAuthPlace, isAuthAdmin } = require('../../middlewares/auth.midddleware');
const {
  registerPlace,
  checkNewPlace,
  loginPlace,
  resendPlaceCode,
  forgotPlacePassword,
  sendPlacePassword,
  modifyPlacePassword,
  addGameToCatalog,
  deleteGameInCatalog,
  gameInCatalogByCity,
  updatePlace,
  deletePlace
} = require('../controllers/places.controller');

const PlacesRoutes = express.Router();

//?------Ruta REGISTER PLACE--------
PlacesRoutes.post('/register-place', upload.single('image'), registerPlace);

//?-----Ruta CHECK CONFIRMATION--------
PlacesRoutes.post('/check-place', checkNewPlace);

//?-------Ruta LOGIN PLACE--------
PlacesRoutes.post('/place-login', loginPlace);

//?-------Ruta RESEND--------
PlacesRoutes.post('/resend-place', resendPlaceCode);

//?-------Ruta FORGOT PASSWORD--------
PlacesRoutes.post('/forgotpassword', forgotPlacePassword);

//?--------------------
//*---REDIRECT ROUTE
//?--------------------

PlacesRoutes.get('/forgotpassword/sendpassword/:id', sendPlacePassword);

//?-------Ruta CHANGE PASSWORD PLACE--------
PlacesRoutes.patch('/changepassword', [isAuthPlace], modifyPlacePassword);

//?--------Ruta ADD GAME TO PLACE CATALOG--------
PlacesRoutes.post(
  '/:placeId/add-game-to-catalog/:gameId',
  [isAuthPlace],
  addGameToCatalog
);

//?--------Ruta DELETE GAME IN PLACE CATALOG--------
PlacesRoutes.post(
  '/:placeId/delete-game-catalog/:gameId',
  [isAuthPlace],
  deleteGameInCatalog
);

//?-----Ruta GAME AVALIABLE IN CITY-------------
PlacesRoutes.get('/:title/gamebycity/:city', gameInCatalogByCity);

//?-------Ruta UPDATE  PLACE--------
PlacesRoutes.patch(
  '/update/update',
  [isAuthPlace],
  upload.single('image'),
  updatePlace
);

//?-----Ruta DELETE PLACE--------
PlacesRoutes.delete('/:id', [isAuthPlace] ,deletePlace);

module.exports = PlacesRoutes;
