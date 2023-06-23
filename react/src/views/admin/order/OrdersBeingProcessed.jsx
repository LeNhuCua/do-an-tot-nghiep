
import React, {  useEffect, useRef, useState } from "react";
import { API } from "../../../API";
import OrderGrid from "../../../components/admin/datatable/OrderGrid";
import Tippy from "@tippyjs/react";

import { IconButton } from "@mui/material";
import {

  AiFillPrinter,

} from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import DetailOrder from "./DetailOrder";
import { DataContext } from "../../../context/DataContext";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./ComponentToPrint";
import { MdEmojiTransportation } from "react-icons/md";
import axiosClient from "../../../axios-client";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb";

const OrdersBeingProcessed = () => {
  // const [orderNew, setOrderNew] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ordersBeingProcessed, setOrdersBeingProcessed] = useState([]);

  useEffect(() => {
    fetchOrdersNew();
  }, []);
  const fetchOrdersNew = async () => {
    await axiosClient
      .get(`${API}/api/orders/ordersBeingProcessed`)
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

  const orderCancer = async (id) => {
    const isConfirm = await Swal.fire({
      title: `Huỷ đơn hàng?`,
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
      .put(`${API}/api/orders/orderCancel?orderId=${id}`)
      .then(({ data }) => {
        if (data.status === 200) {
          // navigate("/dondathang");
          fetchOrdersNew();
          Swal.fire({
            icon: "success",
            title: "Đơn hàng đã huỷ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(() => {});
  };

  const orderCheck = async (id) => {
    const isConfirm = await Swal.fire({
      title: `Giao đơn hàng?`,
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
      .put(`${API}/api/orders/orderCheckDelivery?orderId=${id}`)
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
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
  });
  const [orderPrint, setOrderPrint] = useState({});
  const handlePrintWithId = (orderId) => {
    const getDetail = ordersBeingProcessed.find(
      (orderNew) => orderNew.orderId === orderId
    );
      
    if (getDetail) {
      setOrderPrint(getDetail);
      setTimeout(() => {
        handlePrint();
      }, 0);
    }
    console.log(getDetail);
    // Do something with the orderId if needed
  };
  
  
  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Giao đơn hàng">
          <IconButton
            color="success"
            className="me-2 hover:ring-2 "
            onClick={() => orderCheck(rowData.orderId)}
          >
            <MdEmojiTransportation />
          </IconButton>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.orderId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
        <Tippy content="In đơn hàng">
          <IconButton
            color="error"
            className="me-2 hover:ring-2 "
            onClick={() => handlePrintWithId(rowData.orderId)}
          >
            <AiFillPrinter />
          </IconButton>
        </Tippy>
      </>
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
      name: "Đơn hàng đang xử lý",
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

      {Object.keys(orderPrint).length ? (
        <div style={{ display: "none" }}>
          <ComponentToPrint ref={componentRef} invoices={orderPrint} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default OrdersBeingProcessed;
