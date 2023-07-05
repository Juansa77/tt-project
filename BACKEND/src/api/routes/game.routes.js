const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
const {
  title,
  gameByID,
  addGameToUser,
  deleteGameInUser,
  gameByRating,
  gameByOwners,
  gamesByCities,
  byPlayingTime,
  byType,
  updateGame,
  deleteGameByID,
  multIFilter,
  addGameToDb
} = require('../controllers/games.controller');
const { isAuth, isAuthAdmin } = require('../../middlewares/auth.midddleware');

const GamesRoutes = express.Router();

//?------Ruta by title--------------------
GamesRoutes.get('/title/:title', title);

//?--------Ruta by ID---------------------
GamesRoutes.get('/id/:id', gameByID);

//?--------Ruta ADD GAME TO USER--------
GamesRoutes.post('/:userId/add-game/:gameId', [isAuth], addGameToUser);

//?-------Ruta DELETE GAME IN USER-----
GamesRoutes.post('/:userId/delete-game-user/:gameId', [isAuth], deleteGameInUser);

//?------Ruta GAME BY RATING-------------
GamesRoutes.get('/byrate/:rating', gameByRating);

//?------Ruta GAME BY OWNERS-------------
GamesRoutes.get('/owners/:title', gameByOwners);

//?-----Ruta GAME OWNED BY CITY-------------
GamesRoutes.get('/:title/gamebycity/:city', gamesByCities);

//?-----Ruta GAME BY RATING-------------
GamesRoutes.get('/playing-time/:playingTime', byPlayingTime);

//?-----Ruta GAME BY TYPE-------------
GamesRoutes.get('/bytype', byType);

//?-----Ruta UPDATE GAME--------
GamesRoutes.patch(
  '/update/update/:id',
  [isAuthAdmin],
  upload.single('image'),
  updateGame
);

//?----- RUTA ADD GAME TO DB--------
GamesRoutes.post('/register-new-game', [isAuthAdmin], upload.single('image'), addGameToDb);


//?-----Ruta DELETE GAME IN DB--------
GamesRoutes.delete('/delete-game/:id', [isAuthAdmin], deleteGameByID);

//?-----Ruta GAME MULTIFILTERING (TYPE, TIME, PLAYERS, RATING)-------------
GamesRoutes.get('/gamesort', multIFilter);

module.exports = GamesRoutes;
