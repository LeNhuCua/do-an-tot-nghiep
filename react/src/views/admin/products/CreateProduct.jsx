import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import axios from "axios";

import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
// import {API} from "../../../API";
import { API } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";

import { AutoComplete } from "primereact/autocomplete";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias";

import UploadImage from "../../../components/admin/uploadimages/UploadImage";
import Tippy from "@tippyjs/react";
import { Dialog } from "primereact/dialog";
import { CreateProductType } from "../../../components/admin/productstype";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import UploadImages from "../../../components/admin/uploadimages/UploadImages.jsx";
import { CascadeSelect } from "primereact/cascadeselect";
import { MultiSelect } from "primereact/multiselect";
import { forEach } from "lodash";

export default function CreateProduct() {
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
  const [description, setDescription] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { typeCategories, productsType, units, categories, sizes } = state;
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const fetchSizes = async () => {
    await axios.get(`${API}/api/sizes/`).then(({ data }) => {
      dispatch({ type: "FETCH_SIZES", payload: data });
    });
  };
  useEffect(() => {
    if (sizes.length === 0) {
      fetchSizes();
    }
  }, []);

  const fetchUnits = async () => {
    await axios.get(`${API}/api/units/`).then(({ data }) => {
      dispatch({ type: "FETCH_UNITS", payload: data });
    });
  };
  useEffect(() => {
    if (units.length === 0) {
      fetchUnits();
    }
  }, []);

  const fetchProductsType = async () => {
    await axios.get(`${API}/api/productsType/`).then(({ data }) => {
      dispatch({ type: "FETCH_PRODUCTSTYPE", payload: data });
    });
  };
  useEffect(() => {
    if (productsType.length === 0) {
      fetchProductsType();
    }
  }, []);

  const fetchTypeCategories = async () => {
    await axios.get(`${API}/api/typeCategories/`).then(({ data }) => {
      dispatch({ type: "FETCH_TYPECATEGORIES", payload: data });
    });
  };
  const fetchCategories = async () => {
    await axios.get(`${API}/api/categories/`).then(({ data }) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
    });
  };
  useEffect(() => {
    fetchTypeCategories();

    fetchCategories();
  }, []);

  // useEffect(() => {
  //   fetchTypeCategories();
  // }, []);
  const [images, setImages] = useState([]);
  const [validationError, setValidationError] = useState([]);

  const [selectedSizes, setSelectedSizes] = useState(null);

  console.log(selectedSizes);
  const countryTemplate = (option) => {
    const handleInputChange = (event) => {
      const value = event.value;
      const updatedSizes = [...selectedSizes];
      const index = updatedSizes.findIndex(
        (country) => country.sizeId === option.sizeId
      );
      updatedSizes[index]["price"] = value;
      setSelectedSizes(updatedSizes);
    };

    return (
      <div className="flex gap-3 align-items-center">
        <img
          alt={option.sizeId}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          // className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.sizeValue}</div>
        {/* <input
          type="text"
          value={option.price || ""}
          onChange={handleInputChange}
        /> */}

        <InputNumber
          suffix=" VNĐ"
          value={option.price || ""}
          onChange={handleInputChange}
          placeholder="Nhập giá tiền tương ứng size"
        />
      </div>
    );
  };

  const panelFooterTemplate = () => {
    const length = selectedSizes ? selectedSizes.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> Size được chọn.
      </div>
    );
  };
  // function convertString(str) {
  //   return str.replace(/(\d+)\.(\d+) (\w+)/, "$1$3$2");
  // }

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
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [number, setNumber] = useState("");
  const [dataWeight, setDataWeight] = useState([]);

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

  console.log(dataWeight);
  const CreateProducts = async (data) => {
    if (dataWeight.length > 0) {
      const formData = new FormData();
      const alias =
        convertNameWithoutAccents(data.name) +
        "-" +
        selectedTypeCategoryItem.typeCategoryId +
        "-" +
        selectedProductTypeItem.productTypeId;
      formData.append("name", data.name);
      formData.append("alias", alias.toLowerCase());
      formData.append("status", statusSelect ? statusSelect.code : 1);
      formData.append(
        "typeCategoryId",
        selectedTypeCategoryItem.typeCategoryId
      );
      formData.append("productTypeId", selectedProductTypeItem.productTypeId);

      formData.append("avatar", image);
      formData.append("description", description);
      formData.append("number", number);

      for (let i = 0; i < images.length; i++) {
        formData.append(`images[${i}]`, images[i]);
      }
      for (let i = 0; i < dataWeight.length; i++) {
        formData.append(`sizes[${i}]`, JSON.stringify(dataWeight[i]));
      }
      // JSON.stringify(invoices[selectedTable][i])
      setSubmitted(true);
      await axios.post(`${API}/api/products`, formData).then((response) => {
        if (response.data.status === 400) {
          const resData = response.data.product;
          const resImages = response.data.productImages;
          const resSizes = response.data.productSizes;
          const resSizesValue = response.data.sizesValue;
          console.log(resSizes);
          const createProducts = {
            productId: resData.productId,
            name: resData.name,
            alias: resData.alias,
            status: statusSelect ? statusSelect.code : 1,
            avatar: resData.avatar,

            price: resData.price,
            description: resData.description,
            number: resData.number,
            product_type: {
              name: selectedProductTypeItem.name,
            },
            type_category: {
              name: selectedTypeCategoryItem.name,
            },

            product_image: resImages.map((image) => ({
              name: image.productImageId,
              image: image.image,
              productId: image.productId,
            })),
            product_size: resSizes.map((size) => ({
              sizeId: size.sizeId,
              price: size.price,
              // size: resSizesValue.map((size) => ({
              //   sizeValue: size,
              // })),
              size: resSizesValue.forEach((value) => ({
                sizeValue: value,
              })),
            })),
          };

          // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context
          dispatch({ type: "ADD_PRODUCTS", payload: createProducts });
          Swal.fire({
            icon: "success",
            title: "Thêm mới thành công!",
            showConfirmButton: false,
            timer: 1500,
          });
          // navigate("/quantri/sanpham");

          // reset();
          setImage(null);
          setValidationError([]);
        } else {
          setValidationError(response.data.validation_error);
          Swal.fire({
            icon: "error",
            text: "Vui lòng kiểm tra lại thông tin!",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Bạn cần ít nhất 1 trường về thông tin về khối lượng và kích cỡ!",
      });
    }
  };
  const [statusSelect, setStatusSelect] = useState(null);
  const [visible, setVisible] = useState(false);
  const status = [
    { name: "Hiển thị", code: 1 },
    { name: "Ẩn", code: 0 },
  ];

  //danh mục
  const [selectedTypeCategoryItem, setSelectedTypeCategoryItem] =
    useState(null);

  // loại
  const [selectedProductTypeItem, setSelectedProductTypeItem] = useState(null);
  const [filteredItems1, setFilteredItems1] = useState(null);

  const searchItems1 = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
    let query = event.query;
    let _filteredItems = [];

    for (let i = 0; i < productsType.length; i++) {
      let item = productsType[i];
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        _filteredItems.push(item);
      }
    }
    setFilteredItems1(_filteredItems);
  };

  // loại
  const [selectedUnitItem, setSelectedUnitItem] = useState(null);
  const [filteredUnitItems, setFilteredUnitItems] = useState(null);

  const searchUnitItems = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
    let query = event.query;
    let _filteredItems = [];

    for (let i = 0; i < units.length; i++) {
      let item = units[i];
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        _filteredItems.push(item);
      }
    }
    setFilteredUnitItems(_filteredItems);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="cs-text-error">{errors[name].message}</small>
    ) : (
      <small className="">&nbsp;</small>
    );
  };
  const [image, setImage] = useState("");
  const regexPattern =
    /^[^\s\u0103\u0105\u1EA1\u1EAD\u00E2\u00E0\u00E1\u1EA3\u1EA7\u1EA5\u1EAB\u1EA9\u0103\u0105\u1EA3\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E2\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E0\u00E1\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00EA\u00E8\u00E9\u1EC1\u1EBF\u1EC5\u1EC3\u1EC7\u00EA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\u00E8\u00E9\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]+$/;

  return (
    <div className="container">
      <CForm
        encType="multipart/form-data"
        onSubmit={handleSubmit(CreateProducts)}
        className="row g-4 relative"
      >
        <CCol xl={6}>
          <span className="p-float-label ">
            <InputText
              id="name"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("name", {
                required: "Vui lòng nhập tên sản phẩm",
              })}
              onKeyUp={() => {
                trigger("name");
              }}
              type="text"
              placeholder="Vd: Nhẫn Nữ Vàng"
            />
            <label htmlFor="name">Tên sản phẩm</label>
          </span>

          {errors.name && (
            <small className="cs-text-error">{errors.name.message}</small>
          )}
          {validationError.name && (
            <small className="cs-text-error">Tên sản phẩm đã tồn tại</small>
          )}
        </CCol>
        <CCol xl={6}>
          <Controller
            name="typeCategoryId"
            control={control}
            rules={{ required: "Vui lòng chọn danh mục trong danh sách" }}
            defaultValue=""
            render={({ field }) => (
              <CascadeSelect
                {...field}
                value={selectedTypeCategoryItem}
                onChange={(e) => {
                  setSelectedTypeCategoryItem(e.value);
                  setValue("typeCategoryId", e.value.typeCategoryId);
                }}
                options={categories}
                field="name"
                optionLabel="name"
                optionGroupLabel="name"
                optionGroupChildren={["type_category"]}
                className="w-full md:w-14rem"
                breakpoint="767px"
                placeholder="Chọn menu"
                group
              />
            )}
          />

          {errors.typeCategoryId && (
            <small className="cs-text-error">
              {errors.typeCategoryId.message}
            </small>
          )}
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
        {/* 
        <CCol xl={3}>
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

        {/* <CCol xl={6}>
          <Controller
            name="typeCategoryId"
            control={control}
            rules={{ required: "Vui lòng chọn danh mục trong danh sách" }}
            defaultValue=""
            render={({ field }) => (
              <AutoComplete
                {...field}
                value={selectedTypeCategoryItem}
                suggestions={filteredItems}
                completeMethod={searchItems}
                field="name"
                dropdown
                onChange={(e) => {
                  setSelectedTypeCategoryItem(e.value);
                  setValue("typeCategoryId", e.value.typeCategoryId);
                }}
                placeholder="Chọn danh mục sản phẩm"
                className={`w-full ${errors.typeCategoryId && "invalid"}`}
              />
            )}
          />

          {errors.typeCategoryId && (
            <small className="cs-text-error">
              {errors.typeCategoryId.message}
            </small>
          )}
        </CCol> */}

        <CCol xl={6}>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Controller
                name="productTypeId"
                control={control}
                rules={{
                  required: "Vui lòng chọn loại sản phẩm trong danh sách",
                }}
                defaultValue=""
                render={({ field }) => (
                  <AutoComplete
                    {...field}
                    value={selectedProductTypeItem}
                    suggestions={filteredItems1}
                    completeMethod={searchItems1}
                    field="name"
                    dropdown
                    onChange={(e) => {
                      setSelectedProductTypeItem(e.value);
                      setValue("productTypeId", e.value.productTypeId);
                    }}
                    placeholder="Chọn loại sản phẩm"
                    className={`w-full ${errors.productTypeId && "invalid"}`}
                  />
                )}
              />
              <Tippy content="Thêm loại sản phẩm">
                <Button
                  icon="pi pi-plus"
                  rounded
                  outlined
                  type="button"
                  severity="success"
                  aria-label="Search"
                  onClick={() => setVisible(true)}
                />
              </Tippy>
            </div>

            {errors.productTypeId && (
              <small className="cs-text-error">
                {errors.productTypeId.message}
              </small>
            )}
          </div>
        </CCol>
        {/* <CCol xl={3}>
          <span className="p-float-label ">
            <InputText
              keyfilter="num"
              id="weight"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("weight", {
                required: "Vui lòng nhập trọng lượng",
              })}
              onKeyUp={() => {
                trigger("weight");
              }}
              type="text"
              placeholder="Vd: 1.3"
            />
            <label htmlFor="weight">Trọng lượng</label>
          </span>

          {errors.weight && (
            <small className="cs-text-error">{errors.weight.message}</small>
          )}
        </CCol> */}

        <CCol xl={4}>
          <Dropdown
            value={statusSelect}
            onChange={(e) => setStatusSelect(e.value)}
            options={status}
            optionLabel="name"
            className="w-full md:w-14rem"
            placeholder="Chọn hiển thị (Mặc định: Hiển thị)"
          />
        </CCol>

        <div>
          <h6>Ảnh bìa</h6>
          <CCol>
            <UploadImage
              submitted={submitted}
              image={image}
              setImage={setImage}
            />
          </CCol>
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
        <div>
          <h6>Ảnh liên quan</h6>
          <UploadImages images={images} setImages={setImages} />
        </div>
        <h6>Thông tin về khối lượng và kích cỡ</h6>
        <div className="border py-4 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-3 items-center">
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

        <CCol xs={12}>
          <Button className="youtube p-0 w-full justify-center">
            <i className="pi pi-check"></i>
            <span className="p-3">Xác nhận</span>
          </Button>
        </CCol>
      </CForm>
      <CreateProductType visible={visible} setVisible={setVisible} />
    </div>
  );
}
