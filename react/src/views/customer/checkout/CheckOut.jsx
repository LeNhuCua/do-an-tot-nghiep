import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import SendEmail from "./SendEmail";
import ReactDOMServer from "react-dom/server";
import { useStateContext } from "../../../context/ContextProvider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Checkbox } from "primereact/checkbox";

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
  const { checkoutProducts, customerAddresses, orderNews } = state;
  let totalQuantity = 0;
  checkoutProducts.forEach(function (selected) {
    totalQuantity += selected.quantity;
  });
  let totalAmount = 0;
  checkoutProducts.forEach(function (selected) {
    totalAmount += selected.price * selected.quantity;
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

  console.log(checkoutProducts);
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
  console.log(selectedAddress);
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
  const { user } = useStateContext();
  const weightTemplate = (cart) => {
    return (
      <span className="">
        Trọng lượng:
        <span className="font-normal">
          {" "}
          {cart.product.product_size[0].weight}{" "}
          {cart.product.product_size[0].unit.name}
        </span>
      </span>
    );
  };

  const priceTemplate = (cart) => {
    return (
      <span className="font-normal">
        {new Intl.NumberFormat({
          style: "currency",
          currency: "JPY",
        }).format(cart.price)}
        <span> VNĐ</span>
      </span>
    );
  };

  const toltalTemplate = (cart) => {
    return (
      <p className="">
        {new Intl.NumberFormat({
          style: "currency",
          currency: "JPY",
        }).format(cart.price * cart.quantity)}
        <span> VNĐ</span>
      </p>
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    console.log(checkoutProducts);
    const total =
      selectedShippingMethods &&
      selectedShippingMethods.shippingMethodId === "PTVC002"
        ? totalAmount - 0
        : totalAmount + shippingCosts[0].shippingCost;

    //order
    formData.append("totalAmount", total);
    formData.append("paymentMethodId", data.paymentMethodName.paymentMethodId);
    formData.append(
      "shippingMethodId",
      data.shippingMethodName.shippingMethodId
    );
    formData.append("deposits", totalAmount * 0.1);
    //orderDetail
    for (let i = 0; i < checkoutProducts.length; i++) {
      formData.append(
        `orderDetails[${i}]`,
        JSON.stringify(checkoutProducts[i])
      );
    }
    //ShippingFee
    formData.append(
      "shippingFeeAmount",
      selectedShippingMethods.shippingMethodId === "PTVC002"
        ? 0
        : shippingCosts[0].shippingCost
    );
    //ShippingAddress
    formData.append("recipientAddress", selectedAddress.recipientAddress);
    formData.append("provinceId", selectedAddress.provinceId);
    formData.append("districtId", selectedAddress.districtId);
    formData.append("wardId", selectedAddress.wardId);
    formData.append("recipientName", selectedAddress.recipientName);
    formData.append("recipientPhone", selectedAddress.recipientPhone);
    await axiosClient
      .post(`${API}/api/cus-order`, formData)
      .then((response) => {
        if (response.data.status === 400) {
          // const resData = response.data.order;
          // const order_Details = response.data.order_Details;
          // const shippingFee = response.data.shippingFee;
          // const shippingAddress = response.data.shippingAddress;
          // const orderNew = {
          //   orderId: resData.orderId,
          //   totalAmount: resData.totalAmount,
          //   orderStatusId: resData.orderStatusId,
          //   deliveryDate: resData.deliveryDate,
          //   paymentMethodId: resData.paymentMethodId,
          //   shippingMethodId: resData.shippingMethodId,
          //   created_at: resData.created_at,
          //   customer_address: {
          //     recipientAddress: shippingAddress.recipientAddress,
          //     recipientName: shippingAddress.recipientName,
          //     recipientPhone: shippingAddress.recipientPhone,
          //     shippingAddressId: shippingAddress.shippingAddressId,
          //     province: {
          //       provinceId: shippingAddress.provinceId,
          //       name: selectedAddress.province.name,
          //     },
          //     district: {
          //       districtId: shippingAddress.districtId,
          //       name: selectedAddress.district.name,
          //     },
          //     ward: {
          //       wardId: shippingAddress.wardId,
          //       name: selectedAddress.ward.name,
          //     },
          //   },
          //   order_detail: order_Details.map((order_Detail) => ({
          //     orderDetailId: order_Detail.orderDetailId,
          //     price: order_Detail.price,
          //     quantity: order_Detail.quantity,
          //     sizeValue: order_Detail.sizeValue,
          //   })),
          // };
          // // dispatch({ type: "ADD_NEW_ORDER", payload: orderNew });

          // console.log(dispatch({ type: "ADD_NEW_ORDER", payload: orderNew }))
          const emailData = new FormData();
          emailData.append("subject", "Đặt hàng thành công tại Kim Huy");
          const content = ReactDOMServer.renderToString(
            <div>
              <h1 className="font-bold text-sm">
                Xin chào {user.fullName}, cảm ơn bạn đã đặt hàng!{" "}
              </h1>
              <div>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    <h3>
                      {" "}
                      Bạn đã đặt {checkoutProducts.length} mặt với tổng số tiền
                      phải trả là là:{" "}
                      {selectedShippingMethods &&
                      selectedShippingMethods.shippingMethodId !== "PTVC002" ? (
                        <>
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(
                            totalAmount +
                              (shippingCosts.length > 0
                                ? shippingCosts[0].shippingCost
                                : 0)
                          )}
                          <span> VNĐ</span>
                        </>
                      ) : (
                        <>
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(totalAmount)}
                          <span> VNĐ</span>
                        </>
                      )}
                      {" trong đó: "}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <span>
                  Tổng là:{" "}
                  {new Intl.NumberFormat({
                    style: "currency",
                    currency: "JPY",
                  }).format(totalAmount)}
                  <span> VNĐ</span>{" "}
                </span>
              </div>
              <div>
                <span>
                  Phí ship là{" "}
                  {selectedShippingMethods &&
                  selectedShippingMethods.shippingMethodId !== "PTVC002" ? (
                    <>
                      {new Intl.NumberFormat({
                        style: "currency",
                        currency: "JPY",
                      }).format(
                        shippingCosts.length > 0
                          ? shippingCosts[0].shippingCost
                          : "0"
                      )}
                      <span> VNĐ</span>
                    </>
                  ) : (
                    <>
                      {new Intl.NumberFormat({
                        style: "currency",
                        currency: "JPY",
                      }).format(0)}
                      <span> VNĐ</span>
                    </>
                  )}{" "}
                </span>
              </div>

              <h3>Chi tiết các sản phẩm như sau</h3>
              <div className="card">
                <DataTable
                  value={checkoutProducts}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column field="product.productId" header="Mã"></Column>
                  <Column field="product.name" header="Sản phẩm"></Column>
                  <Column field="quantity" header="Số lượng"></Column>
                  <Column
                    field="product.weight"
                    header="Trọng lượng"
                    body={weightTemplate}
                  ></Column>
                  <Column
                    field="product.product_type.name"
                    header="Loại"
                  ></Column>
                  <Column field="size.sizeValue" header="Kích thước"></Column>
                  <Column
                    field="price"
                    header="Đơn giá"
                    body={priceTemplate}
                  ></Column>
                  <Column
                    field="total"
                    header="Thành tiền"
                    body={toltalTemplate}
                  ></Column>
                </DataTable>
              </div>
            </div>
          );
          emailData.append("body", content);
          axiosClient
            .post(`${API}/api/send-email`, emailData)
            .then((response) => {
              if (response.data.status === 400) {
                setLoading(false);
                Swal.fire({
                  icon: "success",
                  title: "Đặt hàng thành công!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                navigate("/dathangthanhcong");
              } else {
                Swal.fire({
                  icon: "error",
                  text: "Vui lòng kiểm tra lại thông tin!",
                });
              }
            });
        } else {
          Swal.fire({
            icon: "error",
            text: "Vui lòng kiểm tra lại thông tin!",
          });
        }
      });

    // reset();
  };

  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateAddress, setUpdateAddress] = useState({});
  const submitUpdateAddress = async (id) => {
    await axiosClient
      .get(`${API}/api/customerAddresses/${id}`)
      .then(({ data }) => {
        // dispatch({ type: "FETCH_HOTPRODUCTS", payload: data });
        // setLoading(false);
        setUpdateAddress(data.customerAddress);
        console.log(data.customerAddress);
      });
    setOpenUpdate(true);
  };
  console.log(openUpdate);

  return (
    <div>
      <div className="card flex justify-content-center">
        <Dialog
          header="Header"
          visible={openUpdate}
          style={{ width: "50vw" }}
          onHide={() => setOpenUpdate(false)}
        >
          <div className="m-0">
            {" "}
            {updateAddress ? <h2>{updateAddress.recipientAddress}</h2> : ""}
            <h1></h1>
          </div>
        </Dialog>
      </div>
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
                  <h2 className="text-lg lg:text-sm text-bold">
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
                              <h6
                                className="text-blue-700"
                                onClick={() =>
                                  submitUpdateAddress(addAddress.addressId)
                                }
                              >
                                Cập nhật
                              </h6>

                              {/* <h6 className="text-red-600">Xoá</h6> */}
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
                  className="lg:w-3/5 w-full lg:pl-10 pl-4 pr-10 lg:pr-4  bg-white overflow-y-auto overflow-x-hidden h-screen"
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
                            <p className="text-sm  text-gray-800 lg:pt-0 pt-4">
                              {cart.product.productId}
                            </p>
                            <div className="flex items-center justify-between w-full pt-1">
                              <p className="text-lg font-black leading-none text-gray-800">
                                {cart.product.name}
                              </p>
                              <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                <h3 className="text-sm">{cart.quantity}</h3>
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
                                <h1 className="text-sm font-bold leading-3 text-gray-600 ">
                                  Trọng lượng:
                                  <span className="font-normal">
                                    {" "}
                                    {cart.product.product_size[0].weight}{" "}
                                    {cart.product.product_size[0].unit.name}
                                  </span>
                                </h1>
                                <h1 className="text-sm leading-3 text-gray-600 py-3">
                                  Loại:
                                  <span className="font-normal">
                                    {" "}
                                    {cart.product.product_type.name}
                                  </span>
                                </h1>
                              </div>
                              <div className="">
                                <h1 className="text-sm font-bold leading-3 text-gray-600 ">
                                  Đơn giá:{" "}
                                  <span className="font-normal">
                                    {new Intl.NumberFormat({
                                      style: "currency",
                                      currency: "JPY",
                                    }).format(cart.price)}
                                    <span> VNĐ</span>
                                  </span>
                                </h1>
                                <h1 className="text-sm leading-3 text-gray-600 py-3">
                                  Kích thước:
                                  <span className="font-normal">
                                    {" "}
                                    {cart.size.sizeValue}
                                  </span>
                                </h1>
                              </div>
                            </div>

                            <div className="flex items-center justify-end pr-6">
                              <p className="text-sm font-black leading-none text-gray-800">
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
                  className="lg:w-2/5 w-full bg-gray-100 h-full"
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
                        <p className="text-sm leading-normal text-gray-800">
                          Tổng
                        </p>
                        <p className="text-sm font-bold leading-normal text-right text-gray-800">
                          {new Intl.NumberFormat({
                            style: "currency",
                            currency: "JPY",
                          }).format(totalAmount)}
                          <span> VNĐ</span>
                        </p>
                      </div>
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <p className="text-sm leading-normal text-gray-800">
                          Phí ship
                        </p>
                        {selectedShippingMethods &&
                        selectedShippingMethods.shippingMethodId !==
                          "PTVC002" ? (
                          <p className="text-sm font-bold leading-normal text-right text-gray-800">
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
                          <p className="text-sm font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(0)}
                            <span> VNĐ</span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                        <p className="text-sm leading-normal text-gray-800">
                          Tổng tiền trả
                        </p>
                        {selectedShippingMethods &&
                        selectedShippingMethods.shippingMethodId !==
                          "PTVC002" ? (
                          <p className="text-sm font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(
                              totalAmount +
                                (shippingCosts.length > 0
                                  ? shippingCosts[0].shippingCost
                                  : 0)
                            )}
                            <span> VNĐ</span>
                          </p>
                        ) : (
                          <p className="text-sm font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(totalAmount)}
                            <span> VNĐ</span>
                          </p>
                        )}
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg ">
                        <div className="flex items-center pb-2 justify-between lg:pt-2 ">
                          <p className="text-sm leading-normal text-gray-800">
                            Tổng cọc (1% tiền đơn hàng )
                          </p>
                          <p className="text-sm font-bold leading-normal text-right text-gray-800">
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(totalAmount * 0.1)}
                            <span> VNĐ</span>
                          </p>
                        </div>
                        <div className="pb-2">
                          <div className="bg-red-300">
                            <div className="flex gap-2 items-center">
                              <AiOutlineInfoCircle />{" "}
                              <span>Thông tin tài khoản ngân hàng</span>
                            </div>
                            <p>- Số tài khoản: 105872540327</p>
                            <p>- Tên chủ thể: Lê Như Của</p>
                            <p>- Ngân hàng: VietinBank</p>
                          </div>
                          <div>
                            <div className="flex gap-2 items-center">
                              <AiOutlineInfoCircle /> <span>Điều khoản</span>
                            </div>
                            <p>
                              - Vui lòng chờ chúng tôi xác nhận hàng và thông
                              tin về tiền đặt cọc chúng tôi sẽ hỗ trợ cho bạn
                              sớm nhất.
                            </p>
                            <p>
                              - Nếu có thắc mắc vui lòng liên hệ: 0776223708
                            </p>
                            <p>
                              - Thông tin về tài khoản chúng tôi để trên màn
                              hình (chỉ sử dụng duy nhất tài khoản này){" "}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="lg:pt-2 lg:pb-2">
                        <Controller
                          name="checked"
                          control={control}
                          rules={{ required: "Vui lòng chấp nhận điều khoản." }}
                          render={({ field, fieldState }) => (
                            <>
                              <Checkbox
                                inputId={field.name}
                                checked={field.value}
                                inputRef={field.ref}
                                className={classNames({
                                  "p-invalid": fieldState.error,
                                })}
                                onChange={(e) => field.onChange(e.checked)}
                              />
                              <label
                                htmlFor={field.name}
                                className={classNames({
                                  "p-error": errors.checked,
                                })}
                              >
                                <span className="ml-2">
                                  {" "}
                                  Chấp nhận điều khoản
                                </span>
                              </label>
                              {getFormErrorMessage(field.name)}
                            </>
                          )}
                        />
                      </div>
                      <div>
                        <button
                          // onClick={() => setShow(!show)}
                          className="flex items-center group font-bold text-sm uppercase justify-center gap-2 leading-none w-full py-4 rounded-2xl bg-red-600 shadow-3xl border-gray-800 border hover:bg-gray-600 hover:text-yellow-400 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white"
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
