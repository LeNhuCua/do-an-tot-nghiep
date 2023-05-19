import React, { useContext, useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import { BsArrowBarRight } from "react-icons/bs";
const ShoppingCart = () => {
  UseTitle("Giỏ hàng");
  const { tokenCustomer, user } = useStateContext();

  const [numberBuy, setNumberBuy] = useState([]);
  const { state, dispatch } = useContext(DataContext);
  const { checkoutProducts } = state;

  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
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
  const handleSelectProduct = (e, id) => {
    if (e.target.checked) {
      setSelectedData([...selectedData, id]);
    } else {
      setSelectedData(selectedData.filter((cartId) => cartId !== id));
    }
  };
  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      const allProductIds = carts.map((p) => p.cartId);
      setSelectedData(allProductIds);
    } else {
      setSelectedData([]);
    }
  };

  console.log(selectedData);
  const [filteredCartProducts, setFilteredCartProducts] = useState([]);
  // setSelectedData(selectedData.filter((cartId) => cartId !== id));
  // const filteredCartProducts = carts.filter((item) =>
  //   selectedData.includes(item.cartId)
  // );
  useEffect(() => {
    setFilteredCartProducts(
      carts.filter((item) => selectedData.includes(item.cartId))
    );
    dispatch({
      type: "SET_CHECKOUT_PRODUCTS",
      payload: carts.filter((item) => selectedData.includes(item.cartId)),
    });
  }, [selectedData, carts]);
  console.log(checkoutProducts);
  // dispatch({
  //   type: "SET_CHECKOUT_PRODUCTS",
  //   payload: filteredCartProducts,
  // });
  let totalAmount = 0;
  filteredCartProducts.forEach(function (selected) {
    totalAmount += selected.price * selected.quantity;
  });

  let totalQuantity = 0;
  filteredCartProducts.forEach(function (selected) {
    totalQuantity += selected.quantity;
  });

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
                className="w-full lg:pl-10 pl-4 pr-10 lg:pr-4  bg-white overflow-y-auto overflow-x-hidden h-screen"
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
                  <div className="py-2">
                    <input
                      id="checkAll"
                      checked={selectedData.length === carts.length}
                      className="w-7 h-7 text-green-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="checkbox"
                      onChange={handleSelectAllChange}
                    />
                    <label className="ml-2 font-bold" htmlFor="checkAll">
                      Tất cả
                    </label>
                  </div>

                  {carts.length > 0 && !loading ? (
                    carts.map((cart) => (
                      <div
                        key={cart.cartId}
                        className="lg:flex items-center gap-4 py-2 border-t border-gray-300"
                      >
                        <div className="w-2/6 flex items-center gap-3 lg:w-1/6">
                          <input
                            checked={selectedData.includes(cart.cartId)}
                            value={cart.cartId}
                            onChange={(e) =>
                              handleSelectProduct(e, cart.cartId)
                            }
                            type="checkbox"
                            className="w-6 h-6 text-green-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <img
                            src={`${API_IMAGES}/${cart.product.avatar}`}
                            alt={cart.product.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <div className="lg:pl-3 lg:w-3/4 lg:ml-4">
                          <p className="text-xl  text-gray-800 lg:pt-0 pt-4">
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
                          <div className="grid lg:grid-cols-2 grid-cols-1">
                            <div className="">
                              <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                                Trọng lượng:
                                <span className="font-normal">
                                  {" "}
                                  {cart.product.weight} {cart.product.unit.name}
                                </span>
                              </h1>
                              <h1 className="text-xl leading-3 text-gray-600 py-3">
                                Loại:
                                <span className="font-normal"> {" "}{cart.product.product_type.name}</span>
                              </h1>
                            </div>
                            <div className="">
                              <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                                Đơn giá:
                                {" "}
                                <span className="font-normal">
                                {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(cart.price)}
                              <span> VNĐ</span>
                               
                                </span>
                              </h1>
                              <h1 className="text-xl leading-3 text-gray-600 py-3">
                                Kích thước:
                                <span className="font-normal"> {cart.size.sizeValue}</span>
                              </h1>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pr-6">
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
              <div className="lg:w-1/3 w-full bg-gray-100 h-full">
                <div className="flex flex-col  px-14 py-20 justify-between overflow-y-auto">
                  <div>
                    <p className="text-4xl font-black leading-9 text-gray-800">
                      Chi tiết
                    </p>
                    <div className="flex items-center justify-between pt-12">
                      <p className="text-base leading-none text-gray-800">
                        Số lượng sản phẩm
                      </p>
                      <p className="text-base leading-none text-gray-800">
                        {totalQuantity}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center pb-6 justify-between lg:pt-5 pt-20">
                      <p className="text-2xl leading-normal text-gray-800">$</p>
                      <p className="text-2xl font-bold leading-normal text-right text-gray-800">
                        {new Intl.NumberFormat({
                          style: "currency",
                          currency: "JPY",
                        }).format(totalAmount)}
                        <span> VNĐ</span>
                      </p>
                    </div>

                    <div
                      className={`${
                        checkoutProducts.length <= 0 ? "hidden" : ""
                      }`}
                    >
                      <Link
                        to="/dathang"
                        // onClick={() => setShow(!show)}
                        className="flex items-center group font-bold text-xl uppercase justify-center gap-2 leading-none w-full py-4 rounded-2xl bg-red-600 shadow-3xl border-gray-800 border hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white"
                      >
                        <BsArrowBarRight className="group-hover:text-yellow-400 transition-all duration-500" />
                        <span className="group-hover:text-yellow-400 transition-all duration-500">
                          {" "}
                          Mua hàng
                        </span>
                      </Link>
                    </div>
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
