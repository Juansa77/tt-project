const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const GameSchema = new Schema(
  {
    title: { type: String, required: true },
    rating: { type: Number, required: false },
    gameRank: { type: Number, required: false },
    image: { type: String, required: false },
    year: { type: String, required: false },
    players: { type: String, required: true },
    playTime: { type: String, required: true },
    age: { type: String, required: true },
    weight: { type: String, required: false },
    typesList: [{ type: String, required: false }],
    owners: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    avaliable: [{ type: mongoose.Types.ObjectId, ref: 'Place' }],
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
