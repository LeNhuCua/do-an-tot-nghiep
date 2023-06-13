const FormatDate = (date) => {
  const dateTime = new Date(date);
  const year = dateTime.getFullYear();
  // Lấy tháng, nếu là tháng 1-9 thì thêm số 0 ở đầu
  const month =
    dateTime.getMonth() + 1 < 10
      ? "0" + (dateTime.getMonth() + 1)
      : dateTime.getMonth() + 1;
  // Lấy ngày, nếu là ngày 1-9 thì thêm số 0 ở đầu
  const day =
    dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();
  return `Ngày ${day}/${month}/${year}`;
};
export default FormatDate;
