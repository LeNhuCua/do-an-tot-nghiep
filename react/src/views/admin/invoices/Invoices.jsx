import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "primereact/button";

import { useReactToPrint } from "react-to-print";
import { API, API_IMAGES } from "../../../API";
import { DataContext } from "../../../context/DataContext";
import axios from "axios";
import { classNames } from "primereact/utils";
import { ImFileEmpty } from "react-icons/im";
import removeAccents from "../../../hook/admin/RemoAccents";
import { useStateContext } from "../../../context/ContextProvider";
import { CCol, CForm } from "@coreui/react";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Sidebar } from "primereact/sidebar";
import { ScrollPanel } from "primereact/scrollpanel";
import { Fieldset } from "primereact/fieldset";
import { ProgressSpinner } from "primereact/progressspinner";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Tippy from "@tippyjs/react";
import { TabView, TabPanel } from "primereact/tabview";

import { InputNumber } from "primereact/inputnumber";
import SearchProducts from "../../../components/admin/Invoices/SearchProducts";
import ComponentToPrint from "./ComponentToPrint";
import Bill from "../../../components/admin/Invoices/Bill";
import Loading from "../../../components/Loading";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";
import axiosClient from "../../../axios-client";

export default function Invoices() {
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
  const [visible, setVisible] = useState(false);
  const { products } = state;
  const [loading, setLoading] = useState(true);


  const handleCustomerInfoChange = (name, value) => {
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);
  const componentRef = useRef();
  const fetchProducts = async () => {
    await axiosClient.get(`${API}/api/products/`).then(({ data }) => {
      dispatch({ type: "FETCH_PRODUCTS", payload: data });
      setLoading(false);
    });
  };
  const [invoices, setInvoices] = useState(() => {
    const localData = localStorage.getItem("invoices");
    return localData
      ? JSON.parse(localData)
      : {
          1: [],
          2: [],
          3: [],
        };
  });
  const [tableCount, setTableCount] = useState(() => {
    const localData = localStorage.getItem("tableCount");
    return localData ? JSON.parse(localData) : 3;
  });

  const addTable = () => {
    setTableCount((prevState) => prevState + 1);
    setInvoices({
      ...invoices,
      [tableCount + 1]: [],
    });
  };

  // Save tableCount into local storage
  useEffect(() => {
    localStorage.setItem("tableCount", JSON.stringify(tableCount));
  }, [tableCount]);

  // Save invoices into local storage
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const [selectedTable, setSelectedTable] = useState(1);
  console.log(invoices[selectedTable]);
  const addToInvoice = (product, id, selectedSize) => {
    console.log(selectedSize);
    if (!invoices[selectedTable]) {
      setInvoices({ ...invoices, [selectedTable]: [] });
    }
    const newItem = {
      ...product,
      amount: 1,
      sizeId: selectedSize.sizeId,
      sizeValue: selectedSize.size[0].sizeValue,
      sizePrice: selectedSize.price,
      weight: selectedSize.weight,
      unitId: selectedSize.unitId,
      unitName: selectedSize.unit.name,
    };
    const invoiceItem = invoices[selectedTable].find((item) => {
      return item.productId === id && item.sizeId === selectedSize.sizeId;
    });

    //nếu đã tồn tại
    if (invoiceItem) {
      const newInvoice = [...invoices[selectedTable]].map((item) => {
        if (item.productId === id && item.sizeId === selectedSize.sizeId) {
          return { ...item, amount: invoiceItem.amount + 1 };
        } else {
          return item;
        }
      });
      console.log(newInvoice);
      setInvoices({ ...invoices, [selectedTable]: newInvoice });
    } else {
      setInvoices({
        ...invoices,
        [selectedTable]: [...invoices[selectedTable], newItem],
      });
    }
  };

  const increaseAmount = (id, selectedSize) => {
    console.log(selectedSize);
    console.log(id);
    if (!invoices[selectedTable]) {
      return;
    }
    const invoiceItem = invoices[selectedTable].find((item) => {
      return item.productId === id && item.sizeId === selectedSize;
    });

    if (invoiceItem) {
      console.log(invoiceItem);
      const newInvoice = invoices[selectedTable].map((item) => {
        if (item.productId === id && item.sizeId === selectedSize) {
          return { ...item, amount: invoiceItem.amount + 1 };
        } else {
          return item;
        }
      });

      setInvoices({ ...invoices, [selectedTable]: newInvoice });
    }

    //nếu đã tồn tại
    // if (invoiceItem) {
    //   console.log(invoiceItem)
    //   addToInvoice(invoiceItem, id, selectedSize);
    // } else {
    //   alert("vv")
    //   const newItem = products.find((product) => product.productId === id);

    //   // kiểm tra newItem
    //   if (newItem) {
    //     addToInvoice(newItem, id);
    //   } else {
    //     console.error(`Product ${id} not found`);
    //   }
    // }
  };

  // Save invoices into local storage
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const legendTemplate = (
    <div className="flex align-items-center gap-3 text-primary">
      <div>
        <span className="pi pi-wallet mr-2"></span>
        <span className="font-bold text-lg">Hoá đơn</span>
      </div>

      <Tippy content="Thêm hoá đơn">
        <Button
          onClick={addTable}
          icon="pi pi-plus"
          rounded
          severity="success"
          aria-label="Search"
        />
      </Tippy>
      <Tippy content="Xem hoá đơn">
        <div className="lg:hidden">
          <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
        </div>
      </Tippy>
    </div>
  );
  const removeFromInvoice = (id, selectedSize) => {
    const newInvoice = invoices[selectedTable].filter((item) => {
      return item.productId !== id || item.sizeId !== selectedSize;
    });
    setInvoices({ ...invoices, [selectedTable]: newInvoice });
  };

  const reduceAmount = (id, selectedSize) => {
    if (!invoices[selectedTable]) {
      return;
    }

    const invoiceItem = invoices[selectedTable].find((item) => {
      return item.productId === id && item.sizeId === selectedSize;
    });

    //nếu đã tồn tại
    if (invoiceItem) {
      const newInvoice = invoices[selectedTable].map((item) => {
        if (item.productId === id && item.sizeId === selectedSize) {
          return { ...item, amount: invoiceItem.amount - 1 };
        } else {
          return item;
        }
      });

      if (invoiceItem.amount < 2) {
        removeFromInvoice(id, selectedSize);
      } else {
        setInvoices({ ...invoices, [selectedTable]: newInvoice });
      }
    }
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const { user, info } = useStateContext();

  function sumArray(arr) {
    if (!Array.isArray(arr)) {
      return 0;
    }
    return arr.reduce((sum, value) => {
      return sum + Number(value.sizePrice) * value.amount;
    }, 0);
  }

  useEffect(() => {
    setTotalAmount(sumArray(invoices[selectedTable]));
  }, [invoices[selectedTable]]); // Add the invoices state as a dependency
  const [phone, setPhone] = useState(null);

  const [formInput, setFormInput] = useState({
    name: "",
  });
  // const handleInputChange = (event) => {
  //   setFormInput({
  //     ...formInput,
  //     [event.target.name]: event.target.value,
  //   });
  // };
  console.log(invoices[selectedTable]);
  const [isLoading, setIsLoading] = useState(false);
  const CreateInvoice = async () => {
    const formData = new FormData();
    formData.append("totalAmount", totalAmount);
    formData.append("fullName", tableData[selectedTable]?.name);
    formData.append("phoneNumber", tableData[selectedTable]?.phone);
    formData.append("userId", user.userId);
    for (let i = 0; i < invoices[selectedTable].length; i++) {
      formData.append(
        `invoices[${selectedTable}][${i}]`,
        JSON.stringify(invoices[selectedTable][i])
      );
    }
    const isConfirm = await Swal.fire({
      title: `Thanh toán hoá đơn này ?`,
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
    setIsLoading(true);
    await axiosClient.post(`${API}/api/invoices`, formData).then((response) => {
      if (response.data.status === 400) {
        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
        setInvoices({ ...invoices, [selectedTable]: [] });
        setTableData({ ...tableData, [selectedTable]: [] });
        // navigate("/quantri/sanpham");
        // reset();
      } else {
        Swal.fire({
          icon: "error",
          text: "Vui lòng kiểm tra lại thông tin!",
        });
      }
      setIsLoading(false);
    });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });

  const [inputValue, setInputValue] = useState(null);
  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="cs-text-error">{errors[name].message}</small>
    ) : (
      <small className="">&nbsp;</small>
    );
  };

  const [tableData, setTableData] = useState({});

  const handlePhoneChange = (event, tableNumber) => {
    const newTableData = { ...tableData };
    if (!newTableData[tableNumber]) {
      newTableData[tableNumber] = {};
    }
    newTableData[tableNumber].phone = event.target.value;
    setTableData(newTableData);
  };

  const handleInputChange = (event, tableNumber) => {
    const newTableData = { ...tableData };
    if (!newTableData[tableNumber]) {
      newTableData[tableNumber] = {};
    }
    newTableData[tableNumber].inputValue = event.target.value;
    setTableData(newTableData);
  };

  const handleNameChange = (event, tableNumber) => {
    const newTableData = { ...tableData };
    if (!newTableData[tableNumber]) {
      newTableData[tableNumber] = {};
    }
    newTableData[tableNumber].name = event.target.value;
    setTableData(newTableData);
  };

  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Lập hoá đơn",
    },
  ];
  return (
    <>
     <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
        {isLoading && <Loading />}
        <ScrollPanel className="col-span-3 h-[100vh]">
          <TabView>
            <TabPanel header="Hoá đơn" leftIcon="pi pi-calendar mr-2">
              <Fieldset legend={legendTemplate} className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3">
                  {[...Array(tableCount)].map((_, i) => (
                    <button
                      key={i}
                      className={`border p-2   ${
                        i + 1 === selectedTable && invoices[i + 1].length > 0
                          ? "bg-blue-500 text-white font-bold"
                          : i + 1 === selectedTable
                          ? "bg-blue-500 text-white font-bold"
                          : invoices[i + 1].length > 0
                          ? "bg-green-300"
                          : ""
                      }  `}
                      onClick={() => setSelectedTable(i + 1)}
                    >
                      Hoá đơn {i + 1}
                    </button>
                  ))}
                </div>
              </Fieldset>{" "}
            </TabPanel>
            <TabPanel header="Sản phẩm" rightIcon="pi pi-credit-card ml-2">
              <div className="relative">
                <SearchProducts
                  products={products}
                  addToInvoice={addToInvoice}
                />
              </div>
            </TabPanel>
          </TabView>
        </ScrollPanel>

        <ScrollPanel className="col-span-2 h-[100vh]">
          <div className="hidden lg:block">
            <div className="card p-2 ">
              <div>
                {selectedTable && (
                  <div>
                    <h2 className="uppercase text-center font-bold">
                      Hoá đơn {selectedTable}
                    </h2>

                    {invoices[selectedTable].length > 0 ? (
                      invoices[selectedTable].map((c, i) => (
                        <Bill
                          key={i}
                          c={c}
                          removeFromInvoice={removeFromInvoice}
                          increaseAmount={increaseAmount}
                          reduceAmount={reduceAmount}
                        />
                      ))
                    ) : (
                      <div>
                        <ImFileEmpty size={30} /> Hoá đơn trống
                      </div>
                    )}
                    {totalAmount ? (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Tổng tiền</p>

                          {totalAmount ? (
                            <p>
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(totalAmount)}{" "}
                              VNĐ
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex items-center justify-between text-base font-medium text-gray-900">
                          <p>Tiền nhận</p>
                          <Controller
                            name="price"
                            control={control}
                            rules={{
                              required: "Vui lòng nhập tiền nhận",
                              validate: {
                                greaterThanOrEqualTo1: (value) =>
                                  value >= 1 || "Vui lòng nhập tiền nhận >= 1",
                                lessThanOrEqualTo1Billion: (value) =>
                                  value <= 10000000000 ||
                                  "Vui lòng nhập tiền nhận <= 10 tỷ",
                              },
                              validate: (value) =>
                                value >= totalAmount ||
                                "Vui lòng nhập tiền nhận >= tổng tiền đơn hàng!",
                            }}
                            render={({ field, fieldState }) => (
                              <div className="flex flex-col">
                                <div className="flex justify-end">
                                  <InputNumber
                                    inputStyle={{ textAlign: "right" }}
                                    suffix=" VNĐ"
                                    id={field.price}
                                    inputRef={field.ref}
                                    value={
                                      tableData[selectedTable]?.inputValue || ""
                                    }
                                    onBlur={field.onBlur}
                                    onValueChange={(e) => {
                                      field.onChange(e); // Cập nhật giá trị cho ô input
                                      handleInputChange(e, selectedTable); // Lưu giá trị của ô input vào biến state yearValue
                                    }}
                                    inputClassName={classNames({
                                      "p-invalid": fieldState.error,
                                    })}
                                    placeholder="Vd: 12"
                                  />
                                </div>

                                {getFormErrorMessage(field.name)}

                                {/* {fieldState.error && (
                                <div className="p-error">
                                  {fieldState.error.greaterThanOrEqualTo1}
                                </div>
                              )} */}
                              </div>
                            )}
                          />
                          {/* <InputNumber
                        suffix=" VNĐ"
                        inputId="integeronly"
                        value={inputValue}
                        onValueChange={(e) => setInputValue(e.value)}
                        inputStyle={{ textAlign: "right" }}
                      /> */}
                        </div>
                        {totalAmount && tableData[selectedTable]?.inputValue ? (
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Tiền thừa</p>
                            <p>
                              {new Intl.NumberFormat({
                                style: "currency",
                                currency: "JPY",
                              }).format(
                                tableData[selectedTable]?.inputValue -
                                  totalAmount
                              )}{" "}
                              VNĐ
                            </p>
                          </div>
                        ) : (
                          ""
                        )}

                        <p className="mt-0.5 text-sm text-gray-500">
                          Nhập tên và số điện thoại khách hàng bên dưới
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
              <div
                className={`${invoices[selectedTable].length ? "" : "hidden"}`}
              >
                <CForm
                  encType="multipart/form-data"
                  onSubmit={handleSubmit(CreateInvoice)}
                  className={`row g-4 relative `}
                >
                  <CCol xl={6}>
                    <span className="p-float-label ">
                      <InputText
                        id="name"
                        name="name"
                        className={`w-full`}
                        value={tableData[selectedTable]?.name || ""}
                        onChange={(e) => handleNameChange(e, selectedTable)}
                        type="text"
                        placeholder="Vd: Nguyễn văn A"
                      />
                      <label htmlFor="name">Tên khách hàng</label>
                    </span>
                  </CCol>
                  <CCol xl={6}>
                    <span className="p-float-label ">
                      <InputText
                        className="w-full"
                        keyfilter="int"
                        placeholder="Vd: 0999999999"
                        value={tableData[selectedTable]?.phone || ""}
                        onChange={(e) =>
                          handlePhoneChange(e, selectedTable)
                        }
                        maxLength={10}
                      
                      />
                      <label htmlFor="phone">Điện thoại</label>
                    </span>
                  </CCol>
                  <CCol xl={6}>
                    <Button
                      disabled={invoices[selectedTable].length ? false : true}
                      className="w-full flex justify-center "
                      type="button"
                      color="secondary"
                      variant="contained"
                      label="In"
                      icon="pi pi-print"
                      // startIcon={<PrintIcon />}
                      onClick={
                        tableData[selectedTable]?.phone === null ||
                        tableData[selectedTable]?.name === null ||
                        tableData[selectedTable]?.inputValue === null
                          ? () =>
                              Swal.fire({
                                icon: "warning",
                                title: "Cảnh báo!",
                                text: "Vui lòng nhập tên, số điện thoại và số tiền nhận của khách hàng!",
                              })
                          : invoices[selectedTable] &&
                            invoices[selectedTable].length
                          ? handlePrint
                          : () =>
                              Swal.fire({
                                icon: "warning",
                                title: "Cảnh báo!",
                                text: "Không có dữ liệu để in!",
                              })
                      }
                    />
                  </CCol>
                  <CCol xl={6}>
                    <Button
                      icon="pi pi-arrow-up"
                      disabled={invoices[selectedTable].length ? false : true}
                      className="w-full"
                      label="Thanh toán"
                      severity="success"
                    />
                  </CCol>
                </CForm>
              </div>
            </div>
          </div>

          {/* mobile */}

          <Sidebar
            position="right"
            visible={visible}
            onHide={() => setVisible(false)}
            className="w-full md:w-25rem lg:w-35rem"
          >
            <div>
              {selectedTable && (
                <div>
                  <h2 className="uppercase text-center font-bold">
                    Hoá đơn {selectedTable}
                  </h2>

                  {invoices[selectedTable].length > 0 ? (
                    invoices[selectedTable].map((c, i) => (
                      <Bill
                        key={i}
                        c={c}
                        removeFromInvoice={removeFromInvoice}
                        increaseAmount={increaseAmount}
                        reduceAmount={reduceAmount}
                      />
                    ))
                  ) : (
                    <h4>
                      <ImFileEmpty /> Hoá đơn trống
                    </h4>
                  )}
                  {totalAmount ? (
                    <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <p>Tổng tiền</p>

                        {totalAmount ? (
                          <p>
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(totalAmount)}{" "}
                            VNĐ
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div class="flex items-center justify-between text-base font-medium text-gray-900">
                        <p>Tiền nhận</p>
                        <Controller
                          name="price"
                          control={control}
                          rules={{
                            required: "Vui lòng nhập tiền nhận",
                            validate: (value) =>
                              value >= totalAmount ||
                              "Vui lòng nhập tiền nhận >= tổng tiền đơn hàng!",
                          }}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col">
                              <div className="flex justify-end">
                                <InputNumber
                                  inputStyle={{ textAlign: "right" }}
                                  suffix=" VNĐ"
                                  id={field.price}
                                  inputRef={field.ref}
                                  value={
                                    tableData[selectedTable]?.inputValue || ""
                                  }
                                  onBlur={field.onBlur}
                                  onValueChange={(e) => {
                                    field.onChange(e); // Cập nhật giá trị cho ô input
                                    handleInputChange(e, selectedTable); // Lưu giá trị của ô input vào biến state yearValue
                                  }}
                                  inputClassName={classNames({
                                    "p-invalid": fieldState.error,
                                  })}
                                  placeholder="Vd: 12"
                                />
                              </div>

                              {getFormErrorMessage(field.name)}
                            </div>
                          )}
                        />
                        {/* <InputNumber
                        suffix=" VNĐ"
                        inputId="integeronly"
                        value={inputValue}
                        onValueChange={(e) => setInputValue(e.value)}
                        inputStyle={{ textAlign: "right" }}
                      /> */}
                      </div>
                      {totalAmount &&
                      tableData[selectedTable]?.inputValue >= totalAmount ? (
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <p>Tiền thừa</p>
                          <p>
                            {new Intl.NumberFormat({
                              style: "currency",
                              currency: "JPY",
                            }).format(
                              tableData[selectedTable]?.inputValue - totalAmount
                            )}{" "}
                            VNĐ
                          </p>
                        </div>
                      ) : (
                        ""
                      )}

                      <p class="mt-0.5 text-sm text-gray-500">
                        Nhập tên và số điện thoại khách hàng bên dưới
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
            <div
              className={`${invoices[selectedTable].length ? "" : "hidden"}`}
            >
              <CForm
                encType="multipart/form-data"
                onSubmit={handleSubmit(CreateInvoice)}
                className={`row g-4 relative `}
              >
                <CCol xl={6}>
                  <span className="p-float-label ">
                    <InputText
                      id="name"
                      name="name"
                      className={`w-full`}
                      value={tableData[selectedTable]?.name || ""}
                      onChange={(e) => handleNameChange(e, selectedTable)}
                      type="text"
                      placeholder="Vd: Nguyễn văn A"
                    />
                    <label htmlFor="name">Tên khách hàng</label>
                  </span>
                </CCol>
                <CCol xl={6}>
                  <span className="p-float-label ">
                    <InputText
                      className="w-full"
                      keyfilter="int"
                      placeholder="Vd: 0999999999"
                      value={tableData[selectedTable]?.phone || ""}
                      onChange={(e) => handlePhoneChange(e, selectedTable)}
                      maxLength={10}
                    />
                    <label htmlFor="phone">Điện thoại</label>
                  </span>
                </CCol>
                <CCol xl={6}>
                  <Button
                    disabled={invoices[selectedTable].length ? false : true}
                    className="w-full flex justify-center "
                    type="button"
                    color="secondary"
                    variant="contained"
                    label="In"
                    icon="pi pi-print"
                    // startIcon={<PrintIcon />}
                    onClick={
                      tableData[selectedTable]?.phone === null ||
                      tableData[selectedTable]?.name === null ||
                      tableData[selectedTable]?.inputValue === null
                        ? () =>
                            Swal.fire({
                              icon: "warning",
                              title: "Cảnh báo!",
                              text: "Vui lòng nhập tên, số điện thoại và số tiền nhận của khách hàng!",
                            })
                        : invoices[selectedTable] &&
                          invoices[selectedTable].length
                        ? handlePrint
                        : () =>
                            Swal.fire({
                              icon: "warning",
                              title: "Cảnh báo!",
                              text: "Không có dữ liệu để in!",
                            })
                    }
                  />
                </CCol>
                <CCol xl={6}>
                  <Button
                    icon="pi pi-arrow-up"
                    disabled={invoices[selectedTable].length ? false : true}
                    className="w-full"
                    label="Thanh toán"
                    severity="success"
                  />
                </CCol>
              </CForm>
            </div>
          </Sidebar>

          <div>
            <div style={{ display: "none" }}>
              <ComponentToPrint
                info={info.phone}
                ref={componentRef}
                invoices={invoices[selectedTable]}
                totalAmount={totalAmount}
                name={tableData[selectedTable]?.name}
                phone={tableData[selectedTable]?.phone}
                inputValue={tableData[selectedTable]?.inputValue}
              />
            </div>
          </div>
        </ScrollPanel>
      </div>
    </>
  );
}
