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

    return (
      <div>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-[90%] bg-white shadow-lg">
            <div className="flex justify-between p-1">
              <div>
                <h1 className="text-3xl italic font-extrabold tracking-widest text-indigo-500">
                  Kim Huy
                </h1>
              </div>

              <div className="p-2">
                <ul className="flex">
                  <li className="flex items-center gap-2 p-2 border-l-2 border-indigo-200">
                    <AiOutlineInfoCircle />

                    <div className="flex flex-col">
                      <span className="text-sm">Địa chỉ</span>
                      <span className="text-sm">Số điện thoại</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full h-0.5 bg-indigo-500"></div>
            <div className="grid grid-cols-2 justify-between p-4">
              <div>
                <h6 className="font-bold">
                  Ngày mua:{" "}
                  <span className="text-sm font-medium"> {currentDate}</span>
                </h6>
                {/* <h6 className="font-bold">
                  Order ID :{" "}
                  <span className="text-sm font-medium"> 12/12/2022</span>
                </h6> */}
              </div>
              <div className="w-40">
                <address className="text-sm">
                  <span className="font-bold">Khách hàng: </span>
                  {this.props.invoices.customer_address.recipientName}
                </address>
              </div>
              <div className="w-40">
                <address className="text-sm">
                  <span className="font-bold">Điện thoại: </span>
                  {this.props.invoices.customer_address.recipientPhone}
                </address>
              </div>
              <div className="w-40">
                <address className="text-sm">
                  <span className="font-bold">Địa chỉ nhận: </span>
                  {this.props.invoices.customer_address.recipientAddress}
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
                      this.props.invoices.order_detail.map((item, index) => (
                        <tr key={index} className="whitespace-nowrap">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 whitespace-pre-line">
                              {item.product.name}  {"( x"}{item.quantity}{")"} 
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {item.sizeValue}
                            </div>
                          </td>
                      
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(item.price)}{" "}
                              đồng
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(item.price * item.quantity)}{" "}
                              đồng
                            </div>
                          </td>
                        </tr>
                      ))}

                    <tr className="text-gray-800">
                      <th colSpan="3"></th>
                      <td className="text-sm font-bold">
                        <b>Tổng tiền đơn hàng</b>
                      </td>
                      <td className="text-sm font-bold">
                        <b>
                          {" "}
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(this.props.invoices.totalAmount)}{" "}
                          đồng
                        </b>
                      </td>
                    </tr>
                    <tr className="text-gray-800">
                      <th colSpan="3"></th>
                      <td className="text-sm font-bold">
                        <b>Tiền ship</b>
                      </td>
                      <td className="text-sm font-bold">
                        <b>
                          {" "}
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(this.props.invoices.shipping_fee.shippingFeeAmount)}{" "}
                          đồng
                        </b>
                      </td>
                    </tr>

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
                          }).format(
                            this.props.invoices.totalAmount - this.props.invoices.shipping_fee.shippingFeeAmount
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
