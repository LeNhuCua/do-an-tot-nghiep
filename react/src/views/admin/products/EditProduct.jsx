import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  useForm } from "react-hook-form";
import { CascadeSelect } from "primereact/cascadeselect";


import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";
import { Toast } from "primereact/toast";

import { API, API_IMAGES } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext";


import { AiOutlinePlus } from "react-icons/ai";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias";
import Loading from "../../../components/Loading";
import { InputNumber } from "primereact/inputnumber";
import { Editor } from "primereact/editor";

import UploadImages from "../../../components/admin/products/UploadImages.jsx";

import { Accordion, AccordionTab } from "primereact/accordion";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";


const EditProduct = () => {
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
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesCurrent, setImagesCurrent] = useState(null);

  const [imageCurrent, setImageCurrent] = useState(null);
  const [image, setImage] = useState([]);

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="cs-text-error">{errors[name].message}</small>
    ) : (
      <small className="">&nbsp;</small>
    );
  };
  const navigate = useNavigate();
  const toast = useRef(null);

  const [loading, setLoading] = useState(true);

  const { state, dispatch } = useContext(DataContext);

  const { categories, products, typeCategories, units, productsType, sizes } =
    state;

  const getID = useParams().id;

  const [product, setProduct] = useState(null);

  const [description, setDescription] = useState(null);

  const [productSize, setProductSize] = useState([]);

  const [number, setNumber] = useState(null);
  const [dataWeight, setDataWeight] = useState([]);
  const fetchSizes = async () => {
    await axiosClient.get(`${API}/api/sizes/`).then(({ data }) => {
      dispatch({ type: "FETCH_SIZES", payload: data });
    });
  };
  useEffect(() => {
    if (sizes.length === 0) {
      fetchSizes();
    }
  }, []);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/products/${getID}`);
        setProduct(data.product);

        // setImages(data.product.product_image);
        setDescription(data.product.description);

        setImageCurrent(data.product.avatar);
        setImagesCurrent(data.product.product_image);
        setProductSize(data.product.product_size);
        setLoading(false);
        console.log(data.product.product_size);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchtypeCategories = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/typeCategories/`);
        dispatch({ type: "FETCH_TYPECATEGORIES", payload: data });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCategories = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/categories/`);
        dispatch({ type: "FETCH_CATEGORIES", payload: data });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUnits = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/units/`);
        dispatch({ type: "FETCH_UNITS", payload: data });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTypes = async () => {
      try {
        const { data } = await axiosClient.get(`${API}/api/productsType/`);
        dispatch({ type: "FETCH_PRODUCTSTYPE", payload: data });
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();

    fetchtypeCategories();
    fetchCategories();
    if (units.length === 0) {
      fetchUnits();
    }
    if (productsType.length === 0) {
      fetchTypes();
    }
  }, []);

  const [validationError, setValidationError] = useState([]);

  const [selectedTypeCategory, setSelectedTypeCategory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const fetchProductsAll = async () => {
    await axiosClient.get(`${API}/api/products/`).then(({ data }) => {
      dispatch({ type: "FETCH_PRODUCTS", payload: data });
    });
  };

  const [alreadyExistName, setAlreadyExistName] = useState(null);
  function getPrefix(str) {
    return str.substring(0, str.indexOf("-"));
  }
  function convertString(str) {
    // Sử dụng biểu thức chính quy để tìm kiếm các phần tử số và chữ cái trong chuỗi
    const regex = /(\d+)\.?(\d*)\s?([a-zA-Z]+)/;
    // Sử dụng hàm replace để thay thế chuỗi cần chuyển đổi
    return str.replace(regex, (match, p1, p2, p3) => {
      // Loại bỏ tất cả các khoảng trắng
      p3 = p3.replace(/\s+/g, "");
      // Nếu p2 là chuỗi rỗng (không có phần thập phân) thì trả về chuỗi "p1p3"
      if (!p2) {
        return `${p1}${p3}`;
      }
      // Nếu p2 khác rỗng (có phần thập phân) thì trả về chuỗi "p1p3p2"
      return `${p1}${p3}${p2}`;
    });
  }
  //tìm kiếm loại sản phẩm được chọn dựa vào bí danh và lấy lại dữ liệu nếu dữ liệu chưa tồn tại
  const updateData = async (data) => {
    // const sizeData = Object.keys(data).reduce((acc, key) => {
    //   if (key.includes("size")) {
    //     acc.push(data[key]);
    //   }
    //   return acc;
    // }, []);
    // console.log(sizeData);
    const newFormData = new FormData();
    newFormData.append("name", data.name);

    newFormData.append("description", description);

    newFormData.append("alias", convertNameWithoutAccents(data.name));
    newFormData.append("status", checked ? 1 : 0);
    newFormData.append("avatar", image);
    // if (image1 !== null) {
    //   newFormData.append("image1", image1);
    // }

    newFormData.append(
      "productTypeId",
      selectedType ? selectedType.productTypeId : product.productTypeId
    );

    newFormData.append(
      "unitId",
      selectedUnit ? selectedUnit.unitId : product.unitId
    );

    newFormData.append(
      "typeCategoryId",
      selectedTypeCategory
        ? selectedTypeCategory.typeCategoryId
        : product.typeCategoryId
    );
    for (let i = 0; i < images.length; i++) {
      newFormData.append(`images[${i}]`, images[i]);
    }
    for (let i = 0; i < dataWeight.length; i++) {
      newFormData.append(`sizes[${i}]`, JSON.stringify(dataWeight[i]));
    }
    setSubmitted(true);
    await axiosClient
      .post(`${API}/api/products/${getID}`, newFormData)
      .then((response) => {
        if (response.data.status === 201) {
          const alreadyExist = products.find(
            (product) => product.name === data.name
          );
          if (alreadyExist) setAlreadyExistName("Tên sản phẩm đã tồn tại");
        } else if (response.data.status === 400) {
          if (data.productId !== product.productId) {
            fetchProductsAll();
          }
          // navigate("/quantri/sanpham");

          Swal.fire({
            icon: "success",
            title: "Thông tin đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          });
          setValidationError([]);
        } else if (response.data.status === 401) {
          Swal.fire({
            icon: "error",
            title: `Kích cỡ là ${response.data.alreadyExistSize.size[0].sizeValue} đã tồn tại`,
            timer: 1500,
          });
        } else {
          setValidationError(response.data.validation_error);
          Swal.fire({
            icon: "error",
            text: "Kiểm tra lại thông tin",
          });
        }
      });
  };

  let currentStatus = null;
  if (product) {
    currentStatus = product.status && product.status === 1 ? true : false;
  }
  const [checked, setChecked] = useState(null);
  useEffect(() => {
    setChecked(currentStatus);
  }, [currentStatus]);

  //lấy id và name của danh mục con sản phẩm
  // const getFilteredCategory = (typeCategories, typeCategoryId) => {
  //   const filteredCategory = typeCategories
  //     .filter((category) => category.typeCategoryId !== typeCategoryId)
  //     .map((category) => ({
  //       typeCategoryId: category.typeCategoryId,
  //       name: category.name,
  //     }));
  //   return filteredCategory;
  // };

  // //units

  // const getFilteredUnits = (units, unitId) => {
  //   const filteredUnit = units
  //     .filter((unit) => unit.unitId !== unitId)
  //     .map((unit) => ({
  //       unitId: unit.unitId,
  //       name: unit.name,
  //     }));
  //   return filteredUnit;
  // };

  // const filteredUnits = useMemo(() => {
  //   return getFilteredUnits(units, product ? product.unit.unitId : "");
  // }, [units, product ? product.unit.unitId : ""]);

  // //type

  // const getFilteredTypes = (productsType, productTypeId) => {
  //   const filteredType = productsType
  //     .filter((type) => type.productTypeId !== productTypeId)
  //     .map((type) => ({
  //       productTypeId: type.productTypeId,
  //       name: type.name,
  //     }));
  //   return filteredType;
  // };

  // const filteredType = useMemo(() => {
  //   return getFilteredTypes(
  //     productsType,
  //     product ? product.product_type.productTypeId : ""
  //   );
  // }, [productsType, product ? product.product_type.productTypeId : ""]);

  //
  const getFilteredData = (data, filterId, idProperty, nameProperty) => {
    const filteredData = data
      .filter((item) => item[idProperty] !== filterId)
      .map((item) => ({
        [idProperty]: item[idProperty],
        [nameProperty]: item[nameProperty],
      }));
    return filteredData;
  };

  const filteredCategory = useMemo(() => {
    return getFilteredData(
      typeCategories,
      product ? product.type_category.typeCategoryId : "",
      "typeCategoryId",
      "name"
    );
  }, [typeCategories, product ? product.type_category.typeCategoryId : ""]);

  const filteredType = useMemo(() => {
    return getFilteredData(
      productsType,
      product ? product.product_type.productTypeId : "",
      "productTypeId",
      "name"
    );
  }, [productsType, product ? product.product_type.productTypeId : ""]);

  //dữ liệu hiên thị trong dropdown danh mục cha
  const categoryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <AiOutlinePlus />
        <div>{option.name}</div>
      </div>
    );
  };
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeAvatar, setActiveAvatar] = useState(false);
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
      setImageCurrent(URL.createObjectURL(event.target.files[0]));
      setActiveAvatar(true);
    } else {
      setActiveAvatar(true);
    }
  };

  const panelFooterTemplate = () => {
    const length = selectedSizes ? selectedSizes.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> Size được chọn.
      </div>
    );
  };
  const [selectedSizes, setSelectedSizes] = useState(null);
  const [selectedUnitItem, setSelectedUnitItem] = useState(null);

  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");

  const addDataWeight = () => {
    if (
      price !== "" &&
      weight !== "" &&
      selectedUnitItem !== null &&
      selectedSizes !== null &&
      number !== ""
    ) {
      const newTodo = dataWeight.concat({
        price: Number(price),
        unitId: selectedUnitItem.unitId,
        unitName: selectedUnitItem.name,
        weight: Number(weight),
        sizeId: selectedSizes.sizeId,
        sizeValue: selectedSizes.sizeValue,
        number: Number(number),
      });
      const findSizeId = dataWeight.find(
        (item) => selectedSizes.sizeId === item.sizeId
      );
      if (findSizeId) {
        Swal.fire({
          icon: "error",
          title: `Kích thước ${findSizeId.sizeValue} đã tồn tại, vui lòng chọn kích thước khác`,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        setDataWeight(newTodo);
      }

      // setPrice("");
      // setWeight("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Vui lòng điền đầy đủ các trường!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const deleteWeight = (id) => {
    const newTodo = dataWeight.filter((item) => id != item.sizeId);
    setDataWeight(newTodo);
  };

  const deleteSize = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Bạn có chắc muốn xoá kích thước  này?",
      text: "Không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    await axiosClient
      .delete(`http://localhost:8000/api/productsSize/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });

        const img = productSize.filter(
          (productSize) => productSize.productSizeId !== id
        );
        setProductSize(img);
        // fetchProducts();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };
  const ListBreadcrumb = [
    {
      name: "Quản lý sản phẩm",
      link: "/quantri/sanpham",
    },
    {
      name: product ? product.name : "",
    },
  ];

  return (
    <div className="container">
       <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <Toast ref={toast} />
      {loading && <Loading />}
      {product ? (
        <CForm onSubmit={handleSubmit(updateData)} className="row g-4">
          <div className=" flex justify-content-end">
            <ToggleButton
              onLabel="Hiển thị"
              offLabel="Đang ẩn"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              checked={checked}
              className={checked ? "bg-success" : "bg-danger"}
              onChange={(e) => {
                setChecked(e.value);
              }}
            />
          </div>
          {/* <input type="file" onChange={changeHandler} /> */}

          <CCol md={6}>
            <span className="p-float-label ">
              <InputText
                id="name"
                // value={name}
                defaultValue={product ? product.name : null}
                className={`w-full ${errors.name && "invalid"}`}
                {...register("name", {
                  required: "Vui lòng nhập tên sản phẩm",
                  maxLength: {
                    value: 100,
                    message: "Giới hạn chỉ 100 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("name");
                }}
              />

              <label htmlFor="name">Tên sản phẩm</label>
            </span>
            {errors.name && (
              <small className="cs-text-error">{errors.name.message}</small>
            )}

            {alreadyExistName ? (
              <small className="cs-text-error">{alreadyExistName}</small>
            ) : (
              ""
            )}
          </CCol>
          <CCol xl={3}>
            <CascadeSelect
              value={selectedTypeCategory}
              onChange={(e) => setSelectedTypeCategory(e.value)}
              options={categories}
              field="name"
              optionLabel="name"
              optionGroupLabel="name"
              optionGroupChildren={["type_category"]}
              className="w-full md:w-14rem"
              breakpoint="767px"
              placeholder={product ? product.type_category.name : null}
              group="true"
            />
          </CCol>

          {/* <CCol xl={3}>
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Vui lòng nhập giá bán",
                validate: (value) =>
                  (value >= 0 && value <= 100000000) ||
                  "Vui lòng nhập giá từ 1.000 -> 100.000.000",
              }}
              render={({ field, fieldState }) => (
                <>
                  <span className="p-float-label ">
                    <InputNumber
                      mode="currency"
                      currency="VND"
                      locale="de-DE"
                      className="w-full"
                      id={field.name}
                      inputRef={field.ref}
                      value={price}
                      onBlur={field.onBlur}
                      onValueChange={(e) => {
                        field.onChange(e); // Cập nhật giá trị cho ô input
                        setPrice(e.target.value); // Lưu giá trị của ô input vào biến state yearValue
                      }}
                      inputClassName={classNames({
                        "p-invalid": fieldState.error,
                      })}
                      placeholder="Vd: 12,000,000 ₫"
                    />
                    <label htmlFor="price">Giá bán</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </CCol> */}

          {/* <CCol xl={3}>
            <Controller
              name="number"
              control={control}
              rules={{
                required: "Vui lòng nhập số lượng nhập",
                validate: (value) =>
                  (value >= 1 && value <= 100000000) ||
                  "Vui lòng nhập số lượng nhập từ 1 -> 100.000.000",
              }}
              render={({ field, fieldState }) => (
                <>
                  <span className="p-float-label ">
                    <InputNumber
                      className="w-full"
                      id={field.name}
                      inputRef={field.ref}
                      value={number}
                      onBlur={field.onBlur}
                      onValueChange={(e) => {
                        field.onChange(e); // Cập nhật giá trị cho ô input
                        setNumber(e.target.value); // Lưu giá trị của ô input vào biến state yearValue
                      }}
                      inputClassName={classNames({
                        "p-invalid": fieldState.error,
                      })}
                      placeholder="Vd: 12"
                    />
                    <label htmlFor="number">Số lượng nhập</label>
                  </span>
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </CCol> */}

          {/* <CCol xl={6} className="relative">
            <label
              className="absolute text-[0.75rem] -top-5 left-6 select-none z-50 text-[#6c757d]"
              htmlFor="typeCategory"
            >
              Menu cấp 2
            </label>
            <div className=" flex justify-content-center">
              <Dropdown
                value={selectedTypeCategory}
                onChange={(e) => setSelectedTypeCategory(e.value)}
                options={typeCategories}
                optionLabel="name"
                placeholder={product ? product.type_category.name : null}
                filter
                itemTemplate={categoryOptionTemplate}
                className="w-full md:w-14rem"
              />
            </div>
          </CCol> */}

          <CCol xl={3} className="relative">
            <label
              className="absolute text-[0.75rem] -top-5 left-6 select-none z-50 text-[#6c757d]"
              htmlFor="type"
            >
              Loại vàng
            </label>
            <div className=" flex justify-content-center">
              <Dropdown
                value={selectedType}
                onChange={(e) => setSelectedType(e.value)}
                options={productsType}
                optionLabel="name"
                placeholder={product ? product.product_type.name : null}
                filter
                itemTemplate={categoryOptionTemplate}
                className="w-full md:w-14rem"
              />
            </div>
          </CCol>

          <div>
            <h6>Ảnh bìa</h6>
            <Button
              outlined
              type="button"
              label="Chọn ảnh"
              icon="pi pi-upload"
              onClick={() => document.getElementById("fileInput").click()}
            />
            <input
              type="file"
              accept="image/*"
              onChange={changeHandler}
              id="fileInput"
              style={{ display: "none" }}
            />

            {image && activeAvatar ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
                <div className="flex justify-between items-center border p-3 rounded-md">
                  <img
                    className="w-28"
                    key={image.name}
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                  />
                  <h6>{image.name}</h6>
                </div>
              </div>
            ) : imageCurrent ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
                <div className="flex justify-between items-center border p-3 rounded-md">
                  <img className="w-28" src={`${API_IMAGES}/${imageCurrent}`} />
                  <h6>{imageCurrent}</h6>
                </div>
              </div>
            ) : (
              ""
            )}

            {validationError.avatar && (
              <small className="cs-text-error">Vui lòng chọn ảnh</small>
            )}
          </div>
          <CCol xl={12}>
            <h6>Mô tả chi tiết</h6>
            <Editor
              value={description}
              onTextChange={(e) => setDescription(e.htmlValue)}
              style={{ height: "320px" }}
            />
          </CCol>
          <div className="card py-2">
            <h6>Kích thước và trọng lượng</h6>
            <Accordion>
              <AccordionTab
                header={
                  <div className="flex align-items-center">
                    <i className="pi pi-credit-card mr-2"></i>
                    <span className="vertical-align-middle">
                      Kích thước và trọng lượng hiện tại
                    </span>
                  </div>
                }
              >
                <div className="grid gap-2 grid-cols-3  lg:grid-cols-3">
                  {productSize && productSize.map((size, index) => (
                    <div
                      className="border p-2 rounded-md relative"
                      key={size.productSizeId}
                    >
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-red-600"
                        onClick={() => deleteSize(size.productSizeId)}
                      >
                        Xoá
                      </button>
                      <h6>Kích thước: {size.size[0].sizeValue}</h6>
                      {/* <h6>Giá: {data.price}</h6> */}
                      <h6 className="">
                        Giá:{" "}
                        {new Intl.NumberFormat({
                          style: "currency",
                          currency: "JPY",
                        }).format(size.price)}
                        <span> VNĐ</span>
                      </h6>
                      <h6>Số lượng: {size.number}</h6>
                      <h6>
                        Trọng lượng: {size.weight} {size.unitName}
                      </h6>
                    </div>
                  ))}
                </div>
              
              </AccordionTab>
            </Accordion>
            <div className="my-2 p-2">
              <div className=" py-4 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-3 items-center">
                <div>
                  <Dropdown
                    value={selectedSizes}
                    onChange={(e) => setSelectedSizes(e.value)}
                    options={sizes}
                    optionLabel="sizeValue"
                    placeholder="Chọn kích cỡ"
                    filter
                    showClear
                    className="w-full md:w-14rem"
                  />
                </div>

                <div>
                  <span className="p-float-label ">
                    <InputNumber
                      id="price"
                      suffix=" VNĐ"
                      value={price}
                      onChange={(e) => setPrice(e.value)}
                      type="text"
                      placeholder="Vd: 1200000"
                      className="w-full md:w-14rem"
                    />

                    <label htmlFor="price">Giá bán</label>
                  </span>
                </div>
                <div>
                  <span className="p-float-label ">
                    <InputNumber
                      id="number"
                      // suffix=" VNĐ"
                      value={number}
                      onChange={(e) => setNumber(e.value)}
                      type="text"
                      placeholder="Vd: 12"
                      className="w-full md:w-14rem"
                    />

                    <label htmlFor="number">Số lượng nhập</label>
                  </span>
                </div>
                <div>
                  <span className="p-float-label ">
                    <InputText
                      keyfilter="num"
                      id="price1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      type="text"
                      placeholder="Vd: 1.200.000"
                      className="w-full md:w-14rem"
                    />
                    <label htmlFor="price1">Trọng lượng / Chiều dài</label>
                  </span>
                </div>
                <div>
                  <Dropdown
                    value={selectedUnitItem}
                    onChange={(e) => setSelectedUnitItem(e.value)}
                    options={units}
                    optionLabel="name"
                    placeholder="Chọn đơn vị tính"
                    filter
                    showClear
                    className="w-full md:w-14rem"
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    severity="success"
                    onClick={addDataWeight}
                    className="youtube p-0 w-full justify-center"
                  >
                    <i className="pi pi-plus"></i>
                    <span className="p-3">Thêm mới</span>
                  </Button>
                  {/* <button type="button" className="w-full" onClick={addDataWeight}>
              Thêm
            </button> */}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2 grid-cols-3  lg:grid-cols-3">
            {dataWeight.map((data) => (
              <div className="border p-2 rounded-md relative" key={data.sizeId}>
                <button
                  type="button"
                  className="absolute top-1 right-1 text-red-600"
                  onClick={() => deleteWeight(data.sizeId)}
                >
                  Xoá
                </button>
                <h6>Kích thước: {data.sizeValue}</h6>
                {/* <h6>Giá: {data.price}</h6> */}
                <h6 className="">
                  Giá:{" "}
                  {new Intl.NumberFormat({
                    style: "currency",
                    currency: "JPY",
                  }).format(data.price)}
                  <span> VNĐ</span>
                </h6>
                <h6>Số lượng: {data.number}</h6>
                <h6>
                  Trọng lượng: {data.weight} {data.unitName}
                </h6>
              </div>
            ))}
          </div>
          <CCol xl={12}>
            <h6>Ảnh liên quan</h6>
            <UploadImages
              imagesCurrent={imagesCurrent}
              setImagesCurrent={setImagesCurrent}
              images={images}
              setImages={setImages}
            />
          </CCol>
          <CCol xs={12}>
            <Button className="youtube p-0 w-full justify-center">
              <i className="pi pi-check"></i>
              <span className="p-3">Xác nhận</span>
            </Button>
          </CCol>
        </CForm>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditProduct;
