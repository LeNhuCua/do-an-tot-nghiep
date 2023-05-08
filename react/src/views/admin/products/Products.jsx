import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AiFillEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { DataContext } from "../../../context/DataContext";
import axios from "axios";

import Swal from "sweetalert2";

// import Button from "@mui/material/Button";

import UploadExcelForm from "../../../components/admin/uploadexcel/UploadExcelForm";

import {API} from "../../../API.js";

import { Fab, IconButton } from "@mui/material";

import Tippy from "@tippyjs/react";
import { BiShow } from "react-icons/bi";

import { Toolbar } from "primereact/toolbar";
import DataGrid from "../../../components/admin/datatable/DataGrid";
import { MdDeleteForever } from "react-icons/md";
import { DetailProducts } from "../../../components/admin/products";
import Loading from "../../../components/Loading";
import UseTitle from "../../../hook/UseTitle";
import { Button } from "primereact/button";

const Products = () => {
  // UseTitle("Loại sản phẩm");

  const { state, dispatch } = useContext(DataContext);

  const { products } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchProducts = async () => {
    await axios.get(`${API}/api/products/`).then(({ data }) => {
      dispatch({ type: "FETCH_PRODUCTS", payload: data });
      setLoading(false);
    });
  };

  const ApiExcel = `${API}/api/products/importExcel`;

  //model
  const [visible, setVisible] = useState(false);

  //detail
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await products.find(
      (products) => products.productId === id
    );

    if (getDetail) {
      setDetailFind(getDetail);
      setVisible(!visible);
    }
  };

  const [selectedData, setSelectedData] = useState([]);

  const avatar = (rowData) => {
    return (
      rowData.avatar ? 
      <img
        className="w-20 border"
        src={`http://localhost:8000/product/image/${rowData.avatar}`}
        alt={rowData.name}
      /> : <p className="bg-red-200 p-2 inline rounded-lg font-semibold">Chưa có</p>
    );
  };

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Sửa">
          <Link to={`/quantri/sanpham/chinhsua/${rowData.productId}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.productId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    {
      field: "productId",
      header: "Mã",
      filter: true,
    },
    {
      field: "name",
      header: "Tên",
      filter: true,
    },
    {
      field: "type_category.name",
      header: "Danh mục cha",
      filter: true,
    },
    {
      field: "avatars",
      header: "Ảnh bìa",
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
          <Link className="block" to={"/quantri/sanpham/taomoi"}>
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
          fetch={fetchProducts}
        />
      </div>
    );
  };

  function getIds(arr) {
    let ids = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      ids.push(obj.productId);
    }
    return ids;
  }

  const deleteSelectedData = async () => {
    let _products = products.filter((val) => selectedData.includes(val));
    setSelectedData(_products);
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
      .delete(`${API}/api/products/deleteAll`, {
        data: {
          dataId: getIds(selectedData),
        },
      })
      .then(() => {
        dispatch({
          type: "SET_PRODUCTS",
          payload: products.filter(
            (product) => !getIds(selectedData).includes(product.productId)
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
            data={products}
            col={col}
          />

          {Object.keys(detailFind).length ? (
            <DetailProducts
              detailFind={detailFind}
              visible={visible}
              setVisible={setVisible}
            />
          ) : (
            ""
          )}
        </div>
      )}
      {/* <button onClick={handleDeleteProducts}>Delete Selected Products</button> */}
    </div>
  );
};

export default Products;

//   const a =       <label>
//   <input type="checkbox" onChange={handleSelectAllChange} />
//   Select All
// </label>
// const a = () => {
//   return (
//     <span>
//       <button
//         style={{ padding: "20px" }}
//         icon="pi pi-pencil"
//         className="p-button-rounded p-button-success p-mr-2 bg-red-300 "
//       >
//         1
//       </button>
//       <button
//         style={{ padding: "20px" }}
//         icon="pi pi-trash"
//         className="p-button-rounded p-button-danger"
//       >
//         3
//       </button>
//     </span>
//   );
// };
// const columns = [
//   {
//     field: "lineNo1",
//     headerName: "",
//     width: 90,
//     renderCell: (params) => {
//       return (
//         <div className="flex items-center mr-4">
//           <input
//             checked={selectedData.includes(params.row.categoryId)}
//             value={params.row.categoryId}
//             onChange={(e) => handleSelectProduct(e, params.row.categoryId)}
//             type="checkbox"
//             className="w-6 h-6 text-green-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//           />
//         </div>
//       );
//     },
//   },
//   {
//     field: "lineNo133",
//     headerName: `${a}`,
//     width: 90,
//     renderCell: (params) => {
//       return (
//         <div className="flex items-center mr-4">
//           <input
//             checked={selectedData.includes(params.row.categoryId)}
//             value={params.row.categoryId}
//             onChange={(e) => handleSelectProduct(e, params.row.categoryId)}
//             type="checkbox"
//             className="w-6 h-6 text-green-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//           />
//         </div>
//       );
//     },
//   },
//   {
//     field: "categoryId",
//     headerName: "ID",
//     width: 90,
//     editable: false,
//     type: "number",
//     headerClassName: "super-app-theme--header",
//     headerAlign: "center",
//   },
//   {
//     field: "name",
//     headerName: "Tên",
//     width: 130,
//     editable: false,
//   },

//   {
//     field: "alias",
//     headerName: "Bí danh",
//     type: "number",
//     width: 130,
//     editable: false,
//   },
//   {
//     field: "lineNo",
//     headerName: "Hiển thị",
//     width: 130,
//     editable: false,
//     type: "boolean",
//     renderCell: (params) => {
//       return <>{params.row.status === 1 ? "ok23" : "modsjao"}</>;
//     },
//   },
//   {
//     field: "actions",
//     headerName: "Chức năng",
//     width: 400,
//     renderCell: (params) => {
//       return (
//         <>
//           <Tippy content="Sửa">
//             <Link to={`/quantri/danhmuc/chinhsua/${params.row.alias}`}>
//               <IconButton color="success" className="me-2 hover:ring-2 ">
//                 <AiFillEdit />
//               </IconButton>
//             </Link>
//           </Tippy>

//           <Tippy content="Xoá">
//             <IconButton
//               color="error"
//               className="me-2 hover:ring-2 "
//               onClick={() => deleteData(params.row.categoryId)}
//             >
//               <AiOutlineDelete />
//             </IconButton>
//           </Tippy>

//           <Tippy content="Chi tiết">
//             <IconButton
//               color="primary"
//               className="me-2 hover:ring-2 "
//               onClick={() => {
//                 setVisible(!visible);
//                 setDetailId(params.row.categoryId);
//               }}
//             >
//               <BiShow />
//             </IconButton>
//           </Tippy>
//         </>
//       );
//     },
//   },
// ];

// const handleDeleteProducts = () => {
//   axios
//     .delete(`${API}/api/deleteAll/`, { data: { selectedData } })
//     .then(() => {
//       setCategories(
//         categories.filter(
//           (product) => !selectedData.includes(product.categoryId)
//         )
//       );
//       setSelectedData([]);
//     })
//     .catch((err) => console.log(err));
// };

// const handleSelectAllChange = (event) => {
//   const isChecked = event.target.checked;
//   if (isChecked) {
//     const allProductIds = categories.map((p) => p.categoryId);
//     setSelectedData(allProductIds);
//   } else {
//     setSelectedData([]);
//   }
// };

// const handleSelectProduct = (e, id) => {
//   if (e.target.checked) {
//     setSelectedData([...selectedData, id]);
//   } else {
//     setSelectedData(
//       selectedData.filter((productId) => productId !== id)
//     );
//   }
// };
