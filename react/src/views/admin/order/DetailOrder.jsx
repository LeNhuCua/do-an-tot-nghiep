import React from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Editor } from "primereact/editor";
import { Image } from "primereact/image";
import { API_IMAGES } from "../../../API";
import { Link } from "react-router-dom";

const DetailOrder = (props) => {
  const { detailFind, visible, setVisible } = props;
  console.log(detailFind);
  function formatDateTime(dateTimeString) {
    var date = new Date(dateTimeString);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Định dạng lại ngày tháng năm
    var formattedDate = `Ngày ${day}-${month}-${year}`;

    // Định dạng lại giờ phút giây
    var formattedTime = `${hours}:${minutes}:${seconds}`;

    // Kết hợp ngày tháng năm và giờ phút giây
    var formattedDateTime = formattedDate + " " + formattedTime;

    return formattedDateTime;
  }

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Chi tiết đơn hàng"
        visible={visible}
        maximizable
        className="w-[90%] h-[80vh] xl:w-2/3"
        onHide={() => setVisible(false)}
      >
        <div>
          <TabView>
            <TabPanel header="Thông tin chung" leftIcon="pi pi-calendar mr-2">
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-info-circle mr-2"></i>
                      <b>Số hoá đơn</b>
                    </div>
                  </Divider>
                  <p className="pl-16">{detailFind && detailFind.orderId}</p>
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-circle mr-2"></i>
                      <b>Tình trạng</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.order_status.name}
                  </p>
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-pencil mr-2"></i>
                      <b>Hình thức thanh toán</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.payment_method.paymentMethodName}
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-file mr-2"></i>
                      <b>Hình thức vận chuyển</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind &&
                      detailFind.shipping_method.shippingMethodName}
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-dollar mr-2"></i>
                      <b>Tổng tiền</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {" "}
                    {new Intl.NumberFormat({
                      style: "currency",
                      currency: "JPY",
                    }).format(detailFind && detailFind.totalAmount)}{" "}
                    đ
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-eraser mr-2"></i>
                      <b>Ngày đặt</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && formatDateTime(detailFind.created_at)}
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Thông tin khách hàng" rightIcon="pi pi-user ml-2">
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-info-circle mr-2"></i>
                      <b>Tên khách hàng</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.customer_address.recipientName}
                  </p>
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-circle mr-2"></i>
                      <b>Điện thoại</b>
                    </div>
                  </Divider>

                  <p className="pl-16">
                    {detailFind && detailFind.customer_address.recipientPhone}
                  </p>
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-pencil mr-2"></i>
                      <b>Địa chỉ nhận hàng</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.customer_address.recipientAddress}
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-file mr-2"></i>
                      <b>Thông tin địa chỉ</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.customer_address.ward.name}
                    {" - "}

                    {detailFind && detailFind.customer_address.district.name}
                    {" - "}
                    {detailFind && detailFind.customer_address.province.name}
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-dollar mr-2"></i>
                      <b>Tổng tiền</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {" "}
                    {new Intl.NumberFormat({
                      style: "currency",
                      currency: "JPY",
                    }).format(detailFind && detailFind.totalAmount)}{" "}
                    đ
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-eraser mr-2"></i>
                      <b>Ngày đặt</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && formatDateTime(detailFind.created_at)}
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Sản phẩm đặt" rightIcon="pi pi-book ml-2">
              <div>
                {detailFind.order_detail.map((order) => (
                  <div
                    to={`/sanpham/${order.product.alias}`}
                    key={order.orderDetailId}
                    className="hover:bg-blue-100  no-underline cursor-pointer border p-2 flex-col md:flex-row items-center gap-4 mt-2"
                  >
                    {/* <h1>{order.price}</h1> */}
                    <div className="min-w-[2rem] max-w-[6rem]">
                      <img
                        className="w-full"
                        src={`${API_IMAGES}/${order.product.avatar}`}
                        alt=""
                      />
                    </div>
                    <div className="w-full">
                      <h4 className="hidden lg:block text-lg text-black">
                        {order.product.name}
                      </h4>
                      <h4 className="lg:hidden block text-lg">
                        {order.product.name.length > 18
                          ? order.product.name.substring(0, 18) + "..."
                          : order.product.name}
                      </h4>
                      <h2 className="text-lg font-semibold text-yellow-500">
                        x{order.quantity}
                      </h2>
                      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
                        <div className="flex flex-col gap-3">
                          <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                            Trọng lượng:{" "}
                            <span className="font-normal">
                              {order.product.weight} {order.product.unit.name}
                            </span>
                          </h1>
                          <h1 className="text-xl font-bold leading-3  text-gray-600 ">
                            Loại:{" "}
                            <span className="font-normal">
                              {order.product.product_type.name}
                            </span>
                          </h1>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                            Kích thước:{" "}
                            <span className="font-normal">
                              {order.sizeValue}{" "}
                            </span>
                          </h1>
                          <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                            Đơn giá:{" "}
                            <span className="font-normal">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(order.price)}
                              <span> VNĐ</span>
                            </span>
                          </h1>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                          Tổng:{" "}
                          <span className="font-normal text-red-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(order.price * order.quantity)}
                            <span> VNĐ</span>
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          </TabView>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailOrder;
