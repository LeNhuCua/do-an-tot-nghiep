import axios from "axios";
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

const OrderNew = () => {
  // const [orderNew, setOrderNew] = useState([]);
  const [loading, setLoading] = useState(true);

  const { state, dispatch } = useContext(DataContext);

  const { orderNews } = state;

  useEffect(() => {
    fetchOrdersNew();
  }, []);
  const fetchOrdersNew = async () => {
    await axios.get(`${API}/api/orders/`).then(({ data }) => {
      // dispatch({ type: "FETCH_PRODUCTS", payload: data });
      dispatch({ type: "FETCH_NEW_ORDER", payload: data });
      setLoading(false);
      // setOrderNew(data);
      // setLoading(false);
    });
  };

  //detail
  const [visible, setVisible] = useState(false);
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await orderNews.find(
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
    await axios
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

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Xác nhận đơn">
          <IconButton
            color="success"
            className="me-2 hover:ring-2 "
            onClick={() => orderCancer(rowData.orderId)}
          >
            <AiOutlineCheck />
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
        <Tippy content="Huỷ đơn hàng">
          <IconButton
            color="error"
            className="me-2 hover:ring-2 "
            onClick={() => orderCancer(rowData.orderId)}
          >
            <AiOutlineClose />
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
  return (
    <div>
      {loading && <Loading />}

      {!loading && <OrderGrid data={orderNews} col={col} />}
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

export default OrderNew;
