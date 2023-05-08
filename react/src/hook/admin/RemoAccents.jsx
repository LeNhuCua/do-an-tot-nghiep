function removeAccents(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
  
  export default removeAccents;
  
  //   const originalName = 'Giày Nam';
  //   const convertedName = convertNameWithoutAccents(originalName);
  //   console.log(convertedName); // giay-nam
  