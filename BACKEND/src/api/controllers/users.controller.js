const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const setError = require('../../helpers/handleError');
const { deleteImgCloudinary } = require('../../middlewares/files.middleware');
const { generateToken } = require('../../utils/token');
const randomPassword = require('../../utils/randomPassword');
const Game = require('../models/game.model');

dotenv.config();

//!---------------------------------------
//?-----------REGISTER NEW USER---------
//!---------------------------------------

const register = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    //Lo primero es actualizar los indexs
    await User.syncIndexes();
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
    const newUser = new User({ ...req.body, confirmationCode });
    if (req.file) {
      newUser.image = req.file.path;
    } else {
      newUser.image = 'Imagen genérica';
    }
    const userExits = await User.findOne({
      email: newUser.email,
      name: newUser.name,
    });

    if (userExits) {
      return next(setError(409, 'This users already exits'));
    } else {
      const createUser = await newUser.save();
      createUser.password = null;

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
          console.log(`Email sent to ${newUser}`);
        }
      });

      return res.status(201).json({
        user: createUser,
        confirmationCode: confirmationCode,
      });
    }
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(
      setError(error.code || 500, error.message || 'Error creating user')
    );
  }
};

//!---------------------------------------
//?-----------CHECK NEW USER---------
//!---------------------------------------

const checkNewUser = async (req, res, next) => {
  try {
    //Del req.body desestructuramos el email y el confirmation code para comprobar si existe
    const { email, confirmationCode } = req.body;
    const userExists = await User.findOne({ email });

    if (!userExists) {
      //Si no existe
      return res.status(404).json('User not found');
    } else {
      //Si existe, actiualizamos el usuario
      if (confirmationCode === userExists.confirmationCode) {
        //si existr, actualizamos y le metemos la propiedad true al objeto
        await userExists.updateOne({ check: true });
        //Testeamos de que se ha actualizado correctamente
        const updateUser = await User.findOne({ email });

        //testeamos con un ternario si update user es true or false

        return res
          .status(200)
          .json({ testCheckOk: updateUser.check == true ? true : false });
      } else {
        //si se equivoca con el código, lo borramos de la base de datos y lo mandamos al registro
        await User.findByIdAndDelete(userExists._id);
        //Borramos la imagen
        deleteImgCloudinary(userExists._id);

        //ahora devolvemos el objeto con un test para ver si el borrado se ha hecho bien
        return res.status(200).json({
          userExists,
          check: false,
          delet: (await User.findById(userExists._id))
            ? 'Error deleting user'
            : 'User deleted',
        });
      }
    }
  } catch (error) {
    return next(setError(500, 'General error checking code'));
  }
};

//!--------------------------------------------------
//?-----------RESEND CODE CONFIRMATION----------
//!--------------------------------------------------

const resendCode = async (req, res, next) => {
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

    //comprobamos si el usuario existe para enviar el password con findone

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      const mailOptions = {
        from: email,
        to: req.body.email,
        subjet: 'Confirmation code',
        text: `Your confirmation code is ${userExists.confirmationCode}`,
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
      return res.status(404).json('User not found');
    }
  } catch (error) {
    return next(setError(500, error.message || 'General error sending code'));
  }
};
//que solo se puedaca,biar el correo cuando se haga check
//!--------------------------------------------------
//?-----------LOGIN--------------------------------
//!--------------------------------------------------

const login = async (req, res, next) => {
  try {
    //traemos email y pass del req.body
    const { email, password } = req.body;
    //buscamos el usuario
    const user = await User.findOne({ email });
    console.log(req.body);
    //si no hay user, devolvemos un 404
    if (!user) {
      return res.status(404).json('User not found');
    } else {
      //si hay user, comparamos la contraseña recibida del req.body con la almacenada en bcrypt
      if (bcrypt.compareSync(password, user.password)) {
        //si la contraseña coincide, generamos un token con la id del user y el email
        const token = generateToken(user._id, email);
        //hacemos un return y devolvemos el token
        return res.status(200).json({ user: user, token });
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
//?-----------AUTO LOGIN--------------------------------
//!--------------------------------------------------

const autoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });
    console.log(password, email)

    if (userDB) {
      if (bcrypt.compareSync(password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json('password dont match');
      }
    } else {
      return res.status(404).json('User no register');
    }
  } catch (error) {
    return next(error);
  }
};


//!-------------------------------------------------------------------------------------
//?-----------FORGOT PASSWORD SIN ESTAR LOGEADO--------------------------------
//!-------------------------------------------------------------------------------------

const forgotPassword = async (req, res, next) => {
  try {
    //recibimos el email por el req.body
    const { email } = req.body;

    //comprobamos si existe el usuario
    const userDb = await User.findOne({ email });
    if (userDb) {
      //si el usuario existe, redirect al controlador que se encarga del envío y actualización
      return res.redirect(
        `http://localhost:8095/api/v1/users/forgotpassword/sendPassword/${userDb._id}`
      );
    } else {
      // Si el usuario no está en la base de datos, devolvemos un 404
      return res.status(404).json('User not registered');
    }
  } catch (error) {
    return next(error);
  }
};

const sendPassword = async (req, res, next) => {
  try {
    //recibimos la id por parámetros
    const { id } = req.params;
    //el id lo utilizamos para buscar el usuario en la base de datos
    const userDb = await User.findById(id);

    //Aquí configuramos el correo electrónico para enviar el password
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

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
      to: userDb.email,
      subject: '----------',
      text: `User: ${userDb.name}. Your new code login is ${passwordSecure} Hemos enviado esto porque tenemos una solicitud de cambio de contraseña, si no has sido ponte en contacto con nosotros, gracias.`,
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
        await User.findByIdAndUpdate(id, { password: newPasswordHash });
        //Testeamos si todo se ha hecho bien. Nos traemos el user actualizado y hacemos un If para las contraseñas
        const updateUser = await User.findById(id);
        if (bcrypt.compareSync(passwordSecure, updateUser.password)) {
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
};

//!-------------------------------------------------------------------------------------
//?-----------CAMBIO CONTRASEÑA-------------------------------
//!-------------------------------------------------------------------------------------

const modifyPassword = async (req, res, next) => {
  try {
    // Nos traeemos los datos del body y el token
    const { password, newPassword } = req.body;
    const { _id } = req.user;
    console.log(req.user.password);
    console.log(password);

    // Verificamos que password y newPassword sean strings
    if (typeof password !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json('Invalid password format');
    }

    // Comparamos las contraseñas con compareSync
    const isPasswordMatch = bcrypt.compareSync(password, req.user.password);
    if (isPasswordMatch) {
      const newPasswordHash = bcrypt.hashSync(newPassword, 10);

      // Buscamos el usuario por id y actualizamos la contraseña con la nueva
      await User.findByIdAndUpdate(_id, { password: newPasswordHash });

      const updateUser = await User.findById(_id);
      const isNewPasswordMatch = bcrypt.compareSync(
        newPassword,
        updateUser.password
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

//!---------------------------------------
//?-----------GET USER BY ID--------------
//!---------------------------------------
const getUserByID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userID = await User.findById(id);

    if (userID>0) {
      return res.status(200).json(userID);

    } else {
      return res.status(404).json('User not found');
     
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//!---------------------------------------
//?-----------UPDATE USER--------------
//!---------------------------------------

const updateUser = async (req, res, next) => {
  try {
    // actualizamos los indexes de los elementos unicos por si han modificado
    await User.syncIndexes();
    // Creamos un nuvo modelo de usar, en el que añadiremos los cambios y después sobreescribimos el user existente con este
    const patchUser = new User(req.body);
    // si tenemos la req.file le metemos el path de cloudinary
    if (req.file) {
      patchUser.image = req.file.path;
    }
    //Para cambiar el email, si se solicita
    if (req.body.email) {
      //comprobamos si el usuario existe para enviar el password con findone

      const userExists = await User.findOne({ email: req.user.email });

      if (userExists) {
        //Si hay email en el Req.BODY pero es el mismo, se deja igual
        if (userExists.email == req.body.email) {
          patchUser.email = req.user.email;
        } else {
          //Si el email es diferentre, comprobamos que no lo use otro usuario
          //Creo que esto no es necesario, lo gestiona mongo y no permite keys duplicadas, ya que está en unique
          const emailInUseByAnotherUser = await User.findOne({
            email: req.body.email,
          });
          //Si el email es diferente al del usuario y no lo usa otro usuario, enviamos el code
          if (!emailInUseByAnotherUser) {
            //Aplicamos la misma lógica que el send code
            const email = process.env.EMAIL;
            const password = process.env.PASSWORD;
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: email,
                pass: password,
              },
            });
            await userExists.updateOne({ check: false });
            const mailOptions = {
              from: email,
              to: req.body.email,
              subjet: 'Confirmation code',
              text: `Your confirmation code is ${userExists.confirmationCode}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                return res.status(200).json({
                  resend: true,
                });
              }
            });
          }
        }
        patchUser.email = req.body.email;
      } else {
        return res.status(404).json('User not found');
      }
    }
    // Elementos que no queremos modificar, lo dejaremos igual
    patchUser._id = req.user._id;
    patchUser.password = req.user.password;
    patchUser.role = req.user.role;
    patchUser.confirmationCode = req.user.confirmationCode;
    patchUser.check = req.user.check;

    // actualizamos en la db con el id y la instancia del modelo de user
    try {
      await User.findByIdAndUpdate(req.user._id, patchUser);
      // borrramos en cloudinary la imagen antigua
      if (req.file) {
        deleteImgCloudinary(req.user.image);
      }

      //! ----------------TEST RUNTIME
      // buscamos el usuario actualizado
      const updateUser = await User.findById(req.user._id);

      // cogemos la keys del body
      const updateKeys = Object.keys(req.body);
      console.log(updateKeys);

      // creamos una variable para  guardar los test
      const testUpdate = [];
      // recorremos las keys y comparamos, si es igual lo que recibe del body con el usuario actualizado, ok
      updateKeys.forEach((item) => {
        if (updateUser[item] == req.body[item]) {
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
        updateUser.image == req.file.path
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
//?-----------DELETE  USER--------------
//!---------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    //primero vamos a eliminar el usuario de los amigos
    const user = await User.findById(_id);
    const userFriends = user.friends;
    //Después vamos a eliminar el usuario de la lista de poseedores de un juevgo
    const userGames = user.games;
    //Usamos el método updatemany para que nos quite las ID del usuario en los amigos
    await User.updateMany(
      { _id: { $in: userFriends } },
      { $pull: { friends: _id } }
    );
//Quitamos la Id del usuario de la lista de poseedores
    await Game.updateMany(
      { _id: { $in: userGames } },
      { $pull: { owners: _id } }
    );

    await User.findByIdAndDelete(_id);
    if (await User.findById(_id)) {
      return res.status(404).json('User not deleted');
    } else {
      deleteImgCloudinary(req.user.image);
      return res.status(200).json('User deleted');
    }
  } catch (error) {
    return next(error);
  }
};

//!-------------------------------------------
//?-----------ADD FRIEND------------
//!-------------------------------------------

const addFriendToUser = async (req, res, next) => {
  //Nos traemos la id del usuario y su am imigo de los params
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    //Si no hay usuario, devolvemos error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Si no hay friend, devolvemos error
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    //Hacemos un includes para no meter amigos repetidos
    if (user.friends.includes(friend)) {
      return res.status(400).json({ message: 'Friend already added to user' });
    } else {
      //hacemos push del juego en el array del usuario y del usuario en el array owners del juego
      user.friends.push(friendId);
      friend.friends.push(userId);
      await user.save();
      await friend.save();
      return res.status(200).json({ message: 'Friend added to user' });
    }
  } catch (error) {
    console.log('Error adding friend to user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//!----------------------------------------------
//?-----------DELETE FRIEND  IN USER------------
//!----------------------------------------------

const deleteFriendInUser = async (req, res, next) => {
  const { userId, friendId } = req.params;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    if (!friend) {
      return res.status(404).json({ message: 'friend not found' });
    }
    //Hacemos un includes para no meter juegos repetidos
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Friend not found in user' });
    } else {
      // Eliminamos el juego del array games del usuario y en el array del juego eliminamos el propietario
      user.friends.splice(user.friends.indexOf(friendId), 1);
      friend.friends.splice(friend.friends.indexOf(userId), 1);
      await user.save();
      await friend.save();
      return res.status(200).json({ message: 'Friend erased in user' });
    }
  } catch (error) {
    console.log('Error erasing friend in user', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
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
};
