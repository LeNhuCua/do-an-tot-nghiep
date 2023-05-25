function IsName(str) {
    // Tách chuỗi theo khoảng trắng và kiểm tra số lượng từ
    const words = str.trim().split(/\s+/);
    if (words.length < 2) return false;

    // Kiểm tra từng từ xem có kí tự đặc biệt hay số không
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ']+$/; // Chuỗi chỉ cho phép kí tự chữ và dấu ngoặc đơn
    for (const word of words) {
      if (!regex.test(word)) {
        return false;
      }
    }
    return true;
  }
  export default IsName;
