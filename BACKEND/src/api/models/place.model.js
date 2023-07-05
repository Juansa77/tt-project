const { Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const PlaceSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    city: {
      type: String,
      enum: ['Sevilla', 'Madrid', 'Cádiz', 'Barcelona', 'Oviedo', 'Huelva'],
      required: true,
    },
    type: { type: String, enum: ['shop', 'bar', 'local'], required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Email not valid'],
    },
    password: {
      type: String,
      required: true,
      validate: [validator.isStrongPassword],
      minlength: [8, 'Min 8 characters'],
    },
    direction: {
      type: String,
      required: true,
      unique: true
    },
    url: { type: String, required: false, unique: true },
    instagram: { type: String, required: false, unique: true },
    twitter: { type: String, required: false, unique: true },
    phone: { type: String, required: false, unique: true },
    googleMapsUrl: { type: String, required: true, unique: true },
    description: {
      type: String,
      required: true,
    },
    schedule: { type: String, required: true },
   
    image: { type: String },
    confirmationCode: { type: Number, required: true },
    check: { type: Boolean, required: true, default: false },
    catalog: [{ type: mongoose.Types.ObjectId, ref: 'Game' }],
    friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

///ANTES DE GUARDAR EL MODELO TENEMOS QUE HACER UN PRESAVE PARA ENCRIPTAR LA CONTRASEÑA

PlaceSchema.pre('save', async function (next) {
  try {
    //Encriptamos la contraseña
    this.password = await bcrypt.hash(this.password, 10);
    //metemos el next vacío para que continue
    next();
  } catch (error) {
    next('Error hashing password', error);
  }
});
const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
