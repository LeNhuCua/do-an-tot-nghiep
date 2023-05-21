import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import { Link, Navigate } from "react-router-dom";
import { BsArrowBarRight } from "react-icons/bs";
import Loading from "../../../components/Loading";
import { API, API_IMAGES } from "../../../API";
import { BiArrowBack } from "react-icons/bi";
import UseTitle from "../../../hook/UseTitle";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { CCol, CForm } from "@coreui/react";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { TabView, TabPanel } from "primereact/tabview";
import Address from "../../../components/customer/checkout/Address";
import Swal from "sweetalert2";
import axios from "axios";
import axiosClient from "../../../axios-client-customer";
import { RadioButton } from "primereact/radiobutton";
import CreateCustomerAddress from "../../../components/customer/checkout/CreateCustomerAddress";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

const CheckOut = () => {
  UseTitle("Đặt hàng");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    form,
    control,
  } = useForm({
    mode: "onChange",
  });
  const { state, dispatch } = useContext(DataContext);
  const { checkoutProducts, customerAddresses } = state;

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
  // if (checkoutProducts.length <= 0) {
  //   return <Navigate to="/giohang" />;
  // }

  const [visible, setVisible] = useState(false);
  const [addAddress, setAddAddress] = useState(false);

  const footerContent = (
    <div>
      <Button
        label="Đóng"
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
        }}
        className="p-button-text"
      />
      {/* <Button
        label="Xác nhận"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      /> */}
    </div>
  );

  // địa chỉ
  const [parentProvince, setParentProvince] = useState(null);
  const [parentDistrict, setParentDistrict] = useState(null);
  const [parentWard, setParentWard] = useState(null);
  const handleDataChange = (province, district, ward) => {
    setParentProvince(province);
    setParentDistrict(district);
    setParentWard(ward);
  };

  // const [listAddresses, setListAddresses] = useState(null);
  useEffect(() => {
    fetchAddresses();
  }, []);
  const fetchAddresses = async () => {
    await axiosClient.get(`${API}/api/customerAddresses`).then(({ data }) => {
      dispatch({ type: "FETCH_CUSTOMER_ADDRESSES", payload: data });
    });
  };

  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    setSelectedAddress(
      selectedAddress !== "" && selectedAddress
        ? selectedAddress
        : customerAddresses[0]
    );
  }, [customerAddresses]);

  const [shippingCosts, setShippingCosts] = useState([]);
  useEffect(() => {
    if (selectedAddress !== "" && selectedAddress) {
      fetchShippingCosts();
    }
  }, [selectedAddress]);
  const fetchShippingCosts = async () => {
    await axios
      .get(
        `${API}/api/shippingCosts/${selectedAddress.provinceId}/${selectedAddress.districtId}/${selectedAddress.wardId}`
      )
      .then(({ data }) => {
        // dispatch({ type: "FETCH_CUSTOMER_ADDRESSES", payload: data });
        setShippingCosts(data);
      });
  };

  const [paymentMethods, setPaymentMethods] = useState([]);
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  const fetchPaymentMethods = async () => {
    await axios.get(`${API}/api/cus-payment/paymentMethod`).then(({ data }) => {
      // dispatch({ type: "FETCH_CUSTOMER_ADDRESSES", payload: data });
      setPaymentMethods(data);
    });
  };
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethods, setSelectedShippingMethods] = useState(null);
  console.log(selectedShippingMethods);
  useEffect(() => {
    fetchShippingMethods();
  }, []);
  const fetchShippingMethods = async () => {
    await axios
      .get(`${API}/api/cus-payment/shippingMethods`)
      .then(({ data }) => {
        // dispatch({ type: "FETCH_CUSTOMER_ADDRESSES", payload: data });
        setShippingMethods(data);
      });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="cs-text-error">{errors[name].message}</small>
    ) : (
      <small className="">&nbsp;</small>
    );
  };
  const onSubmit = (data) => {
    console.log(data.paymentMethodName);

    reset();
  };
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
              {/* <Address/> */}
              <div className="cs-container card py-1">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <h2 className="text-lg lg:text-xl text-bold">
                    {selectedAddress !== "" && selectedAddress ? (
                      <div>
                        {selectedAddress.recipientName}
                        {" | "}
                        {selectedAddress.recipientPhone}{" "}
                        <span className="text-base lg:ml-16 font-normal lg:text-lg">
                          {selectedAddress.recipientAddress} {", "}
                          {selectedAddress.ward.name} {" - "}
                          {selectedAddress.district.name}
                          {" - "}
                          {selectedAddress.province.name}
                        </span>
                      </div>
                    ) : customerAddresses.length === 0 &&
                      selectedAddress !== "" ? (
                      "Chưa có"
                    ) : (
                      "Đang tải"
                    )}
                  </h2>

                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setVisible(true)}
                  >
                    Thay đổi
                  </span>
                </div>

                <Dialog
                  header="Địa chỉ của tôi"
                  visible={visible}
                  className="w-[90%] h-[80vh] xl:w-2/3"
                  onHide={() => setVisible(false)}
                  footer={footerContent}
                >
                  <div className="m-0">
                    {customerAddresses
                      ? customerAddresses.map((addAddress) => (
                          <div
                            key={addAddress.addressId}
                            className="border-t-2 py-1"
                          >
                            <div>
                              <RadioButton
                                inputId={addAddress.addressId}
                                name="addAddress"
                                value={addAddress}
                                onChange={(e) => setSelectedAddress(e.value)}
                                checked={
                                  selectedAddress
                                    ? selectedAddress.addressId ===
                                      addAddress.addressId
                                    : ""
                                }
                              />

                              <h2 className="text-lg">
                                {addAddress.recipientName}
                                {" | "}
                                <span>{addAddress.recipientPhone}</span>
                              </h2>
                              <span>
                                {addAddress.recipientAddress}
                                {", "}
                                {addAddress.ward.name}
                                {" - "}
                                {addAddress.district.name}
                                {" - "}
                                {addAddress.province.name}
                              </span>
                            </div>
                            <div className="justify-end flex gap-2  cursor-pointer">
                              <h6 className="text-blue-700">Cập nhật</h6>

                              <h6 className="text-red-600">Xoá</h6>
                            </div>
                          </div>
                        ))
                      : "đa"}
                    <Button
                      severity="secondary"
                      outlined
                      label="Thêm địa chỉ mới"
                      icon="pi pi-plus"
                      onClick={() => setAddAddress(true)}
                    />
                    <Dialog
                      header="Địa chỉ mới"
                      visible={addAddress}
                      className="w-[90%] h-[80vh] xl:w-2/3"
                      onHide={() => setAddAddress(false)}
                      // footer={footerAddContent}
                    >
                      <CreateCustomerAddress
                        setAddAddress={setAddAddress}
                        setLoading={setLoading}
                        handleDataChange={handleDataChange}
                        parentProvince={parentProvince ? parentProvince : ""}
                        parentDistrict={parentDistrict ? parentDistrict : ""}
                        parentWard={parentWard ? parentWard : ""}
                      />
                    </Dialog>
                  </div>
                </Dialog>
              </div>
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

                            <div className="flex items-center justify-end pr-6">
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
                <CForm
                  className="lg:w-1/3 w-full bg-gray-100 h-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
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
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <Controller
                          name="paymentMethodName"
                          control={control}
                          rules={{
                            required: "Vui lòng chọn phương thức thanh toán.",
                          }}
                          render={({ field, fieldState }) => (
                            <Dropdown
                              id={field.paymentMethodName}
                              value={field.value}
                              optionLabel="paymentMethodName"
                              placeholder="Chọn phương thức thanh toán"
                              options={paymentMethods}
                              focusInputRef={field.ref}
                              onChange={(e) => field.onChange(e.value)}
                              // className="w-full"
                              className={classNames({
                                "p-invalid": fieldState.error,
                                "w-full": true,
                              })}
                            />
                          )}
                        />
                      </div>
                      {getFormErrorMessage("paymentMethodName")}
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <Controller
                          name="shippingMethodName"
                          control={control}
                          rules={{
                            required: "Vui lòng chọn hình thức nhận hàng.",
                          }}
                          render={({ field, fieldState }) => (
                            <Dropdown
                              id={field.shippingMethodName}
                              value={field.value}
                              optionLabel="shippingMethodName"
                              placeholder="Chọn phương thức nhận hàng"
                              options={shippingMethods}
                              focusInputRef={field.ref}
                              onChange={(e) => {
                                field.onChange(e.value);
                                setSelectedShippingMethods(e.value);
                              }}
                              // className="w-full"
                              className={classNames({
                                "p-invalid": fieldState.error,
                                "w-full": true,
                              })}
                            />
                          )}
                        />
                      </div>
                      {getFormErrorMessage("shippingMethodName")}
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <p className="text-xl leading-normal text-gray-800">
                          Tổng
                        </p>
                        <p className="text-xl font-bold leading-normal text-right text-gray-800">
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(totalAmount)}
                          <span> VNĐ</span>
                        </p>
                      </div>
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <p className="text-xl leading-normal text-gray-800">
                          Phí ship
                        </p>
                        {selectedShippingMethods &&
                        selectedShippingMethods.shippingMethodId !==
                          "PTVC002" ? (
                          <p className="text-xl font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(
                              shippingCosts.length > 0
                                ? shippingCosts[0].shippingCost
                                : "0"
                            )}
                            <span> VNĐ</span>
                          </p>
                        ) : (
                          <p className="text-xl font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(0)}
                            <span> VNĐ</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <p className="text-xl leading-normal text-gray-800">
                          Tổng tiền trả
                        </p>
                        {selectedShippingMethods &&
                        selectedShippingMethods.shippingMethodId !==
                          "PTVC002" ? (
                          <p className="text-xl font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(
                              totalAmount -
                                (shippingCosts.length > 0
                                  ? shippingCosts[0].shippingCost
                                  : 0)
                            )}
                            <span> VNĐ</span>
                          </p>
                        ) : (
                          <p className="text-xl font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(totalAmount)}
                            <span> VNĐ</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <button
                          // onClick={() => setShow(!show)}
                          className="flex items-center group font-bold text-xl uppercase justify-center gap-2 leading-none w-full py-4 rounded-2xl bg-red-600 shadow-3xl border-gray-800 border hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white"
                        >
                          <BsArrowBarRight className="group-hover:text-yellow-400 transition-all duration-500" />
                          <span className="group-hover:text-yellow-400 transition-all duration-500">
                            {" "}
                            Đặt hàng
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CForm>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
