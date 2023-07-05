const User = require('../api/models/user.model');

const dotenv = require('dotenv');
const { verifyToken } = require('../utils/token');
const Place = require('../api/models/place.model');
dotenv.config();

const isAuth = async (req, res, next) => {
  //Bearer es lo que autentifica el token, le quitamos el prefijo para que pueda ser autentificado

  const token = req.headers.authorization?.replace('Bearer ', '');

  //Si no hay token, instanciamos un nuevo error
  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    //decodificamos el token para que nos devuelva la id y el email y lo verificamos, con el método de verificación y el secret
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    //con los datos obtenidos, lo buscamos por la id
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(error);
  }
};

const isAuthPlace = async (req, res, next) => {
  //Bearer es lo que autentifica el token, le quitamos el prefijo para que pueda ser autentificado

  const token = req.headers.authorization?.replace('Bearer ', '');

  //Si no hay token, instanciamos un nuevo error
  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    //decodificamos el token para que nos devuelva la id y el email y lo verificamos, con el método de verificación y el secret
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    //con los datos obtenidos, lo buscamos por la id
    req.place = await Place.findById(decoded.id);
    next();
  } catch (error) {
    return next(error);
  }
};


//?--------------------------------------------------------------
//*---FUNCIÓN PARA VERIFICAR SI UN USUARIO ES ADMIN---------
//?--------------------------------------------------------------

const isAuthAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isAuth,
  isAuthAdmin,
  isAuthPlace
};
