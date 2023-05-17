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

import { InputNumber } from "primereact/inputnumber";
import SearchProducts from "../../../components/admin/Invoices/SearchProducts";
import ComponentToPrint from "./ComponentToPrint";
import Bill from "../../../components/admin/Invoices/Bill";

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

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);
  const componentRef = useRef();
  const fetchProducts = async () => {
    await axios.get(`${API}/api/products/`).then(({ data }) => {
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

  const addToInvoice = (product, id) => {
    if (!invoices[selectedTable]) {
      setInvoices({ ...invoices, [selectedTable]: [] });
    }
    const newItem = { ...product, amount: 1 };
    const invoiceItem = invoices[selectedTable].find((item) => {
      return item.productId === id;
    });

    //nếu đã tồn tại
    if (invoiceItem) {
      const newInvoice = [...invoices[selectedTable]].map((item) => {
        if (item.productId === id) {
          return { ...item, amount: invoiceItem.amount + 1 };
        } else {
          return item;
        }
      });
      setInvoices({ ...invoices, [selectedTable]: newInvoice });
    } else {
      setInvoices({
        ...invoices,
        [selectedTable]: [...invoices[selectedTable], newItem],
      });
    }
  };

  const increaseAmount = (id) => {
    if (!invoices[selectedTable]) {
      return;
    }

    const invoiceItem = invoices[selectedTable].find((item) => {
      return item.productId === id;
    });

    //nếu đã tồn tại
    if (invoiceItem) {
      addToInvoice(invoiceItem, id);
    } else {
      const newItem = products.find((product) => product.productId === id);

      // kiểm tra newItem
      if (newItem) {
        addToInvoice(newItem, id);
      } else {
        console.error(`Product ${id} not found`);
      }
    }
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
  const removeFromInvoice = (id) => {
    const newInvoice = invoices[selectedTable].filter((item) => {
      return item.productId !== id;
    });
    setInvoices({ ...invoices, [selectedTable]: newInvoice });
  };

  const reduceAmount = (id) => {
    if (!invoices[selectedTable]) {
      return;
    }

    const invoiceItem = invoices[selectedTable].find((item) => {
      return item.productId === id;
    });

    //nếu đã tồn tại
    if (invoiceItem) {
      const newInvoice = invoices[selectedTable].map((item) => {
        if (item.productId === id) {
          return { ...item, amount: invoiceItem.amount - 1 };
        } else {
          return item;
        }
      });

      if (invoiceItem.amount < 2) {
        removeFromInvoice(id);
      } else {
        setInvoices({ ...invoices, [selectedTable]: newInvoice });
      }
    }
  };
  const [selectedSizes, setSelectedSizes] = useState({});
  let arrSelectedSizes = Object.entries(selectedSizes);

  const handleSizeSelection = (productId, size) => {
    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [productId]: size,
    }));
  };
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useStateContext();

  let result = {};

  for (let itemA of invoices[selectedTable]) {
    for (let itemB of arrSelectedSizes) {
      if (itemA.productId === itemB[1].productId) {
        let total = itemA.amount * itemB[1].price;
        if (!result[itemA.productId]) {
          result[itemA.productId] = {
            productId: itemA.productId,
            name: itemA.name,
            // price: itemA.price,
            // description: itemA.description,
            total: total,
            amount: itemA.amount,
            price: itemB[1].price,
            size: itemB[1].size[0].sizeValue,
            sizeId: itemB[1].size[0].sizeId,
          };
        } else {
          result[itemA.productId].total += total;
        }
      }
    }
  }

  let total = 0;

  let bill = Object.entries(result).map(([key, value]) => {
    total += value.total;
    return {
      ...value,
      productId: key,
    };
  });
  console.log(bill);

  // for (let item of bill) {
  //   // kiểm tra prop là thuộc tính của obj chứ không phải của prototype
  //   total += item.price * item.amount;
  // }

  localStorage.setItem("total", total);

  // localStorage.setItem("total", total);
  console.log(total); // Output: 9600000

  useEffect(() => {
    setTotalAmount(localStorage.getItem("total"));
  }, [invoices[selectedTable], total]); // Add the invoices state as a dependency
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
  const CreateInvoice = async () => {
    const formData = new FormData();
    formData.append("totalAmount", totalAmount);
    formData.append("fullName", tableData[selectedTable]?.name);
    formData.append("phoneNumber", tableData[selectedTable]?.phone);
    formData.append("userId", user.userId);
    // for (let i = 0; i < invoices[selectedTable].length; i++) {
    //   formData.append(
    //     `invoices[${selectedTable}][${i}]`,
    //     JSON.stringify(invoices[selectedTable][i])
    //   );
    // }
    for (let i = 0; i < bill.length; i++) {
      formData.append(`bills[${i}]`, JSON.stringify(bill[i]));
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
    await axios.post(`${API}/api/invoices`, formData).then((response) => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
      <ScrollPanel className="col-span-3 h-[100vh]">
        <div className="relative">
          <SearchProducts products={products} addToInvoice={addToInvoice} />
        </div>
        <Fieldset legend={legendTemplate} className="mt-4">
          <div className="grid grid-cols-3 lg:grid-cols-4  gap-3">
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

              // <button
              //   className={`border p-2   ${
              //     i + 1 === selectedTable
              //       ? "bg-blue-500 text-white font-bold"
              //       : ""
              //   }  ${invoices[i + 1].length > 0 ? "bg-green-300" : ""}`}
              //   onClick={() => setSelectedTable(i + 1)}
              // >
              //   Hoá đơn {i + 1}
              // </button>
            ))}
          </div>
        </Fieldset>{" "}
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
                    invoices[selectedTable].map((c) => (
                      <Bill
                        key={c.productId}
                        c={c}
                        removeFromInvoice={removeFromInvoice}
                        increaseAmount={increaseAmount}
                        reduceAmount={reduceAmount}
                        selectedSize1={selectedSizes[c.productId]}
                        handleSizeSelection={(size) =>
                          handleSizeSelection(c.productId, size)
                        }
                      />
                    ))
                  ) : (
                    <h4>
                      <ImFileEmpty /> Hoá đơn trống
                    </h4>
                  )}
                  {totalAmount != 0 ? (
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
                      {totalAmount && tableData[selectedTable]?.inputValue ? (
                        <div className="flex justify-between text-base font-medium text-gray-900">
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
                      keyfilter="int"
                      type="text"
                      className="w-full"
                      placeholder="Vd: 0999999999"
                      value={tableData[selectedTable]?.phone || ""}
                      onChange={(e) => handlePhoneChange(e, selectedTable)}
                      // useGrouping={false}
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
                  invoices[selectedTable].map((c) => (
                    <Bill
                      c={c}
                      key={c.productId}
                      removeFromInvoice={removeFromInvoice}
                      increaseAmount={increaseAmount}
                      reduceAmount={reduceAmount}
                      selectedSize1={selectedSizes[c.productId]}
                      handleSizeSelection={(size) =>
                        handleSizeSelection(c.productId, size)
                      }
                    />
                  ))
                ) : (
                  <h4>
                    <ImFileEmpty /> Hoá đơn trống
                  </h4>
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
                    {totalAmount && tableData[selectedTable]?.inputValue ? (
                      <div className="flex justify-between text-base font-medium text-gray-900">
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
          <div className={`${invoices[selectedTable].length ? "" : "hidden"}`}>
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
                  <InputNumber
                    className="w-full"
                    placeholder="Vd: 0999999999"
                    value={tableData[selectedTable]?.phone || ""}
                    onValueChange={(e) => handlePhoneChange(e, selectedTable)}
                    useGrouping={false}
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
              ref={componentRef}
              bill={bill}
              // invoices={invoices[selectedTable]}
              // selectedSizes={arrSelectedSizes}
              totalAmount={totalAmount}
              name={tableData[selectedTable]?.name}
              phone={tableData[selectedTable]?.phone}
              inputValue={tableData[selectedTable]?.inputValue}
            />
          </div>
        </div>
      </ScrollPanel>
    </div>
  );
}
