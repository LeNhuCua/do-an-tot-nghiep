import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { DataContext } from "../../../context/DataContext";

import Swal from "sweetalert2";

import { Button } from "primereact/button";

import UploadExcelForm from "../../../components/admin/uploadexcel/UploadExcelForm";

import { API } from "../../../API.js";

import { Fab, IconButton } from "@mui/material";

import Tippy from "@tippyjs/react";
import { BiShow } from "react-icons/bi";

import { Toolbar } from "primereact/toolbar";
import DataGrid from "../../../components/admin/datatable/DataGrid";

import Loading from "../../../components/Loading";

import { DetailTypeCategory } from "../../../components/admin/typecategories";
import axiosClient from "../../../axios-client";
import AppBreadcrumb from "../../../layout/admin/AppBreadcrumb";
import DataGridNoStatus from "../../../components/admin/datatable/DataGridNoStatus";

const Users = () => {
  // UseTitle("Loại sản phẩm");

  const { state, dispatch } = useContext(DataContext);

  const { users, products } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchUsers = async () => {
    await axiosClient.get(`${API}/api/users/`).then(({ data }) => {
      dispatch({ type: "FETCH_USERS", payload: data });
      setLoading(false);
    });
  };

  const ApiExcel = `${API}/api/users/importExcel`;

  //model
  const [visible, setVisible] = useState(false);

  //detail
  const [detailFind, setDetailFind] = useState([]);
  const showDetail = async (id) => {
    const getDetail = await users.find((users) => users.userId === id);

    if (getDetail) {
      setDetailFind(getDetail);
      setVisible(!visible);
    }
  };

  const actionButtons = (rowData) => {
    return (
      <>
        <Tippy content="Sửa">
          <Link to={`/quantri/danhmuccon/chinhsua/${rowData.userId}`}>
            <IconButton color="success" className="me-2 hover:ring-2 ">
              <AiFillEdit />
            </IconButton>
          </Link>
        </Tippy>

        <Tippy content="Chi tiết">
          <IconButton
            color="primary"
            className="me-2 hover:ring-2 "
            onClick={() => showDetail(rowData.userId)}
          >
            <BiShow />
          </IconButton>
        </Tippy>
      </>
    );
  };

  const col = [
    // {
    //   field: "userId",
    //   header: "Mã",
    //   filter: true,
    // },
    {
      field: "fullName",
      header: "Tên",
      filter: true,
    },
    {
      field: "email",
      header: "Email",
      filter: true,
    },
   
    {
      field: "role.name",
      header: "Chức vụ",
      filter: true,
    },
    // {
    //   field: "password",
    //   header: "Danh mục cha",
    //   filter: true,
    // },
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

        <UploadExcelForm className="" ApiExcel={ApiExcel} fetch={fetchUsers} />
      </div>
    );
  };

  //delete all Data

  const [selectedData, setSelectedData] = useState([]);

  function getIds(arr) {
    let ids = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      ids.push(obj.userId);
    }
    return ids;
  }

  const deleteSelectedData = async () => {
    let _data = users.filter((val) => selectedData.includes(val));
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
    await axiosClient
      .delete(`${API}/api/users/deleteAll`, {
        data: {
          dataId: getIds(selectedData),
        },
      })

      .then((response) => {
        if (response.data.status === 200) {
          dispatch({
            type: "SET_USERS",
            payload: users.filter(
              (product) => !getIds(selectedData).includes(product.userId)
            ),
          });
          dispatch({
            type: "SET_PRODUCTS",
            payload: products.filter(
              (product) => !getIds(selectedData).includes(product.userId)
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
  const ListBreadcrumb = [
    {
      name: "Quản lý nhân viên",
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
            data={users}
            col={col}
          />

          {Object.keys(detailFind).length ? (
            <DetailTypeCategory
              detailFind={detailFind}
              visible={visible}
              setVisible={setVisible}
            />
          ) : (
            ""
          )}
        </>
      )}
      {/* <button onClick={handleDeleteProducts}>Delete Selected Products</button> */}
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
//   axiosClient
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
