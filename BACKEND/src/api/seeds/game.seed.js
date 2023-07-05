const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//!-------------------------------------------------------------------------------------
//?-----------IMPORTAMOS EL MODELO DE GAME---------------------------------------
//!-------------------------------------------------------------------------------------

const Game = require('../models/game.model');
const MONGO_URI = process.env.MONGO_URI;

//!-------------------------------------------------------------------------------------
//?-----------IMPORTAMOS LOS DATOS QUE QUEREMOS INYECTAR-----------------------
//!-------------------------------------------------------------------------------------

const gameDataSet = require('./bggCompletelScrap_01.json');

//!-----------------------------------------------------------------------------------------------------------
//?-----------MAPEAMOS EL DATA SET Y CREAMOS UN MODELO DE GAME CON CADA DATA-----------------------
//!-----------------------------------------------------------------------------------------------------------

const gamesData = gameDataSet.map((game) => new Game(game));

//!-----------------------------------------------------------------------------------
//?-----------NOS CONECTAMOS A LA MONGODB PARA INYECTAR-----------------------
//!-----------------------------------------------------------------------------------

const seedGrownGame = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      //Indicamos para que busque si hay juegos en nuestra db
      const Allgames = await Game.find();
      //Si hay, los elimina, para que tenga la última versión completa
      if (Allgames.length) {
        await Game.collection.drop(console.log('Game collection erased in DB'));
      }
    })
    .catch((error) => console.log('Error deleting the DB', error))
    .then(async () => {
      //Insertamos los modelos en la db
      await Game.insertMany(gamesData);
      console.log('Created Game collection');
    })
    .catch((error) => {
      console.log('Error creating collection');
    })
    .finally(() => mongoose.disconnect());
};

module.exports = seedGrownGame;
