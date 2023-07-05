/* eslint-disable no-unused-vars */
const Game = require('../models/game.model');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const cityValidation = require('../../utils/cityValidation');
const firstToUpperCase = require('../../utils/firstToUpperCase');
const { deleteImgCloudinary } = require('../../middlewares/files.middleware');
const setError = require('../../helpers/handleError');

dotenv.config();

//!---------------------------------------
//?-----------GAME  BY TITLE------------
//!---------------------------------------

const title = async (req, res, next) => {
  const { title } = req.params;
  const titleToSearch = firstToUpperCase(title);

  try {
    const game = await Game.find({ title: titleToSearch });
    console.log(game.length);
    if (game.length > 0) {
      return res.status(200).json(game);
    } else {
      return res.status(404).json('Game not found');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

//!---------------------------------------
//?-----------GAME  BY ID------------
//!---------------------------------------

const gameByID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const gameID = await Game.findById(id);

    if (gameID > 0) {
      return res.status(200).json(gameID);
    } else {
      return res.status(404).json('Game not found');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//!-------------------------------------------
//?-----------ADD GAME  TO USER------------
//!-------------------------------------------

const addGameToUser = async (req, res, next) => {
  const { userId, gameId } = req.params;

  try {
    //Lo primero es actualizar los indexs
    await Game.syncIndexes();
    const user = await User.findById(userId);
    const game = await Game.findById(gameId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (user.games.includes(gameId)) {
      return res.status(400).json({ message: 'Game already added to user' });
    } else {
      user.games.push(gameId);
      game.owners.push(userId);

      await user.save();
      await game.save();

      // Utilizamos la función populate para obtener la información completa del usuario y el juego
      const populatedUser = await user.populate('games');
      const populatedGame = await game.populate('owners');

      return res.status(200).json({
        message: 'Game added to user',
        user: populatedUser,
        game: populatedGame,
      });
    }
  } catch (error) {
    console.log('Error adding game to user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!----------------------------------------------
//?-----------DELETE GAME  IN USER------------
//!----------------------------------------------

const deleteGameInUser = async (req, res, next) => {
  const { userId, gameId } = req.params;
  const game = await Game.findById(gameId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    //Hacemos un includes para no meter juegos repetidos
    if (!user.games.includes(gameId)) {
      return res.status(400).json({ message: 'Game not found in user' });
    } else {
      // Eliminamos el juego del array games del usuario y en el array del juego eliminamos el propietario
      user.games.splice(user.games.indexOf(gameId), 1);
      game.owners.splice(game.owners.indexOf(userId), 1);
      await user.save();
      await game.save();
      return res.status(200).json({ message: 'Game erased in user' });
    }
  } catch (error) {
    console.log('Error erasing game in user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!---------------------------------------
//?-----------GAME  BY RATING------------
//!---------------------------------------

const gameByRating = async (req, res, next) => {
  const { rating } = req.params;

  try {
    //PARA ENCONTRAR ELEMENTOS IGUALES O SUPERIORES A LA PUNTUACIÓN ELEGIDA, PONEMOS EL OPERADOR DE MONGO $gte
    const games = await Game.find({ rating: { $gte: rating } });
 
    if (games.length > 0) {
      
      return res.status(200).json(games);
    } else {
      return res.status(404).json('Games with rating not found');
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!---------------------------------------
//?-----------GAME  BY OWNERS------------
//!---------------------------------------
const gameByOwners = async (req, res, next) => {
  const { title } = req.params;

  try {
    const games = await Game.find({ title: title });
    if (games.length > 0) {
      const owners = games.map((game) => game.owners);
      return res.status(200).json(owners);
    } else {
      return res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!----------------------------------------------------
//?-----------GAME TITLE OWNED BY CITY------------
//!----------------------------------------------------
const gamesByCities = async (req, res, next) => {
  const { title, city } = req.params;
  //Utilizamos la función para verificar si la ciudad es válida antes de hacer nada
  const cityIsValid = cityValidation(city);

  const titleToSearch = firstToUpperCase(title);
  if (cityIsValid === false) {
    return res.status(404).json('City is not valid');
  }
  try {
    //Obtenemos el juego
    const games = await Game.find({ title: titleToSearch });

    if (games.length > 0) {
      //Usamos un Promise all para poder usar el await y manejar la asincronía
      const ownersInCity = await Promise.all(
        games.flatMap(async (game) => {
          const owners = game.owners;
          const mappedOwners = await Promise.all(
            owners.map(async (owner) => {
              const mappedOwner = await User.findById(owner);
              if (mappedOwner.city === city) {
                return owner;
              }
            })
          );
          //retotnamos el array mappeado controlado que no sea undefined
          return mappedOwners.filter((owner) => owner !== undefined);
        })
      );
      //aplanamos el array para devolverlo
      const flattenedOwners = ownersInCity.flat();
      //Ternario para manejar si hay propietarios del título y manejar la respuesta

      return flattenedOwners.length === 0
        ? res.status(404).json({ message: 'Game not found in city' })
        : res.status(200).json(flattenedOwners);
    } else {
      // La consulta del título no se realizó correctamente
      return res.status(400).json({ message: 'Title not found in DB' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!----------------------------------------------
//?-----------GAME  BY PLAYING TIME------------
//!----------------------------------------------

const byPlayingTime = async (req, res, next) => {
  const { playingTime } = req.params;

  try {
    //PARA ENCONTRAR ELEMENTOS IGUALES O SUPERIORES A LA PUNTUACIÓN ELEGIDA, PONEMOS EL OPERADOR DE MONGO $gte
    const games = await Game.find({ playTime: playingTime });
    if (games.length>0) {
      return res.status(200).json(games);
    }
    else{ return res.status(404).json('Games not found')}
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
};

//!----------------------------------------------
//?-----------GAME  BY TYPE------------
//!----------------------------------------------

const byType = async (req, res, next) => {
  const { type } = req.query;

  try {
    let typesArray = type.split(','); // Obtener un array de strings separados por comas
    //mapeamos para tener un array con la primera letra en mayúscula
    typesArray = typesArray.map((type) => {
      //
      return type.charAt(0).toUpperCase() + type.slice(1);
    });

    const games = await Game.find({ typesList: { $in: typesArray } });

    if (games.length > 0) {
      return res.status(200).json(games);
    } else {
      return res.status(404).json({ message: 'Games not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!---------------------------------------
//?-----------UPDATE GAME--------------
//!---------------------------------------

const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si la ID del juego es válida
    const game = await Game.findById(id);
    if (!game) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }

    // Actualizar el juego con los datos proporcionados en req.body
    const updatedGame = await Game.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Verificar si se actualizó correctamente
    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    return res.status(200).json(updatedGame);
  } catch (error) {
    return next(error);
  }
};

//!-------------------------------------------
//?-----------GAME  DELETE BY ID------------
//!-------------------------------------------

const deleteGameByID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Eliminamos el juego de los usuarios antes de eliminarlo de la base de datos
    const owners = game.owners;
    //Usamos el método updatemany para que nos quite las ID del juego en los Usuarios
    await User.updateMany({ _id: { $in: owners } }, { $pull: { games: id } });

    // Eliminamos el juego de la base de datos
    const deletedGame = await Game.findByIdAndDelete(id);

    if (deletedGame) {
      return res.status(200).json({ message: 'Game removed from the DB' });
    } else {
      return res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

//!---------------------------------------
//?-----------ADD GAME TO DB---------
//!---------------------------------------

const addGameToDb = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    //Lo primero es actualizar los indexs
    await Game.syncIndexes();

    //Hacer una nueva estancia de usuario
    const newGame = new Game({ ...req.body });
    if (req.file) {
      newGame.image = req.file.path;
    } else {
      newGame.image = 'Imagen genérica';
    }
    const gameExits = await Game.findOne({
      title: newGame.title,
    });

    if (gameExits) {
      return next(setError(409, 'Game already in DB'));
    } else {
      const createGame = await newGame.save();

      //ENVIAMOS EL CORREO DE CONFIRMACIÓN

      return res.status(201).json({
        game: createGame,
      });
    }
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(
      setError(error.code || 500, error.message || 'Error creating game')
    );
  }
};

//!----------------------------------------------
//?-----------GAME  MULTI FILTER------------
//!----------------------------------------------
//Controller for multiple types of game filtering

const multIFilter = async (req, res, next) => {
  const { type, rating, players, playTime } = req.query;

  console.log(req.query);

  try {
    let typesArray = type.split(','); // Obtener un array de strings separados por comas
    //mapeamos para tener un array con la primera letra en mayúscula
    typesArray = typesArray.map((type) => {
      //
      return type.charAt(0).toUpperCase() + type.slice(1);
    });

    const games = await Game.find({
      typesList: { $in: typesArray },
      rating: { $gte: rating },
      players: players,
      playTime: playTime,
    });

    if (games.length > 0) {
      return res.status(200).json(games);
    } else {
      return res.status(404).json({ message: 'Games not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
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
  addGameToDb,
};
