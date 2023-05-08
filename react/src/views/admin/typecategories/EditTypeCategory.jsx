import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import axios from "axios";

import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";
import { Toast } from "primereact/toast";

import { API } from "../../../API.js";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext.jsx";

import { AiOutlinePlus } from "react-icons/ai";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import Loading from "../../../components/Loading.jsx";

const EditTypeCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const toast = useRef(null);

  const [loading, setLoading] = useState(true);

  const { state, dispatch } = useContext(DataContext);

  const { categories, typeCategories } = state;

  const getID = useParams().id;

  const [typeCategory, setTypeCategory] = useState(null);

  useEffect(() => {
    const fetchTyCategory = async () => {
      try {
        const { data } = await axios.get(`${API}/api/typeCategories/${getID}`);
        setTypeCategory(data.typeCategory);
        setLoading(false);
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

    fetchTyCategory();
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  //lấy dữ liệu của danh mục sản phẩm và loại sản phẩm
  // const fetchInitialData = async () => {
  //   const [categoryRes, productsTypeRes] = await Promise.all([
  //     axios.get(`${API}/api/categories/`),
  //     axios.get(`${API}/api/productsType/`),
  //   ]);

  //   dispatch({ type: "FETCH_CATEGORIES", payload: categoryRes.data });
  //   // dispatch({ type: "FETCH_PRODUCTSTYPE", payload: productsTypeRes.data });
  // };

  // useEffect(() => {
  //   fetchInitialData();
  // }, []);

  //lấy thông số bí danh từ url

  //tạo các biến để lấy dữ liệu của loại sản phẩm được chọn

  const [validationError, setValidationError] = useState([]);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchTypeCategoriesAll = async () => {
    await axios.get(`${API}/api/typeCategories/`).then(({ data }) => {
      dispatch({ type: "FETCH_TYPECATEGORIES", payload: data });
    });
  };
  const [alreadyExistName, setAlreadyExistName] = useState(null);

  //tìm kiếm loại sản phẩm được chọn dựa vào bí danh và lấy lại dữ liệu nếu dữ liệu chưa tồn tại
  const updateData = async (data) => {
    console.log(
      selectedCategory ? selectedCategory.name : typeCategory.category.name
    );
    const formData = {
      _method: "PATCH",
      typeCategoryId: data.typeCategoryId,
      name: data.name,
      alias: convertNameWithoutAccents(data.name),
      status: checked ? 1 : 0,
      categoryId: selectedCategory
        ? selectedCategory.categoryId
        : typeCategory.categoryId,
    };

    await axios
      .put(`${API}/api/typeCategories/${getID}`, formData)
      .then((response) => {
        if (response.data.status === 201) {
          const alreadyExist = typeCategories.find(
            (typeCategory) => typeCategory.name === data.name
          );
          if (alreadyExist) setAlreadyExistName("Tên danh mục đã tồn tại");
        } else if (response.data.status === 400) {
          const updatedProductsType = {
            typeCategoryId: data.typeCategoryId,
            name: data.name,
            alias: convertNameWithoutAccents(data.name),
            status: checked ? 1 : 0,
            categoryId: selectedCategory
              ? selectedCategory.categoryId
              : typeCategory.categoryId,
            category: {
              name: selectedCategory
                ? selectedCategory.name
                : typeCategory.category.name,
            },
            typeCategory: {
              typeCategoryId: data.typeCategoryId,
              name: data.name,
            },
          };
          // dispatch({ type: "SET_PRODUCTSTYPE", payload: productsType });

          dispatch({
            type: "UPDATE_TYPECATEGORY",
            payload: updatedProductsType,
          });
          if (data.typeCategoryId !== typeCategory.typeCategoryId) {
            fetchTypeCategoriesAll();
          }
          navigate("/quantri/danhmuccon");
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
      })
      .catch((response) => {
        // alert(response.status);
      });
  };

  let currentStatus = null;
  if (typeCategory) {
    currentStatus =
      typeCategory.status && typeCategory.status === 1 ? true : false;
  }
  const [checked, setChecked] = useState(null);
  useEffect(() => {
    setChecked(currentStatus);
  }, [currentStatus]);

  //dữ liệu hiên thị trong dropdown danh mục cha
  const categoryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <AiOutlinePlus />
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <div className="container">
      <Toast ref={toast} />
      {loading && <Loading />}
      {typeCategory ? (
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

          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="id"
                defaultValue={typeCategory ? typeCategory.typeCategoryId : null}
                className={`w-full ${errors.typeCategoryId && "invalid"}`}
                {...register("typeCategoryId", {
                  required: "Vui lòng nhập mã danh mục",
                  maxLength: {
                    value: 20,
                    message: "Giới hạn chỉ 20 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("typeCategoryId");
                }}
              />
              <label htmlFor="id">Mã danh mục</label>
            </span>
            {errors.typeCategoryId && (
              <small className="cs-text-error">
                {errors.typeCategoryId.message}
              </small>
            )}
          </CCol>

          <CCol md={12}>
            <span className="p-float-label ">
              <InputText
                id="name"
                // value={name}
                defaultValue={typeCategory ? typeCategory.name : null}
                className={`w-full ${errors.name && "invalid"}`}
                {...register("name", {
                  required: "Vui lòng nhập tên danh mục",
                  maxLength: {
                    value: 50,
                    message: "Giới hạn chỉ 50 kí tự",
                  },
                })}
                onKeyUp={() => {
                  trigger("name");
                }}
              />

              <label htmlFor="name">Tên danh mục</label>
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
          <div>
            <span>
              <label htmlFor="danhmuc">Danh mục cha</label>
            </span>
            <div className=" flex justify-content-center">
              <Dropdown
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.value)}
                options={categories}
                optionLabel="name"
                placeholder={typeCategory ? typeCategory.category.name : null}
                filter
                itemTemplate={categoryOptionTemplate}
                className="w-full md:w-14rem"
              />
            </div>
          </div>
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

export default EditTypeCategory;
