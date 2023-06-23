import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Tag } from "primereact/tag";
import {
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineDownload,
  AiOutlinePlus,
} from "react-icons/ai";

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

import Loading from "../../../components/Loading";
import { DataContext } from "../../../context/DataContext";
import axiosClient from "../../../axios-client";
import axios from "axios";
import { AppBreadcrumb } from "../../../layout/admin";
import { DetailShippingCost } from "../../../components/admin/shippingcost";
import DataGridNoStatus from "../../../components/admin/datatable/DataGridNoStatus";
import DataGridCost from "../../../components/admin/datatable/DataGridCost";

const DeliveryCharges = () => {
  const { state, dispatch } = useContext(DataContext);

  const { categories, subcategories } = state;

  const [shippingCost, setShippingCost] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchShippingCost();
  }, []);

  const fetchShippingCost = async () => {
    await axiosClient
      .get(`${API}/api/admin-shippingCosts/`)
      .then(({ data }) => {
        setShippingCost(data);
        setLoading(false);
      });
  };

  const ApiExcel = `${API}/api/categories/importExcel`;

  //detail
  const [detailFind, setDetailFind] = useState([]);
  const [visible, setVisible] = useState(false);
  const showDetail = async (id) => {
    const getDetail = await shippingCost.find(
      (category) => category.shippingCostId === id
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
          <IconButton
            color="success"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.shippingCostId)}
          >
            <AiFillEdit />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const totalAmountBodyTemplate = (rowData) => {
    return (
      <span className="">
        {new Intl.NumberFormat({
          style: "currency",
          currency: "JPY",
        }).format(rowData.shippingCost)}
        <span> VNĐ</span>
      </span>
    );
  };

  const col = [
    {
      field: "province.name",
      header: "Tỉnh/Thành phố",
      filter: true,
    },
    {
      field: "district.name",
      header: "Quận/Huyện",
      filter: true,
    },
    {
      field: "ward.name",
      header: "Xã/Phường",
      filter: true,
    },
    {
      field: "ship",
      header: "Tiền ship",
      filter: true,
      body: totalAmountBodyTemplate,
    },
    {
      field: "action",
      header: "Chức năng",
      filter: false,
      body: actionButtons,
    },
  ];

  const [selectedData, setSelectedData] = useState([]);

  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Quản lý phí giao hàng",
    },
  ];
  return (
    <div className="relative">
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      {loading && <Loading />}
      {!loading && (
        <>
          <DataGridCost
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            data={shippingCost}
            col={col}
          />
          <DetailShippingCost
            fetchShippingCost={fetchShippingCost}
            detailFind={detailFind}
            visible={visible}
            setVisible={setVisible}
          />
        </>
      )}
    </div>
  );
};

export default DeliveryCharges;
