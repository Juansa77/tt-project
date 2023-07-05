
const Place = require('../models/place.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const setError = require('../../helpers/handleError');
const { deleteImgCloudinary } = require('../../middlewares/files.middleware');
const { generateToken } = require('../../utils/token');
const randomPassword = require('../../utils/randomPassword');
const Game = require('../models/game.model');
const cityValidation = require('../../utils/cityValidation');


dotenv.config();

//!---------------------------------------
//?-----------REGISTER NEW PLACE---------
//!---------------------------------------

const registerPlace = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    //Lo primero es actualizar los indexs
    await Place.syncIndexes();
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    //Configuramos nodeMail para que envíe el código
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    //Creamos el código que enviará nodemail

    const confirmationCode = Math.floor(
      Math.random() * (999999 - 100000) + 100000
    );

    //Hacer una nueva estancia de usuario
    const newPlace = new Place({ ...req.body, confirmationCode });
    if (req.file) {
      newPlace.image = req.file.path;
    } else {
      newPlace.image = 'Imagen genérica';
    }
    const placeExits = await Place.findOne({
      email: newPlace.email,
      name: newPlace.name,
    });

    if (placeExits) {
      return next(setError(409, 'This place already exists'));
    } else {
      const createPlace = await newPlace.save();
      createPlace.password = null;

      //ENVIAMOS EL CORREO DE CONFIRMACIÓN

      const mailOptions = {
        from: email,
        to: req.body.email,
        subject: 'Confirmation code',
        text: `Here is your confirmation code: ${confirmationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to ${newPlace}`);
        }
      });

      return res.status(201).json({
        user: createPlace,
        confirmationCode: confirmationCode,
      });
    }
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(
      setError(error.code || 500, error.message || 'Error creating place')
    );
  }
};

//!---------------------------------------
//?-----------CHECK NEW PLACE---------
//!---------------------------------------

const checkNewPlace = async (req, res, next) => {
  try {
    //Del req.body desestructuramos el email y el confirmation code para comprobar si existe
    const { email, confirmationCode } = req.body;
    const placeExists = await Place.findOne({ email });

    if (!placeExists) {
      //Si no existe
      return res.status(404).json('Place not found');
    } else {
      //Si existe, actiualizamos el usuario
      if (confirmationCode === placeExists.confirmationCode) {
        //si existr, actualizamos y le metemos la propiedad true al objeto
        await placeExists.updateOne({ check: true });
        //Testeamos de que se ha actualizado correctamente
        const updatePlace = await Place.findOne({ email });

        //testeamos con un ternario si update user es true or false

        return res
          .status(200)
          .json({ testCheckOk: updatePlace.check == true ? true : false });
      } else {
        //si se equivoca con el código, lo borramos de la base de datos y lo mandamos al registro
        await Place.findByIdAndDelete(placeExists._id);
        //Borramos la imagen
        deleteImgCloudinary(placeExists._id);

        //ahora devolvemos el objeto con un test para ver si el borrado se ha hecho bien
        return res.status(200).json({
          placeExists,
          check: false,
          delet: (await Place.findById(placeExists._id))
            ? 'Error deleting place'
            : 'User deleted',
        });
      }
    }
  } catch (error) {
    return next(setError(500, 'General error checking code'));
  }
};

//!--------------------------------------------------
//?-----------LOGIN PLACE--------------------------------
//!--------------------------------------------------

const loginPlace = async (req, res, next) => {
  try {
    //traemos email y pass del req.body
    const { email, password } = req.body;
    //buscamos el usuario
    const place = await Place.findOne({ email });

    //si no hay user, devolvemos un 404
    if (!place) {
      return res.status(404).json('Place not found');
    } else {
      //si hay user, comparamos la contraseña recibida del req.body con la almacenada en bcrypt
      if (bcrypt.compareSync(password, place.password)) {
        //si la contraseña coincide, generamos un token con la id del user y el email
        const token = generateToken(place._id, email);
        //hacemos un return y devolvemos el token
        return res.status(200).json({ place: { email, _id: place._id }, token });
      } else {
        //si la contraseña no es correcta enviamos un 404 con invalid password
        return res.status(404).json('Invalid password');
      }
    }
  } catch (error) {
    return next(
      setError(500 || error.code, 'Login general error' || error.message)
    );
  }
};

//!--------------------------------------------------
//?-----------RESEND CODE CONFIRMATION----------
//!--------------------------------------------------

const resendPlaceCode = async (req, res, next) => {
  try {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    //comprobamos si el Place existe para enviar el password con findone

    const placeExists = await Place.findOne({ email: req.body.email });

    if (placeExists) {
      const mailOptions = {
        from: email,
        to: req.body.email,
        subjet: 'Confirmation code',
        text: `Your confirmation code is ${placeExists.confirmationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to` + info.response);
          return res.status(200).json({
            resend: true,
          });
        }
      });
    } else {
      return res.status(404).json('Place not found');
    }
  } catch (error) {
    return next(setError(500, error.message || 'General error sending code'));
  }
};

//!-------------------------------------------------------------------------------------
//?-----------FORGOT PASSWORD PLACES--------------------------------
//!-------------------------------------------------------------------------------------


const forgotPlacePassword = async (req, res, next) => {
  try {
    //recibimos el email por el req.body
    const { email } = req.body;

    //comprobamos si existe el usuario
    const placeDb = await Place.findOne({ email });
    if (placeDb) {
      //si el usuario existe, redirect al controlador que se encarga del envío y actualización
      return res.redirect(
        `/api/v1/places/forgotpassword/sendpassword/${placeDb._id}`
      );
    } else {
      // Si el usuario no está en la base de datos, devolvemos un 404
      return res.status(404).json('Place not registered');
    }
  } catch (error) {
    return next(error);
  }
};

const sendPlacePassword = async (req, res, next) => {
  console.log('sendPlacePassword middleware executed');
  try {
    //recibimos la id por parámetros
    const { id } = req.params;
    console.log(req.params);
    //el id lo utilizamos para buscar el usuario en la base de datos
    const placeDb = await Place.findById(id);

    //Aquí configuramos el correo electrónico para enviar el password
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    if (!placeDb) {
      return res.status(404).json('Place not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
    let passwordSecure = randomPassword();
    const mailOptions = {
      from: email,
      to: placeDb.email,
      subject: '----------',
      text: `User: ${placeDb.name}. Your new code login is ${passwordSecure} Hemos enviado esto porque tenemos una solicitud de cambio de contraseña, si no has sido ponte en contacto con nosotros, gracias.`,
    };

    //enviamos el correo y en el envío gestionamos el envío de la contraseña

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);

        //si no se envía el correo retornamos un 404 y le decimos que no se ha hecho nada
        return res.status(404).json('Email dont sent, User not updated');
      } else {
        //encriptamos la contraseña que hemos generado arriba
        const newPasswordHash = bcrypt.hashSync(passwordSecure, 10);
        //Guardamos la contraseña en el backend
        await Place.findByIdAndUpdate(id, { password: newPasswordHash });
        //Testeamos si todo se ha hecho bien. Nos traemos el user actualizado y hacemos un If para las contraseñas
        const updatePlace = await Place.findById(id);
        if (bcrypt.compareSync(passwordSecure, updatePlace.password)) {
          //Si la contraseña hace math, mandamos 200
          return res.status(200).json({
            updateUser: false,
            sendPassword: true,
          });
        }
      }
    });
  } catch (error) {
    return next(error);
  }
}

  //!-------------------------------------------------------------------------------------
  //?-----------CAMBIO CONTRASEÑA--------------------------------
  //!-------------------------------------------------------------------------------------

  const modifyPlacePassword = async (req, res, next) => {
    try {
    

      // Nos traemos password y newPassword del req.body
      const { password, newPassword } = req.body;
      console.log(req.body)
      const { _id } = req.place;
   
      // Verificamos que password y newPassword sean cadenas de texto válidas
      if (typeof password !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json('Invalid password format');
      }

      // Comparamos las contraseñas, si es correcta, creamos la nueva contraseña y la hasheamos
      const isPasswordMatch = bcrypt.compareSync(password, req.place.password);
      if (isPasswordMatch) {
        const newPasswordHash = bcrypt.hashSync(newPassword, 10);

        // Buscamos el usuario por id y actualizamos la contraseña con la nueva
        await Place.findByIdAndUpdate(_id, { password: newPasswordHash });

        const updatePlace = await Place.findById(_id);
        const isNewPasswordMatch = bcrypt.compareSync(
          newPassword,
          updatePlace.password
        );
        if (isNewPasswordMatch) {
          return res.status(200).json({
            updateUser: true,
          });
        } else {
          return res.status(404).json({
            updateUser: false,
          });
        }
      } else {
        return res.status(404).json('Password not matching');
      }
    } catch (error) {
      return next(error);
    }
  };
;

//!-------------------------------------------
//?-----------ADD GAME  TO CATALOG------------
//!-------------------------------------------

const addGameToCatalog = async (req, res, next) => {
  const { placeId, gameId } = req.params;

  try {
    //Lo primero es actualizar los indexs
    await Game.syncIndexes();
    const place = await Place.findById(placeId);
    const game = await Game.findById(gameId);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (place.catalog.includes(gameId)) {
      return res.status(400).json({ message: 'Game already added to place' });
    } else {
      place.catalog.push(gameId);
      game.avaliable.push(placeId);

      await place.save();
      await game.save();

      // Utilizamos la función populate para obtener la información completa del usuario y el juego
      const populatedPlace = await place.populate('catalog');
      const populatedGame = await game.populate('avaliable');

      return res.status(200).json({
        message: 'Game added to PLACE',
        place: populatedPlace,
        game: populatedGame,
      });
    }
  } catch (error) {
    console.log('Error adding game to user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!----------------------------------------------
//?-----------DELETE GAME  IN CATALOG------------
//!----------------------------------------------

const deleteGameInCatalog = async (req, res, next) => {
  const { placeId, gameId } = req.params;
  const game = await Game.findById(gameId);

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    //Hacemos un includes para no meter juegos repetidos
    if (!place.catalog.includes(gameId)) {
      return res.status(400).json({ message: 'Game not found in Place' });
    } else {
      // Eliminamos el juego del array games del usuario y en el array del juego eliminamos el propietario
      place.catalog.splice(place.catalog.indexOf(gameId), 1);
      game.avaliable.splice(game.avaliable.indexOf(placeId), 1);
      await place.save();
      await game.save();
      return res.status(200).json({ message: 'Game erased in place' });
    }
  } catch (error) {
    console.log('Error erasing game in place', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//!----------------------------------------------------
//?-----------GAME IN CATALOG BY CITY------------
//!----------------------------------------------------
const gameInCatalogByCity = async (req, res, next) => {
  const { title, city } = req.params;
  //Utilizamos la función para verificar si la ciudad es válida antes de hacer nada
  const cityIsValid =  cityValidation(city);

  if (cityIsValid === false) {
    return res.status(404).json('City is not valid');
  }
  try {
    //Obtenemos el juego
    const games = await Game.find({ title: title });

    if (games.length > 0) {
      //Usamos un Promise all para poder usar el await y manejar la asincronía
      const ownersInCity = await Promise.all(
        games.flatMap(async (game) => {
          //Sacamos todos los places que tienen el juego
          const places = game.avaliable;
          //mapeamos para ver cual de ellos lo tienen y lo devolvemos en el return
          const mappedPlaces = await Promise.all(
            places.map(async (place) => {
              //sacamos todos los places y solo devolvemos en return los que conincida con la ciudad
              const mappedPlace = await Place.findById(place);
              if (mappedPlace.city.toLowerCase() === city.toLowerCase()) {
                return place;
              }
            })
          );
          //retotnamos el array mappeado controlado que no sea undefined
          return mappedPlaces.filter((owner) => owner !== undefined);
        })
      );
      //aplanamos el array para devolverlo
      const flattenedPlaces = ownersInCity.flat();
      //Ternario para manejar si hay propietarios del título y manejar la respuesta

      return flattenedPlaces.length === 0
        ? res.status(404).json({ message: 'Game not found in city' })
        : res.status(200).json(flattenedPlaces);
    } else {
      // La consulta del título no se realizó correctamente
      return res.status(400).json({ message: 'Title not found in DB' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//!---------------------------------------
//?-----------UPDATE PLACE--------------
//!---------------------------------------

const updatePlace = async (req, res, next) => {
  
  try {
    // actualizamos los indexes de los elementos unicos por si han modificado
    await Place.syncIndexes();
    // Creamos un nuvo user
    const patchPlace = new Place(req.body);
    // si tenemos la req.file le metemos el path de cloudinary
    if (req.file) {
      patchPlace.image = req.file.path;
    }
    // Elementos que no queremos modificar
    patchPlace._id = req.place._id;
    patchPlace.password = req.place.password;
    patchPlace.confirmationCode = req.place.confirmationCode;
    patchPlace.email = req.place.email;

    // actualizamos en la db con el id y la instancia del modelo de user
    try {
      await Place.findByIdAndUpdate(req.place._id, patchPlace);
      // borrramos en cloudinary la imagen antigua
      if (req.file) {
        deleteImgCloudinary(req.place.image);
      }

      //! ----------------TEST RUNTIME 
      // buscamos el usuario actualizado
      const updatePlace = await Place.findById(req.place._id);

      // cogemos la keys del body
      const updateKeys = Object.keys(req.body);
      console.log(updateKeys)

      // creamos una variable para  guardar los test
      const testUpdate = [];
      // recorremos las keys y comparamos para ver si son iguales o se han modificado
      updateKeys.forEach((item) => {
        if (updatePlace[item] == req.body[item]) {
          testUpdate.push({
            [item]: true,
          });
        } else {
          testUpdate.push({
            [item]: false,
          });
        }
      });

      if (req.file) {
        updatePlace.image == req.file.path
          ? testUpdate.push({
              file: true,
            })
          : testUpdate.push({
              file: false,
            });
      }
      return res.status(200).json({
        testUpdate,
      });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//!---------------------------------------
//?-----------DELETE  PLACE--------------
//!---------------------------------------

const deletePlace = async (req, res, next) => {
  try {
    const { _id } = req.place;
    //primero vamos a eliminar el PLACE de los juegos
    const place = await Place.findById(_id);
    //obtenemos todas las ID de juegos que tienen en el catalogo
    const placeCatalog = place.catalog;
    //Usamos el método updatemany para que nos quite las ID del place en los juegos
    await Game.updateMany(
      { _id: { $in: placeCatalog } },
      { $pull: { avaliable: _id } }
    );
    await Place.findByIdAndDelete(_id);
    if (await Place.findById(_id)) {
      return res.status(404).json('Place not deleted');
    } else {
      deleteImgCloudinary(req.place.image);
      return res.status(200).json('Place deleted');
    }
  } catch (error) {
    return next(error);
  }
};




module.exports = {
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
 deletePlace,
};
