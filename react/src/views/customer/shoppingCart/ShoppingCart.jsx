import React, { useEffect, useState } from "react";
import UseTitle from "../../../hook/UseTitle";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client-customer";
import { BiArrowBack } from "react-icons/bi";
import { InputNumber } from "primereact/inputnumber";
import { API, API_IMAGES } from "../../../API";
import Loading from "../../../components/Loading";
import cartEmpty from "../../../assets/images/empty-cart.png";
import Swal from "sweetalert2";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
const ShoppingCart = () => {
  UseTitle("Giỏ hàng");
  const { tokenCustomer, user } = useStateContext();
  const [numberBuy, setNumberBuy] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  if (!tokenCustomer || !user) {
    // return <Navigate to="/quantri/dangnhap" />;
    const isConfirm = Swal.fire({
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
      return;
    }
    navigate("/dangnhap");
  }
  const [carts, setCarts] = useState([]);
  useEffect(() => {
    axiosClient.get("/cart").then((res) => {
      setCarts(res.data);
      setLoading(false);
      console.log(res.data);
    });
  }, []);
  const removeFromCart = async (cartId) => {
    const newCart = carts.filter((cart) => {
      return cart.cartId !== cartId;
    });
    setCarts(newCart);
    removeCart(cartId);
  };

  const deleteCart = async (cartId) => {
    const cartItem = carts.find((item) => {
      return item.cartId === cartId;
    });
    const isConfirm = await Swal.fire({
      title: `Xoá ${cartItem.product.name} khỏi giỏ hàng ?`,

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
    removeFromCart(cartId);
  };

  const incrementQuantity = (cartId) => {
    const newCart = carts.map((cart) =>
      cartId === cart.cartId ? { ...cart, quantity: cart.quantity + 1 } : cart
    );
    setCarts(newCart);
    updateQuantity(cartId, "inc");
  };

  const decrementQuantity = async (cartId) => {
    const cartItem = carts.find((item) => {
      return item.cartId === cartId;
    });

    if (cartItem.quantity >= 2) {
      const newCart = carts.map((cart) =>
        cartId === cart.cartId ? { ...cart, quantity: cart.quantity - 1 } : cart
      );
      setCarts(newCart);
    } else if (cartItem.quantity < 2) {
      const isConfirm = await Swal.fire({
        title: `Xoá ${cartItem.product.name} khỏi giỏ hàng ?`,

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
      removeFromCart(cartId);
    }
    updateQuantity(cartId, "dec");
  };

  const updateQuantity = (cartId, scope) => {
    axiosClient.put(`${API}/api/cart/${cartId}/${scope}`).then((res) => {
      if (res.data.status === 200) {
      }
    });
  };
  const removeCart = (cartId) => {
    axiosClient.delete(`${API}/api/cart/${cartId}`).then((res) => {
      if (res.data.status === 200) {
      }
    });
  };
  return (
    <div>
      {loading && tokenCustomer && <Loading />}
      {!loading && (
        <div
          className=" w-full  bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden  "
          id="chec-div"
        >
          <div
            className="w-full  z-10  h-full overflow-x-hidden transform translate-x-0 transition ease-in-out duration-700"
            id="checkout"
          >
            <div className="flex lg:flex-row flex-col justify-center" id="cart">
              <div
                className="lg:w-2/3 w-full lg:pl-10 pl-4 pr-10 lg:pr-4 lg:py-12 py-8 bg-white overflow-y-auto overflow-x-hidden h-screen"
                id="scroll"
              >
                <button
                  className="flex items-center text-gray-500  hover:text-gray-600 cursor-pointer"
                  onClick={() => alert("fsf")}
                >
                  <BiArrowBack />
                  <div className="text-xl py-2  pl-2 leading-none">
                    Quay lại
                  </div>
                </button>
                {/* <p className="text-4xl font-black leading-10 text-gray-800 pt-3">
                    Giỏ hàng
                  </p> */}
                <div>
                  {carts.length > 0 && !loading ? (
                    carts.map((cart) => (
                      <div
                        key={cart.cartId}
                        className="lg:flex items-center gap-4 mt-2  border-t border-gray-300"
                      >
                        <div className="w-2/4 lg:w-1/5">
                          <img
                            src={`${API_IMAGES}/${cart.product.avatar}`}
                            alt={cart.product.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <div className="lg:pl-3 lg:w-3/4">
                          <p className="text-xl leading-3 text-gray-800 lg:pt-0 pt-4">
                            {cart.product.productId}
                          </p>
                          <div className="flex items-center justify-between w-full pt-1">
                            <p className="text-2xl font-black leading-none text-gray-800">
                              {cart.product.name}
                            </p>
                            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                              <button
                                className="btn btn-link px-2"
                                onClick={() => decrementQuantity(cart.cartId)}
                              >
                                <AiOutlineMinus />
                              </button>
                              <h3>{cart.quantity}</h3>
                              {/* <input
                                id="form1"
                                min="0"
                                name="quantity"
                                value={cart.quantity}
                                type="number"
                                className="form-control form-control-sm"
                              /> */}

                              <button
                                className="btn btn-link px-2"
                                onClick={() => incrementQuantity(cart.cartId)}
                              >
                                <AiOutlinePlus />
                              </button>
                            </div>
                          </div>
                          <p className="text-xl leading-3 text-gray-600 pt-2">
                            Trọng lượng: {cart.product.weight}{" "}
                            {cart.product.unit.name}
                          </p>
                          <p className="text-xl leading-3 text-gray-600 py-4">
                            Loại: {cart.product.product_type.name}
                          </p>
                          <p className="text-xl leading-3 text-gray-600 ">
                            Đơn giá: {cart.price}
                          </p>
                          <p className="text-xl leading-3 text-gray-600 py-4">
                            Kích thước: {cart.size.sizeValue}
                          </p>
                          <div className="flex items-center justify-between pt-5 pr-6">
                            <div
                              className="flex itemms-center"
                              onClick={() => deleteCart(cart.cartId)}
                            >
                              <p className="text-xl leading-3 underline text-red-500 pl-5 cursor-pointer">
                                Xoá
                              </p>
                            </div>
                            <p className="text-xl font-black leading-none text-gray-800">
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(cart.price * cart.quantity)}
                              <span> VNĐ</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <img src={cartEmpty} alt="" />
                    </div>
                  )}
                </div>
              </div>
              <div className="xl:w-1/2 lg:w-1/3 xl:w-1/4 w-full bg-gray-100 h-full">
                <div className="flex flex-col lg:h-screen px-14 py-20 justify-between overflow-y-auto">
                  <div>
                    <p className="text-4xl font-black leading-9 text-gray-800">
                      Summary
                    </p>
                    <div className="flex items-center justify-between pt-16">
                      <p className="text-base leading-none text-gray-800">
                        Subtotal
                      </p>
                      <p className="text-base leading-none text-gray-800">
                        $9,000
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-5">
                      <p className="text-base leading-none text-gray-800">
                        Shipping
                      </p>
                      <p className="text-base leading-none text-gray-800">
                        $30
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-5">
                      <p className="text-base leading-none text-gray-800">
                        Tax
                      </p>
                      <p className="text-base leading-none text-gray-800">
                        $35
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center pb-6 justify-between lg:pt-5 pt-20">
                      <p className="text-2xl leading-normal text-gray-800">
                        Total
                      </p>
                      <p className="text-2xl font-bold leading-normal text-right text-gray-800">
                        $10,240
                      </p>
                    </div>
                    <button
                      // onClick={() => setShow(!show)}
                      className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
