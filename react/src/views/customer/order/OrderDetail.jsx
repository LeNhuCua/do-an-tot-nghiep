import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client-customer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API, API_IMAGES } from "../../../API";
import Loading from "../../../components/Loading";
import { Button } from "primereact/button";
import Swal from "sweetalert2";

const OrderDetail = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDetailOrder = async () => {
      try {
        const { data } = await axiosClient.get(
          `${API}/api/cus-order/show?orderId=${id}`
        );
        setLoading(false);
        setOrders(data.orderDetail);
        console.log(data.orderDetail);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetailOrder();
  }, [id]);

  const navigate = useNavigate();
  const orderCancer = async (id) => {
    const isConfirm = await Swal.fire({
      title: `Bạn có chắc muốn huỷ đơn hàng?`,
      // text: "You won't be able to revert this!",
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
      return;
    }
    await axiosClient
      .put(`${API}/api/cus-order/orderCancel?orderId=${id}`)
      .then(({ data }) => {
        if (data.status === 200) {
          navigate("/dondathang");
          Swal.fire({
            icon: "success",
            title: "Đơn hàng đã được huỷ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(() => {});
  };

  return (
    <div className="cs-container">
      {loading && <Loading />}

      <div>
        {orders.map((order) => (
          <Link
            to={`/sanpham/${order.product.alias}`}
            key={order.orderDetailId}
            className="hover:bg-blue-100  no-underline cursor-pointer border p-2 flex items-center gap-4 mt-2"
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
                    <span className="font-normal">{order.sizeValue} </span>
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
          </Link>
        ))}
      </div>
      <div className="mt-2">
        <div className="w-full">
          <Button
            className="youtube p-0 w-full justify-center"
            onClick={() => orderCancer(id)}
          >
            <i className="pi pi-times"></i>
            <span className="p-3">Huỷ đơn hàng</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
