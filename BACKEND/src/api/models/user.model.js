const { Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    city: {
      type: String,
      enum: ['Sevilla', 'Madrid', 'Cádiz', 'Barcelona', 'Oviedo', 'Huelva'],
    },
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
    gender: {
      type: String,
      enum: [
        'hombre',
        'Mujer',
        'andrógína',
        'andrógino',
        'Trans femenino',
        'Trans masculino',
        'Queer',
        'Andróginx',
      ],
      required: true,
    },
    image: { type: String },
    confirmationCode: { type: Number, required: true },
    check: { type: Boolean, required: true, default: false },
    games: [{ type: mongoose.Types.ObjectId, ref: 'Game' }],
    friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

///ANTES DE GUARDAR EL MODELO TENEMOS QUE HACER UN PRESAVE PARA ENCRIPTAR LA CONTRASEÑA

UserSchema.pre('save', async function (next) {
  try {
    //Encriptamos la contraseña
    this.password = await bcrypt.hash(this.password, 10);
    //metemos el next vacío para que continue
    next();
  } catch (error) {
    next('Error hashing password', error);
  }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
