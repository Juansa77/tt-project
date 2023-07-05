const firstToUpperCase = (str) => {
  const arr = str.split(' ');

  //Hacemos loop en cada elemento del array y le capitalizamos ña primera

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  //Convertimos el array en una sola string con " " como separador
  const titleUpper = arr.join(' ');
  return titleUpper;
};

module.exports = firstToUpperCase