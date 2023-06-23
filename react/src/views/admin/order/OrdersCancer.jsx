import React, { useContext, useEffect, useState } from "react";
import { API } from "../../../API";
import OrderGrid from "../../../components/admin/datatable/OrderGrid";
import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import DetailOrder from "./DetailOrder";
import { DataContext } from "../../../context/DataContext";
import axiosClient from "../../../axios-client";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb";
import { SpeedDial } from "primereact/speeddial";
import "./style.css";
const OrdersCancer = () => {
  // const [orderNew, setOrderNew] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ordersBeingProcessed, setOrdersBeingProcessed] = useState([]);

  useEffect(() => {
    fetchOrdersNew();
  }, []);
  const fetchOrdersNew = async () => {
    await axiosClient
      .get(`${API}/api/orders/orderCanceled`)
      .then(({ data }) => {
        // dispatch({ type: "FETCH_PRODUCTS", payload: data });
        setOrdersBeingProcessed(data);
        setLoading(false);
        // setOrderNew(data);
        // setLoading(false);
      });
  };

  //detail
  const [visible, setVisible] = useState(false);
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await ordersBeingProcessed.find(
      (orderNew) => orderNew.orderId === id
    );

    if (getDetail) {
      setDetailFind(getDetail);
      setVisible(!visible);
    }
  };

  const deleteOrder = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Bạn có chắc muốn xoá đơn hàng?",
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
      .delete(`${API}/api/orders/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });

        // const img = productSize.filter(
        //   (productSize) => productSize.productSizeId !== id
        // );
        // setProductSize(img);
        // fetchProducts();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  const orderCheck = async (id) => {
    const isConfirm = await Swal.fire({
      title: `Xác nhận giao đơn hàng thành công?`,
      // text: "You won't be able to revert this!",
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
      .put(`${API}/api/orders/orderSuccess?orderId=${id}`)
      .then(({ data }) => {
        if (data.status === 200) {
          // navigate("/dondathang");
          fetchOrdersNew();
          Swal.fire({
            icon: "success",
            title: "Xác nhận thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(() => {});
  };

  const actionButtons = (rowData) => {
    return (
      <div className="relative">
        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.orderId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
        <Tippy content="Xoá đơn hàng">
          <IconButton
            color="error"
            className="me-2 hover:ring-2 "
            onClick={() => deleteOrder(rowData.orderId)}
          >
            <AiOutlineClose />
          </IconButton>
        </Tippy>

        {/* <SpeedDial
          model={items}

          type="semi-circle"
          direction="up"
          color="error"
     
          rounded
          text
          aria-label="Filter"
          className="absolute right-3 top-0 z-[100]"
          buttonClassName="p-speeddial-button"
          size="small"
          
          // onClick={() => orderCancer(rowData.orderId)}
        >
         
        </SpeedDial> */}
      </div>
    );
  };
  const col = [
    // {
    //   field: "orderId",
    //   header: "Mã",
    //   filter: true,
    // },
    // // {
    //   field: "totalAmount",
    //   header: "Tổng tiền",
    //   filter: true,
    // },

    // {
    //   field: "avatars",
    //   header: "Ảnh bìa",
    //   filter: false,
    //   body: avatar,
    // },

    {
      field: "action",
      header: "Chức năng",
      filter: false,
      body: actionButtons,
    },
  ];

  const ListBreadcrumb = [
    // {
    //   name: "Tỉ giá vàng 1",
    //   link: "fsdf",
    // },
    {
      name: "Đơn hàng đã huỷ",
    },
  ];
  return (
    <div>
      <AppBreadcrumb ListBreadcrumb={ListBreadcrumb} />
      {loading && <Loading />}

      {!loading && <OrderGrid data={ordersBeingProcessed} col={col} />}
      {Object.keys(detailFind).length ? (
        <DetailOrder
          detailFind={detailFind}
          visible={visible}
          setVisible={setVisible}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default OrdersCancer;
