const cities = [
  'sevilla',
  'madrid',
  'cádiz',
  'barcelona',
  'oviedo',
  'huelva',
];

const cityValidation = (city) => {
  const cityToCheck =city.toLowerCase()

  const result = cities.includes(cityToCheck);
  return result;
};

module.exports = cityValidation;
