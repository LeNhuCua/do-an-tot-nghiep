import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { CascadeSelect } from "primereact/cascadeselect";

import axios from "axios";

import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";
import { Toast } from "primereact/toast";

import { API, API_IMAGES } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext";

import { classNames } from "primereact/utils";

import { AiOutlinePlus } from "react-icons/ai";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias";
import Loading from "../../../components/Loading";
import { InputNumber } from "primereact/inputnumber";
import { Editor } from "primereact/editor";

import UploadAvatar from "../../../components/admin/products/UploadAvatar.jsx";
import UploadImages from "../../../components/admin/products/UploadImages.jsx";
import { MultiSelect } from "primereact/multiselect";
// import UploadImages from "../../../components/admin/uploadimages/UploadImages";

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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products/${getID}`);
        setProduct(data.product);

        // setImages(data.product.product_image);
        setDescription(data.product.description);
        setNumber(data.product.number);
        setImageCurrent(data.product.avatar);
        setImagesCurrent(data.product.product_image);
        setProductSize(data.product.product_size);
        setLoading(false);
        console.log(data.product.product_size);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(productSize);
    const fetchtypeCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/api/typeCategories/`);
        dispatch({ type: "FETCH_TYPECATEGORIES", payload: data });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/api/categories/`);
        dispatch({ type: "FETCH_CATEGORIES", payload: data });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUnits = async () => {
      try {
        const { data } = await axios.get(`${API}/api/units/`);
        dispatch({ type: "FETCH_UNITS", payload: data });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTypes = async () => {
      try {
        const { data } = await axios.get(`${API}/api/productsType/`);
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
    await axios.get(`${API}/api/products/`).then(({ data }) => {
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
    const sizeData = Object.keys(data).reduce((acc, key) => {
      if (key.includes("size")) {
        acc.push(data[key]);
      }
      return acc;
    }, []);
    console.log(sizeData);
    const newFormData = new FormData();
    newFormData.append("name", data.name);
    newFormData.append("number", data.number);
    newFormData.append("description", description);

    newFormData.append("weight", data.weight);
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
    setSubmitted(true);
    await axios
      .post(`${API}/api/products/${getID}`, newFormData)
      .then((response) => {
        if (response.data.status === 201) {
          const alreadyExist = products.find(
            (product) => product.name === data.name
          );
          if (alreadyExist) setAlreadyExistName("Tên sản phẩm đã tồn tại");
        } else if (response.data.status === 400) {
          const resData = response.data.product;
          const resImages = response.data.productImages;
          const product_image = resImages.map((image) => ({
            productImageId: image.productImageId,
            image: image.image,
            productId: image.productId,
          }));
          const allProductImage = product_image.concat(resData.product_image);

          const updatedProducts = {
            productId: resData.productId,
            name: resData.name,
            alias: resData.alias,
            status: checked ? 1 : 0,
            avatar: resData.avatar,
            weight: resData.weight,
            description: resData.description,
            number: resData.number,
            product_type: {
              name: selectedType ? selectedType.name : product.name,
            },
            type_category: {
              name: selectedTypeCategory
                ? selectedTypeCategory.name
                : product.name,
            },
            unit: {
              name: selectedUnit ? selectedUnit.name : product.name,
            },
            product_image: allProductImage,
          };

          dispatch({
            type: "UPDATE_PRODUCT",
            payload: updatedProducts,
          });
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

  const filteredUnits = useMemo(() => {
    return getFilteredData(
      units,
      product ? product.unit.unitId : "",
      "unitId",
      "name"
    );
  }, [units, product ? product.unit.unitId : ""]);

  const filteredType = useMemo(() => {
    return getFilteredData(
      productsType,
      product ? product.product_type.productTypeId : "",
      "productTypeId",
      "name"
    );
  }, [productsType, product ? product.product_type.productTypeId : ""]);

  useEffect(() => {
    setValue("number", number);
    // Cập nhật giá trị mặc định cho ô input
  }, [setValue, number]);

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

  const [selectedSizes, setSelectedSizes] = useState(null);
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
  return (
    <div className="container">
      {/* <div className="card flex justify-content-center">
        <CCol md={6}>
          <CascadeSelect
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={categories}
            optionLabel="name"
            optionGroupLabel="name"
            optionGroupChildren={["typeCategory"]}
            className="w-full md:w-14rem"
            breakpoint="767px"
            placeholder="Select a City"
            group
          />
        </CCol>
      </div> */}
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
          {productSize
            ? productSize.map((size, index) => (
                <div key={index} onClick={() => alert(size.productSizeId)}>
                  <p>{size.size[0].sizeValue}</p>
                  <InputText
                    id={`size-${index}`}
                    defaultValue={size.price}
                    className={`w-full ${errors[`size${index}`] && "invalid"}`}
                    {...register(`size${index}`, {
                      required: "Vui lòng nhập tên sản phẩm",
                      maxLength: {
                        value: 50,
                        message: "Giới hạn chỉ 50 kí tự",
                      },
                    })}
                    onKeyUp={() => {
                      trigger(`size${index}`);
                    }}
                  />
                </div>
              ))
            : ""}

          <div className="card flex justify-content-center">
            <MultiSelect
              filter
              value={selectedSizes}
              options={sizes}
              onChange={(e) => setSelectedSizes(e.value)}
              optionLabel="sizeValue"
              placeholder="Chọn kích thước"
              itemTemplate={countryTemplate}
              panelFooterTemplate={panelFooterTemplate}
              className="w-full md:w-20rem"
              display="chip"
            />
          </div>
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
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
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
          <CCol xl={6}>
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
          </CCol>

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

          <CCol xl={6} className="relative">
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

          <CCol xl={3}>
            <span className="p-float-label ">
              <InputText
                defaultValue={product ? product.weight : null}
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
          </CCol>
          <CCol xl={3} className="relative">
            <label
              className="absolute text-[0.75rem] -top-5 left-6 select-none z-50 text-[#6c757d]"
              htmlFor="unit"
            >
              Đơn vị tính
            </label>

            <div className=" flex justify-content-center">
              <Dropdown
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.value)}
                options={units}
                optionLabel="name"
                placeholder={product ? product.unit.name : null}
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
