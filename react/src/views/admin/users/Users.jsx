import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag } from "primereact/tag";
import { AiFillEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { DataContext } from "../../../context/DataContext";

import axios from "axios";

import Swal from "sweetalert2";

import Button from "@mui/material/Button";

import UploadExcelForm from "../../../components/admin/uploadexcel/UploadExcelForm";
import { DetailCategory } from "../../../components/admin/categories";

import {API} from "../../../API";

import { Fab, IconButton } from "@mui/material";

import Tippy from "@tippyjs/react";
import { BiShow } from "react-icons/bi";

import { Toolbar } from "primereact/toolbar";
import DataGrid from "../../../components/admin/datatable/DataGrid";
import { MdDeleteForever } from "react-icons/md";


const Users = () => {
  const { state, dispatch  } = useContext(DataContext);

  const { adminUsers } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminUsers.length === 0) {
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    await axios.get(`${API}/api/adminUsers/`).then(({ data }) => {
      dispatch({ type: "FETCH_ADMINUSER", payload: data });
    });
  };

  const ApiExcel = `${API}/api/importExcel`;

  //model
  const [visible, setVisible] = useState(false);

  //detail
  const [detailId, setDetailId] = useState(null);
  const [detailFind, setDetailFnd] = useState([]);

  const deleteCategory = async (id) => {
    const findId = await adminUsers.find(
      (category) => category.categoryId === id
    );
    const isConfirm = await Swal.fire({
      title: `Bạn có chắc muốn xoá ${findId.name} ?`,
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
      .delete(`${API}/api/categories/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        dispatch({ type: 'SET_CATEGORIES', payload:  adminUsers.filter((product) => id != product.categoryId) });
        // setCategories(
        //   categories.filter((product) => id != product.categoryId)
        // );
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  async function asyncCall(id) {
    const getCategory = await adminUsers.find(
      (category) => category.categoryId === id
    );
    if (getCategory) {
      setDetailFnd(getCategory);
    }
  }
  asyncCall(detailId);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Sửa">
          <Link to={`/quantri/danhmuc/chinhsua/${rowData.alias}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>

        <Tippy content="Xoá">
          <IconButton
            color="error"
            className="me-2 hover:ring-2 "
            onClick={() => deleteCategory(rowData.categoryId)}
          >
            <AiOutlineDelete />
          </IconButton>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => {
              setVisible(!visible);
              setDetailId(rowData.categoryId);
            }}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    {
      field: "userId",
      header: "Mã",
      filter: true,
    },
    {
      field: "account",
      header: "Tên",
      filter: true,
    },
    {
      field: "fullName",
      header: "Bí danh",
      filter: true,
    },  {
      field: "email",
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
          <Link className="block" to={"/quantri/quantrivien/taomoi"}>
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
        <Button
          endIcon={<MdDeleteForever />}
          className={`${
            !selectedProducts || !selectedProducts.length ? "hidden" : ""
          } `}
          color="error"
          variant="contained"
          label="Delete"
          component="label"
          onClick={deleteSelectedProducts}
          disabled={!selectedProducts || !selectedProducts.length}
        >
          Xoá
        </Button>

        <UploadExcelForm
          className=""
          ApiExcel={ApiExcel}
          fetch={fetchCategories}
        />
      </div>
    );
  };

  function getIds(arr) {
    let ids = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      ids.push(obj.categoryId);
    }
    return ids;
  }

  const deleteSelectedProducts = async () => {
    let _products = adminUsers.filter((val) => selectedProducts.includes(val));
    setSelectedProducts(_products);
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
      .delete(`${API}/api/deleteAll/`, {
        data: {
          dataId: getIds(selectedProducts),
        },
      })
      .then(() => {
        dispatch({ type: 'SET_CATEGORIES', payload: adminUsers.filter(
          (product) => !getIds(selectedProducts).includes(product.categoryId)
        ) });
        setSelectedProducts([]);
        Swal.fire({
          icon: "success",
          text: "Đã xoá thành công"
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="relative">
    
       <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataGrid
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        data={adminUsers}
        col={col}
      />
      <DetailCategory
        detailFind={detailFind}
        visible={visible}
        setVisible={setVisible}
      />
      <button onClick={handleDeleteProducts}>Delete Selected Products</button> 
    </div>
  );
};

export default Users;

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
//             checked={selectedProducts.includes(params.row.categoryId)}
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
//             checked={selectedProducts.includes(params.row.categoryId)}
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
//               onClick={() => deleteCategory(params.row.categoryId)}
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
//     .delete(`${API}/api/deleteAll/`, { data: { selectedProducts } })
//     .then(() => {
//       setCategories(
//         categories.filter(
//           (product) => !selectedProducts.includes(product.categoryId)
//         )
//       );
//       setSelectedProducts([]);
//     })
//     .catch((err) => console.log(err));
// };

// const handleSelectAllChange = (event) => {
//   const isChecked = event.target.checked;
//   if (isChecked) {
//     const allProductIds = categories.map((p) => p.categoryId);
//     setSelectedProducts(allProductIds);
//   } else {
//     setSelectedProducts([]);
//   }
// };

// const handleSelectProduct = (e, id) => {
//   if (e.target.checked) {
//     setSelectedProducts([...selectedProducts, id]);
//   } else {
//     setSelectedProducts(
//       selectedProducts.filter((productId) => productId !== id)
//     );
//   }
// };
