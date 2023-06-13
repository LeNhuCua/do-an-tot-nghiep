import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineDownload,
  AiOutlinePlus,
} from "react-icons/ai";
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

import Loading from "../../../components/Loading";

import { DataContext } from "../../../context/DataContext";
import DataGridNoStatus from "../../../components/admin/datatable/DataGridNoStatus";
import { DetailSize } from "../../../components/admin/sizes";
import axiosClient from "../../../axios-client";
import Breadcrumb from "../../../components/customer/breadcrumb/Breadcrumb";
import { CContainer, CHeaderDivider } from "@coreui/react";
import { AppBreadcrumb } from "../../../layout/admin";

const Sizes = () => {
  // UseTitle("Loại sản phẩm");

  const { state, dispatch } = useContext(DataContext);

  const { sizes, products } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sizes.length === 0) {
      fetchSizes();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchSizes = async () => {
    await axiosClient.get(`${API}/api/sizes/`).then(({ data }) => {
      dispatch({ type: "FETCH_SIZES", payload: data });
      setLoading(false);
      console.log(data);
    });
  };

  const ApiExcel = `${API}/api/sizes/importExcel`;

  //model
  const [visible, setVisible] = useState(false);

  //detail
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await sizes.find((sizes) => sizes.sizeId === id);

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
          <Link to={`/quantri/kichthuoc/chinhsua/${rowData.sizeId}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.sizeId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    {
      field: "sizeId",
      header: "Mã",
      filter: true,
    },
    {
      field: "sizeValue",
      header: "Kích thước",
      filter: true,
    },

    {
      field: "action",
      header: "Chức năng",
      filter: false,
      body: actionButtons,
    },
  ];
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Tippy content="Thêm mới">
          <Link className="block" to={"/quantri/kichthuoc/taomoi"}>
            <Fab className="z-0" color="primary" component="label">
              <AiOutlinePlus />
            </Fab>
          </Link>
        </Tippy>
      </div>
    );
  };

  const handleDownload = () => {
    const fileUrl = "/excel/kichthuoc.csv";

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
        link.download = "Mau_Excel_KichThuoc.csv";
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

        <UploadExcelForm className="" ApiExcel={ApiExcel} fetch={fetchSizes} />
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
      ids.push(obj.sizeId);
    }
    return ids;
  }

  const deleteSelectedData = async () => {
    let _products = sizes.filter((val) => selectedData.includes(val));
    setSelectedData(_products);
    const isConfirm = await Swal.fire({
      title: `Bạn có chắc muốn xoá ?`,
      text: "Xoá các kích thước này sẽ xoá đi toàn bộ sản phẩm thuộc kích thước này có trong cửa hàng. Bạn sẽ không thể hoàn tác!",
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
      .delete(`${API}/api/sizes/deleteAll`, {
        data: {
          dataId: getIds(selectedData),
        },
      })
      .then(() => {
        dispatch({
          type: "SET_SIZES",
          payload: sizes.filter(
            (product) => !getIds(selectedData).includes(product.sizeId)
          ),
        });
        dispatch({
          type: "SET_PRODUCTS",
          payload: products.filter(
            (product) => !getIds(selectedData).includes(product.sizeId)
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
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Quản lý kích thước",
    },
  ];
  return (
    <div className="relative">
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />

      {/* <Breadcrumb ListBreadcrumb={ListBreadcrumb} /> */}

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
            data={sizes}
            col={col}
          />

          {Object.keys(detailFind).length ? (
            <DetailSize
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

export default Sizes;
