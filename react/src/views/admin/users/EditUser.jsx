import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import axios from "axios";

import { CCol, CForm } from "@coreui/react";
import Swal from "sweetalert2";
import { ToggleButton } from "primereact/togglebutton";

import {API} from "../../../API";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataContext } from "../../../context/DataContext";


const EditUser = () => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });


  const { state, dispatch } = useContext(DataContext);
  

  const getAlias = useParams().alias;
  const [categories, setCategories] = useState([]);

  const [id, setId] = useState("");

  const [alias, setAlias] = useState("");

  const [currentStatus, setCurrentStatus] = useState("");

  const [name, setName] = useState("");

  const [validationError, setValidationError] = useState({});

  async function asyncCall() {
    const getCategory = await state.categories.find(
      (category) => category.alias === getAlias
    );
    if (getCategory) {
      setAlias(getCategory.alias);
      setName(getCategory.name);
      setId(getCategory.categoryId);
      setCurrentStatus(getCategory.status);
    }
  }

  // const fetchCategories = async () => {
  //   await axios
  //     .get(`${API}/api/categories/`)
  //     .then(({ data }) => {
  //       setCategories(data);
  //     })
  //     .catch(({ response: { data } }) => {
  //       Swal.fire({
  //         text: data.message,
  //         icon: "error",
  //       });
  //     });
  // };

  useEffect(() => {
    asyncCall();
  }, [state.categories]);

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const updateCategory = async () => {
    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("alias", alias);
    formData.append("name", name);
    formData.append("status", checked ? 1 : 0);

    await axios
      .post(`${API}/api/categories/${id}`, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  const s = currentStatus === 1 ? true : false;

  const [checked, setChecked] = useState(null);
  useEffect(() => {
    setChecked(s);
  }, [s]);

  const [getHandle, setGetHandle] = useState(0);


  let BtnSubmit = "";


  const Cancer = () => {
    setGetHandle(0)

  } 

  if (getHandle >= 1) {
    BtnSubmit = (
      <>
        <Button label="Xác nhận" icon="pi pi-check" />
        <Button type="button" label="HUỷ bỏ" icon="pi pi-check" onClick={Cancer}/>
      </>
    );
  }

  return (
    <div className="container">
      <CForm onSubmit={handleSubmit(updateCategory)} className="row g-4">
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
              setGetHandle(getHandle + 1);
            }}
          />
        </div>
        <CCol md={12}>
          <span className="p-float-label ">
            <InputText
              className="w-full"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setGetHandle(getHandle + 1);
              }}
            />

            <label htmlFor="danhmuc">Tên danh mục</label>
          </span>
        </CCol>
        <CCol md={8}>
          <span className="p-float-label ">
            <InputText
              className="w-full"
              id="danhmuc"
              value={alias}
              onChange={(event) => {
                setAlias(event.target.value);
              }}
            />

            <label htmlFor="alias">Bí danh</label>
          </span>
        </CCol>

        <CCol xs={12}>{BtnSubmit}</CCol>
      </CForm>
    </div>
  );
};

export default EditUser;
