import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
class ComponentToPrint extends React.Component {
  render() {
    // Lấy ngày hiện tại
    const now = new Date();

    // Lấy giờ, phút, giây
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Lấy ngày, tháng, năm
    const date = now.getDate();
    const month = now.getMonth() + 1; // Tháng tính từ 0, nên cần cộng thêm 1
    const year = now.getFullYear();

    // Kết hợp vào chuỗi
    const currentDate = `${date}/${month}/${year} ${hour}:${minute}:${second}`;
    console.log(this.props.invoices);
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-[90%] bg-white shadow-md p-2">
            <div className="flex justify-center">
              <div>
                <h1 className="text-lg  font-extrabold tracking-widest text-indigo-500">
                  DOANH NGHIỆP TƯ NHÂN HIỆU VÀNG KIM HUY NT
                </h1>
                <h3 className="text-sm">
                  Mã số thuế{" "}
                  <span className="font-bold">4 2 0 1 6 3 5 1 6 6</span>
                </h3>
                <h3 className="text-sm">
                  Địa chỉ{" "}
                  <span className="font-bold">
                    19 Phương Sài - Phường Phương Sơn - Nha Trang - Khánh Hoà
                  </span>
                </h3>
                <h3 className="text-sm">
                  Điện thoại <span className="font-bold">02583826952</span>
                </h3>
              </div>
            </div>
            <div className="border-t border-b">
              <div className="flex justify-center">
                <div>
                  <h1 className="text-xl font-bold uppercase">Hoá đơn bán hàng</h1>
                  <h6 className="font-bold">
                  Ngày mua:{" "}
                  <span className="text-sm font-medium"> {currentDate}</span>
                </h6>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between p-4">
              <div className="">
                <address className="text-sm">
                  <span className="font-bold">Họ tên khách hàng:  </span>
                  {this.props.name}
                </address>
              </div>
              <div className="">
                <address className="text-sm">
                  <span className="font-bold">Điện thoại: </span>
                  {this.props.phone}
                </address>
              </div>
              <div></div>
            </div>
            <div className="flex justify-center min-w-full">
              <div className="border-b border-gray-200 shadow">
                <table className="w-full min-w-full max-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-xs text-gray-500 ">#</th>
                      <th className="px-4 py-2 text-xs text-gray-500 ">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-2 text-xs text-gray-500 ">Size</th>

                      <th className="px-4 py-2 text-xs text-gray-500 ">
                        Đơn giá
                      </th>
                      <th className="px-4 py-2 text-xs text-gray-500 ">
                        Thành tiền
                      </th>

                      {/* <th className="px-4 py-2 text-xs text-gray-500 ">Subtotal</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {this.props.invoices &&
                      this.props.invoices.map((item, index) => (
                        <tr key={index} className="whitespace-nowrap">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 whitespace-pre-line">
                              {item.name} {"( x"}
                              {item.amount}
                              {")"}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {item.weight}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(item.sizePrice)}{" "}
                              đồng
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(item.sizePrice * item.amount)}{" "}
                              đồng
                            </div>
                          </td>
                        </tr>
                      ))}

                    <tr className="text-gray-800">
                      <th colSpan="3"></th>
                      <td className="text-sm font-bold">
                        <b>Tổng tiền</b>
                      </td>
                      <td className="text-sm font-bold">
                        <b>
                          {" "}
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(this.props.totalAmount)}{" "}
                          đồng
                        </b>
                      </td>
                    </tr>
                    <tr className="text-gray-800">
                      <th colSpan="3"></th>
                      <td className="text-sm font-bold">
                        <b>Tiền nhận</b>
                      </td>
                      <td className="text-sm font-bold">
                        <b>
                          {" "}
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(this.props.inputValue)}{" "}
                          đồng
                        </b>
                      </td>
                    </tr>
                    <tr className="text-gray-800">
                      <th colSpan="3"></th>
                      <td className="text-sm font-bold">
                        <b>Tiền thừa</b>
                      </td>
                      <td className="text-sm font-bold">
                        <b>
                          {" "}
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(
                            this.props.inputValue - this.props.totalAmount
                          )}{" "}
                          đồng
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="flex justify-between p-4">
              <div>
                <h3 className="text-xl">Terms And Condition :</h3>
                <ul className="text-xs list-disc list-inside">
                  <li>
                    All accounts are to be paid within 7 days from receipt of
                    invoice.
                  </li>
                  <li>
                    To be paid by cheque or credit card or direct payment
                    online.
                  </li>
                  <li>
                    If account is not paid within 7 days the credits details
                    supplied.
                  </li>
                </ul>
              </div>
              <div className="p-4">
                <h3>Signature</h3>
                <div className="text-4xl italic text-indigo-500">AAA</div>
              </div>
            </div> */}
            <div className="w-full h-0.5 bg-indigo-500 mt-4"></div>

            <div className="p-4">
              <div className="flex items-center justify-center">
                Cảm ơn và hẹn gặp lại quý khách
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="underline">Ghi chú</span>
                <span className="text-red-600"> {" "} Biên lại này có giá trị trong vòng 1 tháng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

////

///

export default ComponentToPrint;
