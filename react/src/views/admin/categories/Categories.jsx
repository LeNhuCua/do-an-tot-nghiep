import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Tag } from "primereact/tag";
import { AiFillEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

import axios from "axios";
import { Toast } from "primereact/toast";

import Swal from "sweetalert2";

import { Button } from "primereact/button";

import UploadExcelForm from "../../../components/admin/uploadexcel/UploadExcelForm";
import { DetailCategory } from "../../../components/admin/categories/";

import { API } from "../../../API.js";

import { Fab, IconButton } from "@mui/material";

import Tippy from "@tippyjs/react";
import { BiShow } from "react-icons/bi";

import { Toolbar } from "primereact/toolbar";
import DataGrid from "../../../components/admin/datatable/DataGrid";
import { MdDeleteForever } from "react-icons/md";
import Loading from "../../../components/Loading";
import { DataContext } from "../../../context/DataContext";

const Categories = () => {
  const { state, dispatch } = useContext(DataContext);
  const toast = useRef(null);

  const { categories, subcategories } = state;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    await axios.get(`${API}/api/categories/`).then(({ data }) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
      setLoading(false);
    });
  };

  const ApiExcel = `${API}/api/categories/importExcel`;


  //detail
  const [detailFind, setDetailFind] = useState([]);
  const [visible, setVisible] = useState(false);
  const showDetail = async (id) => {
    const getDetail = await categories.find(
      (category) => category.categoryId === id
    );

    if (getDetail) {
      setDetailFind(getDetail);
      setVisible(!visible);
    }
  };

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Sửa">
          <Link to={`/quantri/danhmuc/chinhsua/${rowData.categoryId}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>
        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.categoryId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    {
      field: "categoryId",
      header: "Mã",
      filter: true,
    },
    {
      field: "name",
      header: "Tên",
      filter: true,
    },
    {
      field: "alias",
      header: "Bí danh",
      filter: true,
    },
    {
      field: "action",
      header: "Action",
      filter: false,
      body: actionButtons,
    },
  ];

  const leftToolbarTemplate = () => {
    return (
      <div>
        <Tippy content="Thêm mới">
          <Link className="block" to={"/quantri/danhmuc/taomoi"}>
            <Fab className="z-0" color="primary" component="label">
              <AiOutlinePlus />
            </Fab>
          </Link>
        </Tippy>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex gap-3">
        <div
          className={`${
            !selectedData || !selectedData.length ? "hidden" : ""
          }  `}
        >
          <Button
            icon="pi pi-trash"
            severity="danger"
            variant="contained"
            label="Xoá"
            component="label"
            onClick={deleteSelectedData}
            disabled={!selectedData || !selectedData.length}
          ></Button>
        </div>

        <UploadExcelForm
          className=""
          ApiExcel={ApiExcel}
          fetch={fetchCategories}
        />
      </div>
    );
  };

  //delete all Data

  const [selectedData, setSelectedData] = useState([]);

  function getIds(arr) {
    let ids = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      ids.push(obj.categoryId);
    }
    return ids;
  }

  const deleteSelectedData = async () => {
    let _data = categories.filter((val) => selectedData.includes(val));
    setSelectedData(_data);
    const isConfirm = await Swal.fire({
      title: `Bạn có chắc muốn xoá  ?`,
      text: "Xoá các danh mục này sẽ xoá đi toàn bộ sản phẩm thuộc danh mục này có trong cửa hàng. Bạn sẽ không thể hoàn tác!",
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
    await axios
      .delete(`${API}/api/categories/deleteAll`, {
        data: {
          dataId: getIds(selectedData),
        },
      })

      .then((response) => {
        if (response.data.status === 200) {
          dispatch({
            type: "SET_CATEGORIES",
            payload: categories.filter(
              (product) => !getIds(selectedData).includes(product.categoryId)
            ),
          });
          dispatch({
            type: "SET_SUBCATEGORIES",
            payload: subcategories.filter(
              (product) => !getIds(selectedData).includes(product.categoryId)
            ),
          });

          setSelectedData([]);
          Swal.fire({
            icon: "success",
            title: "Đã xoá thành công !",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: "Lỗi!",
          icon: "error",
        });
      });
  };

  return (
    <div className="relative">
      {loading && <Loading />}
      {!loading && (
        <>
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataGrid
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            data={categories}
            col={col}
          />
          <DetailCategory
            detailFind={detailFind}
            visible={visible}
            setVisible={setVisible}
          />
        </>
      )}
  
    </div>
  );
};

export default Categories;

