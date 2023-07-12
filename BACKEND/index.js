const express = require('express');
const dotenv = require('dotenv');
const connect = require('./src/utils/db');
const { configCloudinary } = require('./src/middlewares/files.middleware');

dotenv.config();

//nos traemos el port al que vamos a conectar el servidor
const PORT = process.env.PORT;
configCloudinary();
const app = express();
connect();

//!---------------------------------------
//?-----------CORS CONFIG--------------
//!---------------------------------------

const cors = require('cors');

app.use(cors());

app.use((req, res, next) => {
  //Ponemos asterisco para deshabiliar el control origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  /// LAS ACCIONES QUE PERMITIMOS EN NUESTRA API
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

//!-----------------------------------------
//?-----------SERVER CONFIG--------------
//!-----------------------------------------

//Indicamos que vamos a usar JSON y el límite de data
app.use(express.json({ limit: '5mb' }));
//ponemos urlencoded a true àra los POST  y los PUT porque enviamos data que queremos los almacene el servidor (esto no es necesario si solo vamos a tener get o delete)
app.use(express.urlencoded({ limit: '5mb', extended: false }));

//------------indicamos las rutas

const UserRoutes = require('./src/api/routes/user.routes');
const GamesRoutes = require('./src/api/routes/game.routes');
const PlacesRoutes = require('./src/api/routes/place.routes');


//Indicamos que app use las controladores de usuario definidos en user.routes
app.use('/api/v1/users', UserRoutes);

//Indicamos que app use las controladores de usuario definidos en games.routes

app.use('/api/v1/games', GamesRoutes);


//Indicamos que app use las controladores de usuario definidos en games.routes

app.use('/api/v1/places', PlacesRoutes);


//definimos la respuesta para ruta desconocida
app.use('*', (req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

//iniciamos el servidor en el puerto definido

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
