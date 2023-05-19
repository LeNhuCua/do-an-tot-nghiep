import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import { Link, Navigate } from "react-router-dom";
import { BsArrowBarRight } from "react-icons/bs";
import Loading from "../../../components/Loading";
import { API_IMAGES } from "../../../API";
import { BiArrowBack } from "react-icons/bi";
import UseTitle from "../../../hook/UseTitle";

const CheckOut = () => {
  UseTitle("Đặt hàng");

  const { state, dispatch } = useContext(DataContext);
  const { checkoutProducts } = state;

  let totalQuantity = 0;
  checkoutProducts.forEach(function (selected) {
    totalQuantity += selected.quantity;
  });
  let totalAmount = 0;
  checkoutProducts.forEach(function (selected) {
    totalAmount += selected.price * selected.quantity;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loading function to load data or
    // fake it using setTimeout;
    const loadData = async () => {
      // Wait for two second
      await new Promise((r) => setTimeout(r, 1000));

      // Toggle loading state
      setLoading(false);
    };

    loadData();
  }, []);
  if (checkoutProducts.length <= 0) {
    return <Navigate to="/giohang" />;
  }
  return (
    <div>
      <div>
        {loading && <Loading />}
        {!loading && (
          <div
            className=" w-full  bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden  "
            id="chec-div"
          >
            <div
              className=" z-10 w-full h-full overflow-x-hidden transform translate-x-0 transition ease-in-out duration-700"
              id="checkout"
            >
              <div className="cs-container card">Địa chỉ nhận hàng</div>
              <div
                className="flex lg:flex-row flex-col justify-center"
                id="cart"
              >
                <div
                  className="lg:w-2/3 w-full lg:pl-10 pl-4 pr-10 lg:pr-4  bg-white overflow-y-auto overflow-x-hidden h-screen"
                  id="scroll"
                >
              
                  {/* <p className="text-4xl font-black leading-10 text-gray-800 pt-3">
                    Giỏ hàng
                  </p> */}

                  <div>
                    {checkoutProducts.length > 0 && !loading ? (
                      checkoutProducts.map((cart) => (
                        <div
                          key={cart.cartId}
                          className="lg:flex items-center gap-4 py-2 border-t border-gray-300"
                        >
                          <div className="w-2/6 flex items-center gap-3 lg:w-1/6">
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
                                <h3>{cart.quantity}</h3>
                                {/* <input
                                id="form1"
                                min="0"
                                name="quantity"
                                value={cart.quantity}
                                type="number"
                                className="form-control form-control-sm"
                              /> */}
                              </div>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1">
                              <div className="">
                                <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                                  Trọng lượng:
                                  <span className="font-normal">
                                    {" "}
                                    {cart.product.weight}{" "}
                                    {cart.product.unit.name}
                                  </span>
                                </h1>
                                <h1 className="text-xl leading-3 text-gray-600 py-3">
                                  Loại:
                                  <span className="font-normal">
                                    {" "}
                                    {cart.product.product_type.name}
                                  </span>
                                </h1>
                              </div>
                              <div className="">
                                <h1 className="text-xl font-bold leading-3 text-gray-600 ">
                                  Đơn giá:{" "}
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
                                  <span className="font-normal">
                                    {" "}
                                    {cart.size.sizeValue}
                                  </span>
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
                      <div></div>
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
                        <p className="text-2xl leading-normal text-gray-800">
                          $
                        </p>
                        <p className="text-2xl font-bold leading-normal text-right text-gray-800">
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(totalAmount)}
                          <span> VNĐ</span>
                        </p>
                      </div>

                      <div>
                        <Link
                          to="/dathang"
                          // onClick={() => setShow(!show)}
                          className="flex items-center group font-bold text-xl uppercase justify-center gap-2 leading-none w-full py-4 rounded-2xl bg-red-600 shadow-3xl border-gray-800 border hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white"
                        >
                          <BsArrowBarRight className="group-hover:text-yellow-400 transition-all duration-500" />
                          <span className="group-hover:text-yellow-400 transition-all duration-500">
                            {" "}
                            Đặt hàng
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
    </div>
  );
};

export default CheckOut;
