import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client-customer";
import { API, API_IMAGES } from "../../../API";
import Loading from "../../../components/Loading";
import Breadcrumb from "../../../components/customer/breadcrumb/Breadcrumb";
import { Button } from "primereact/button";

const Order = () => {
  const { tokenCustomer, user } = useStateContext();

  const navigate = useNavigate();






  const checkLogin = async () => {
    if (!tokenCustomer || !user) {
      const isConfirm = await Swal.fire({
        title: `Bạn cần phải đăng nhập để sử dụng chức năng này ?`,
        text: "Chuyển đến trang đăng nhập!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận!",
        cancelButtonText: "Huỷ bỏ!",
      }).then((result) => {
        return result.isConfirmed;
      });
      if (!isConfirm) {
        navigate("/");
      } else {
        navigate("/dangnhap");
      }
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);

  const [typeOrder, setTypeOrder] = useState("TT001");
  const orderButton = [
    {
      id: 1,
      textButton: "Chờ xác nhận",
      value: "TT001",
    },
    {
      id: 2,
      textButton: "Đã xác nhận",
      value: "TT002",
    },
    {
      id: 3,
      textButton: "Đang giao hàng",
      value: "TT003",
    },
    {
      id: 4,
      textButton: "Đã giao hàng",
      value: "TT004",
    },
    {
      id: 5,
      textButton: "Hoàn thành",
      value: "TT005",
    },
    {
      id: 6,
      textButton: "Đã huỷ",
      value: "TT006",
    },
    {
      id: 7,
      textButton: "Yêu cầu trả hàng",
      value: "TT007",
    },
  ];
  const [loading, setLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState(1);
  const handelClick = (tab) => {
    setSelectedTab(tab.id);
    setTypeOrder(tab.value);
  };
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosClient
      .get(`${API}/api/cus-order?typeOrder=${typeOrder}`)
      .then((res) => {
        setOrders(res.data);
        // console.log(res.data);
        setLoading(false);
      });
  }, [typeOrder]);
  console.log(orders);
  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Đơn đặt hàng",
    },
  ];
  return (
    <>
      <Breadcrumb ListBreadcrumb={ListBreadcrumb} />
      <div className="cs-container">
        {loading && tokenCustomer && user && <Loading />}

        <div className="flex gap-4 overflow-x-auto py-2 px-2 shadow">
          {orderButton.map((order) => (
            <div
              className={`${
                selectedTab === order.id ? "border-b-2 border-red-800" : ""
              } cursor-pointer font-semibold  py-2`}
              key={order.id}
              onClick={() => handelClick(order)}
              header={order.textButton}
            >
              <div>
                <h6 className="whitespace-nowrap">{order.textButton}</h6>{" "}
              </div>
            </div>
          ))}
        </div>
        <div className="">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div className="relative">
                {/* {order.orderStatusId === "TT004" ? (
                  <div className="absolute left-1 xl:right-1 top-1">
                    <Button
                      onClick={() => alert(order.orderStatusId)}
                      label="Giao thành công"
                      icon="pi pi-check"
                      iconPos="right"
                      size="small"
                    />
                  </div>
                ) : (
                  ""
                )} */}

                <Link
                  to={`chitietdonhang/${order.orderId}`}
                  key={order.orderId}
                  className="hover:bg-blue-100  no-underline cursor-pointer border p-2 flex items-center gap-4 mt-2 "
                >
                  {order.order_detail.length > 0 ? (
                    <>
                      <div className="min-w-[2rem] max-w-[6rem] ">
                        <img
                          className="w-full"
                          src={`${API_IMAGES}/${order.order_detail[0].product.avatar}`}
                          alt=""
                        />
                      </div>
                      <div className="w-full">
                        <h4 className="hidden lg:block text-lg text-black">
                          {order.order_detail[0].product.name}
                        </h4>
                        <h4 className="lg:hidden block text-lg">
                          {order.order_detail[0].product.name.length > 18
                            ? order.order_detail[0].product.name.substring(
                                0,
                                18
                              ) + "..."
                            : order.order_detail[0].product.name}
                        </h4>
                        <h2 className="text-lg font-semibold text-yellow-500">
                          x{order.order_detail[0].quantity}
                        </h2>

                        <div className="grid lg:grid-cols-2  grid-cols-1 gap-3">
                          <div className="flex flex-col gap-3">
                            <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                              Trọng lượng:{" "}
                              <span className="font-normal">
                                {
                                  order.order_detail[0].product.product_size[0]
                                    .weight
                                }{" "}
                                {
                                  order.order_detail[0].product.product_size[0]
                                    .unit.name
                                }
                              </span>
                            </h1>
                            <h1 className="text-xl font-bold leading-3  text-gray-600 ">
                              Loại:{" "}
                              <span className="font-normal">
                                {
                                  order.order_detail[0].product.product_type
                                    .name
                                }
                              </span>
                            </h1>
                          </div>
                          <div className="flex flex-col gap-3">
                            <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                              Kích thước:{" "}
                              <span className="font-normal">
                                {order.order_detail[0].sizeValue}{" "}
                              </span>
                            </h1>
                            <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                              Đơn giá:{" "}
                              <span className="font-normal">
                                {new Intl.NumberFormat({
                                  style: "currency",
                                  currency: "JPY",
                                }).format(order.order_detail[0].price)}
                                <span> VNĐ</span>
                              </span>
                            </h1>
                          </div>
                        </div>
                        <div>
                          <h1 className="text-left md:text-right block text-xl font-bold leading-3 text-gray-600 ">
                            Tổng:{" "}
                            <span className="font-normal text-red-800">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(order.totalAmount)}
                              <span> VNĐ</span>
                            </span>
                          </h1>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {/* <h1>{order.order_detail[0].price}</h1> */}
                </Link>
              </div>
            ))
          ) : (
            <h4 className="text-center mt-2">
              Hiện tại không có đơn hàng nào{" "}
            </h4>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
