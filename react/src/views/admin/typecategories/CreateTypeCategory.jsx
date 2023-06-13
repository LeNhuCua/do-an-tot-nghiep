import React, { useContext, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";



import Swal from "sweetalert2";
import { CCol, CForm } from "@coreui/react";
import { API } from "../../../API.js";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext.jsx";
import { AutoComplete } from "primereact/autocomplete";
import convertNameWithoutAccents from "../../../hook/admin/ConvertNameToAlias.jsx";
import { Toast } from "primereact/toast";
import axiosClient from "../../../axios-client.js";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb.jsx";

export default function CreateTypeCategory() {
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
  const toast = useRef(null);

  const { state, dispatch } = useContext(DataContext);
  const { categories } = state;

  const fetchCategories = async () => {
    await axiosClient.get(`${API}/api/categories/`).then(({ data }) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
    });
  };
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);
  const regexPattern =
    /^[^\s\u0103\u0105\u1EA1\u1EAD\u00E2\u00E0\u00E1\u1EA3\u1EA7\u1EA5\u1EAB\u1EA9\u0103\u0105\u1EA3\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E2\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00E0\u00E1\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u00EA\u00E8\u00E9\u1EC1\u1EBF\u1EC5\u1EC3\u1EC7\u00EA\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7\u00E8\u00E9\u1EC1\u1EBF\u1EC3\u1EC5\u1EC7]+$/;
  const [validationError, setValidationError] = useState([]);
  const CreateTypeCategory = async (data) => {
    const formData = new FormData();
    formData.append("typeCategoryId", data.typeCategoryId);
    formData.append("name", data.name);
    formData.append("alias", convertNameWithoutAccents(data.name));
    formData.append("status", statusSelect ? statusSelect.code : 1);
    formData.append("categoryId", selectedCategoryItem.categoryId);

    await axiosClient.post(`${API}/api/typeCategories`, formData).then((response) => {
      if (response.data.status === 400) {
        const createProducts = {
          ...data,
          alias: convertNameWithoutAccents(data.name),
          status: statusSelect ? statusSelect.code : 1,
          category: {
            name: selectedCategoryItem.name,
          },
          // "category.name": selectedCategoryItem.name, // truyền giá trị của categories vào đây
        };

        // Thêm loại sản phẩm mới vào danh sách loại sản phẩm trong context
        dispatch({ type: "ADD_TYPECATEGORY", payload: createProducts });
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Thêm mới thành công !",
          life: 3000,
        });
        setValidationError([]);
        reset();
      } else {
        setValidationError(response.data.validation_error);
        Swal.fire({
          icon: "error",
          text: "Kiểm tra lại thông tin",
        });
      }
    });
  };
  const [statusSelect, setStatusSelect] = useState(null);

  const status = [
    { name: "Hiển thị", code: 1 },
    { name: "Ẩn", code: 0 },
  ];

  const [selectedCategoryItem, setSelectedCategoryItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState(null);

  // const items = Array.from({ length: 100000 }).map((_, i) => ({
  //   label: `Item #${i}`,
  //   value: i,
  // }));

  const searchItems = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo purposes we filter at client side
    let query = event.query;
    let _filteredItems = [];

    for (let i = 0; i < categories.length; i++) {
      let item = categories[i];
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        _filteredItems.push(item);
      }
    }
    setFilteredItems(_filteredItems);
  };
  const ListBreadcrumb = [
    {
      name: "Quản lý loại danh mục",
      link: "/quantri/danhmuccon",
    },
    {
      name: "Thêm loại danh mục",
    },
  ];
  return (
    <div className="container">
      <Toast ref={toast} />
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      <CForm onSubmit={handleSubmit(CreateTypeCategory)} className="row g-4">
        <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="typeCategoryId"
              className={`w-full ${errors.typeCategoryId && "invalid"}`}
              {...register("typeCategoryId", {
                required: "Vui lòng nhập mã loại",
                maxLength: {
                  value: 20,
                  message: "Giới hạn chỉ 20 kí tự",
                },
                pattern: {
                  value: regexPattern,
                  message:
                    "Vui lòng không nhập kí tự khoảng trắng hoặc kí tự có dấu",
                },
              })}
              onKeyUp={() => {
                trigger("typeCategoryId");
              }}
              type="text"
              placeholder="Vd: NNam"
            />
            <label htmlFor="typeCategoryId">Mã loại</label>
          </span>

          {errors.typeCategoryId && (
            <small className="cs-text-error">
              {errors.typeCategoryId.message}
            </small>
          )}
          {validationError.typeCategoryId && (
            <small className="cs-text-error">Mã loại đã tồn tại</small>
          )}
        </CCol>
        <CCol md={6}>
          <span className="p-float-label ">
            <InputText
              id="name"
              className={`w-full ${errors.name && "invalid"}`}
              {...register("name", {
                required: "Vui lòng nhập tên loại",
                maxLength: {
                  value: 50,
                  message: "Giới hạn chỉ 50 kí tự",
                },
              })}
              onKeyUp={() => {
                trigger("name");
              }}
              type="text"
              placeholder="Vd: Nhẫn Nam"
            />
            <label htmlFor="name">Tên loại sản phẩm</label>
          </span>

          {errors.name && (
            <small className="cs-text-error">{errors.name.message}</small>
          )}
          {validationError.name && (
            <small className="cs-text-error">Tên loại đã tồn tại</small>
          )}
        </CCol>

        <CCol md={8}>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Vui lòng chọn danh mục trong danh sách" }}
            defaultValue=""
            render={({ field }) => (
              <AutoComplete
                {...field}
                value={selectedCategoryItem}
                suggestions={filteredItems}
                completeMethod={searchItems}
                field="name"
                dropdown
                onChange={(e) => {
                  setSelectedCategoryItem(e.value);
                  setValue("categoryId", e.value.categoryId);
                }}
                placeholder="Chọn danh mục"
                className={`w-full ${errors.categoryId && "invalid"}`}
              />
            )}
          />

          {errors.categoryId && (
            <small className="cs-text-error">{errors.categoryId.message}</small>
          )}
        </CCol>
        <CCol md={4}>
          <Dropdown
            value={statusSelect}
            onChange={(e) => setStatusSelect(e.value)}
            options={status}
            optionLabel="name"
            className="w-full md:w-14rem"
            placeholder="Chọn hiển thị (Mặc định: Hiển thị)"
          />
        </CCol>

        <CCol xs={12}>
          <Button className="youtube p-0 w-full justify-center">
            <i className="pi pi-check"></i>
            <span className="p-3">Xác nhận</span>
          </Button>
        </CCol>
      </CForm>
    </div>
  );
}
