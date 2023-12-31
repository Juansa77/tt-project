/* eslint-disable no-undef */
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();

//Creamos el almacen
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'userAuthDB',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
  },
});

//Creamos la función de subir imagenes
const upload = multer({ storage });

//Función de borrado de imagenes
const deleteImgCloudinary = (imgUrl) => {
  console.log("entra en delete image")
  const imgSplited = imgUrl.split('/');
  console.log("primer split")
  const nameSplited = imgSplited[imgSplited.length - 1].split('.');
  const folderSplited = imgSplited[imgSplited.length - 2];
  const public_id = `${folderSplited}/${nameSplited[0]}`;

  cloudinary.uploader.destroy(public_id, () => {
    console.log('Image delete in cloudinary');
  });
};




const configCloudinary = () => {
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_SECRET);
console.log(process.env.CLOUDINARY_API_KEY);

  try {
    
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
  } catch (error) {
    console.log(error.message)
  }
  
};

module.exports = { upload, deleteImgCloudinary, configCloudinary };