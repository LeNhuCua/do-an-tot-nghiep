function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function convertNameWithoutAccents(name) {
  // Remove accents from name
  name = removeAccents(name);

  // Convert name to lower case and replace spaces with hyphens
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join("-");
}

export default convertNameWithoutAccents;

//   const originalName = 'Giày Nam';
//   const convertedName = convertNameWithoutAccents(originalName);
//   console.log(convertedName); // giay-nam
