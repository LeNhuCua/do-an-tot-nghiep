import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AiFillEdit, AiOutlineDelete, AiOutlineDownload, AiOutlinePlus } from "react-icons/ai";
import { CategoriesContext } from "../../../CategoriesContext";
import axios from "axios";

import Swal from "sweetalert2";

import { Button } from "primereact/button";

import UploadExcelForm from "../../../components/admin/uploadexcel/UploadExcelForm";

import { API } from "../../../API.js";

import { Fab, IconButton } from "@mui/material";

import Tippy from "@tippyjs/react";
import { BiShow } from "react-icons/bi";

import { Toolbar } from "primereact/toolbar";
import DataGrid from "../../../components/admin/datatable/DataGrid";
import { MdDeleteForever } from "react-icons/md";
import { DetailProductsType } from "../../../components/admin/productstype";
import Loading from "../../../components/Loading";
import UseTitle from "../../../hook/UseTitle";
import { DataContext } from "../../../context/DataContext";
import DataGridNoStatus from "../../../components/admin/datatable/DataGridNoStatus";
import axiosClient from "../../../axios-client";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb";

const ProductsType = () => {
  // UseTitle("Loại sản phẩm");

  const { state, dispatch } = useContext(DataContext);

  const { productsType, products } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productsType.length === 0) {
      fetchProductsType();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchProductsType = async () => {
    await axiosClient.get(`${API}/api/productsType/`).then(({ data }) => {
      dispatch({ type: "FETCH_PRODUCTSTYPE", payload: data });
      setLoading(false);
      console.log(data);
    });
  };

  const ApiExcel = `${API}/api/productsType/importExcel`;

  //model
  const [visible, setVisible] = useState(false);

  //detail
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await productsType.find(
      (productsType) => productsType.productTypeId === id
    );

    if (getDetail) {
      setDetailFind(getDetail);
      setVisible(!visible);
    }
  };

  const [selectedData, setSelectedData] = useState([]);

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Sửa">
          <Link to={`/quantri/loaisanpham/chinhsua/${rowData.productTypeId}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.productTypeId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    {
      field: "productTypeId",
      header: "Mã",
      filter: true,
    },
    {
      field: "name",
      header: "Tên",
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
          <Link className="block" to={"/quantri/loaisanpham/taomoi"}>
            <Fab className="z-0" color="primary" component="label">
              <AiOutlinePlus />
            </Fab>
          </Link>
        </Tippy>
      </div>
    );
  };
  const handleDownload = () => {
    const fileUrl = "/excel/loaisanpham.csv";

    axios({
      url: fileUrl,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const blob = new Blob([response.data]);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Mau_Excel_LoaiSanPham.csv";
        link.click();
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi:", error);
      });
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
          fetch={fetchProductsType}
        />{" "}
        <Tippy content="Mẫu Excel">
          <Fab
            onClick={handleDownload}
            className="z-0"
            color="info"
            component="label"
          >
            <AiOutlineDownload />
          </Fab>
        </Tippy>
      </div>
    );
  };

  function getIds(arr) {
    let ids = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      ids.push(obj.productTypeId);
    }
    return ids;
  }

  const deleteSelectedData = async () => {
    let _products = productsType.filter((val) => selectedData.includes(val));
    setSelectedData(_products);
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
    await axiosClient
      .delete(`${API}/api/productsType/deleteAll`, {
        data: {
          dataId: getIds(selectedData),
        },
      })
      .then(() => {
        dispatch({
          type: "SET_PRODUCTSTYPE",
          payload: productsType.filter(
            (product) => !getIds(selectedData).includes(product.productTypeId)
          ),
        });
        dispatch({
          type: "SET_PRODUCTS",
          payload: products.filter(
            (product) => !getIds(selectedData).includes(product.productTypeId)
          ),
        });
        setSelectedData([]);
        Swal.fire({
          icon: "success",
          text: "Đã xoá thành công",
        });
      })
      .catch((err) => console.log(err));
  };
  const ListBreadcrumb = [
    {
      name: "Quản lý loại sản phẩm",
    },

  ];
  return (
    <div className="relative">
        <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      {loading && <Loading />}
      {!loading && (
        <>
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataGridNoStatus
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            data={productsType}
            col={col}
          />

          {Object.keys(detailFind).length ? (
            <DetailProductsType
              detailFind={detailFind}
              visible={visible}
              setVisible={setVisible}
            />
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

export default ProductsType;
