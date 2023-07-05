const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();

/** CREAMOS EL ALMACÉN PARA GUARDAR LAS IMÁGENES EN CLOUDINARY */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'userAuthDB',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
  },
});

//Creamos la función para subir las imágenes

const upload = multer({ storage });

//Función para borrar las imágenes

const deleteImgCloudinary = (imageUrl) => {
  if (!imageUrl) {
    console.log('Image URL is undefined');
    return;
  }

  const imgSplited = imageUrl.split('/');
  const nameSplited = imgSplited[imgSplited.length - 1].split('.');
  const folderSplited = imgSplited[imgSplited.length - 2];
  const public_id = `${folderSplited}/${nameSplited[0]}`;

  cloudinary.uploader.destroy(public_id, () => {
    console.log('Image deleted in Cloudinary');
  });
};

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
};

module.exports = { upload, deleteImgCloudinary, configCloudinary };
