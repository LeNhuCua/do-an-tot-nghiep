import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AiFillEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { DataContext } from "../../../context/DataContext";
import axios from "axios";

import Swal from "sweetalert2";

// import Button from "@mui/material/Button";

import UploadExcelForm from "../../../components/admin/uploadexcel/UploadExcelForm";

import { API } from "../../../API.js";

import { Fab, IconButton } from "@mui/material";

import Tippy from "@tippyjs/react";
import { BiShow } from "react-icons/bi";

import { Toolbar } from "primereact/toolbar";
import DataGrid from "../../../components/admin/datatable/DataGrid";
import { MdDeleteForever } from "react-icons/md";
import DetailSlides from "../../../components/admin/slides/DetailSlides";



import Loading from "../../../components/Loading";
import UseTitle from "../../../hook/UseTitle";
import { Button } from "primereact/button";

const Slides = () => {
  // UseTitle("Loại sản phẩm");

  const { state, dispatch } = useContext(DataContext);

  const { slides } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slides.length === 0) {
      fetchSlides();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchSlides = async () => {
    await axios.get(`${API}/api/slides/`).then(({ data }) => {
      dispatch({ type: "FETCH_SLIDES", payload: data });
      setLoading(false);
    });
  };

  const ApiExcel = `${API}/api/slides/importExcel`;

  //model
  const [visible, setVisible] = useState(false);

  //detail
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await slides.find((slides) => slides.slideId === id);

    if (getDetail) {
      setDetailFind(getDetail);
      setVisible(!visible);
    }
  };

  const [selectedData, setSelectedData] = useState([]);

  const avatar = (rowData) => {
    return rowData.image ? (
      <img
        className="w-20 border"
        src={`http://localhost:8000/slide/image/${rowData.image}`}
        alt={rowData.image}
      />
    ) : (
      <p className="bg-red-200 p-2 inline rounded-lg font-semibold">Chưa có</p>
    );
  };

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Sửa">
          <Link to={`/quantri/slide/chinhsua/${rowData.slideId}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.slideId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    {
      field: "slideId",
      header: "Mã",
      filter: true,
    },

    {
      field: "image",
      header: "Ảnh",
      filter: false,
      body: avatar,
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
          <Link className="block" to={"/quantri/slide/taomoi"}>
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

        <UploadExcelForm className="" ApiExcel={ApiExcel} fetch={fetchSlides} />
      </div>
    );
  };

  function getIds(arr) {
    let ids = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      ids.push(obj.slideId);
    }
    return ids;
  }

  const deleteSelectedData = async () => {
    let _slides = slides.filter((val) => selectedData.includes(val));
    setSelectedData(_slides);
    const isConfirm = await Swal.fire({
      title: `Bạn có chắc muốn xoá  ?`,
      text: "You won't be able to revert this!",
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
      .delete(`${API}/api/slides/deleteAll`, {
        data: {
          dataId: getIds(selectedData),
        },
      })
      .then(() => {
        dispatch({
          type: "SET_SLIDES",
          payload: slides.filter(
            (product) => !getIds(selectedData).includes(product.slideId)
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

  return (
    <div className="relative ">
      {loading && <Loading />}
      {!loading && (
        <div className="relative  ">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataGrid
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            data={slides}
            col={col}
          />

          {Object.keys(detailFind).length ? (
            <DetailSlides
              detailFind={detailFind}
              visible={visible}
              setVisible={setVisible}
            />
          ) : (
            ""
          )}
        </div>
      )}
      {/* <button onClick={handleDeleteslides}>Delete Selected slides</button> */}
    </div>
  );
};

export default Slides;
