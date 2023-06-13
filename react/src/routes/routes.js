import React from "react";


//  ---- QUẢN TRỊ ----
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Profile = React.lazy(() => import("./views/admin/profile/Profile"));
const EditProfile = React.lazy(() =>
  import("./views/admin/profile/EditProfile")
);

//DANH MỤC SẢN PHẨM
const Categories = React.lazy(() =>
  import("./views/admin/categories/Categories")
);
const CreateCategory = React.lazy(() =>
  import("./views/admin/categories/CreateCategory")
);
const EditCategory = React.lazy(() =>
  import("./views/admin/categories/EditCategory")
);

//DANH MỤC CON
const TypeCategories = React.lazy(() =>
  import("./views/admin/typecategories/TypeCategories")
);
const CreateTypeCategory = React.lazy(() =>
  import("./views/admin/typecategories/CreateTypeCategory")
);
const EditTypeCategory = React.lazy(() =>
  import("./views/admin/typecategories/EditTypeCategory")
);

//LOẠI SẢN PHẨM
const ProductsType = React.lazy(() =>
  import("./views/admin/productstype/ProductsType")
);
const CreateProductType = React.lazy(() =>
  import("./views/admin/productstype/CreateProductType")
);
const EditProductType = React.lazy(() =>
  import("./views/admin/productstype/EditProductType")
);

//ĐƠN VỊ TÍNH
const Units = React.lazy(() => import("./views/admin/units/Units"));
const CreateUnit = React.lazy(() => import("./views/admin/units/CreateUnit"));
const EditUnit = React.lazy(() => import("./views/admin/units/EditUnit"));

//SẢN PHẨM
const Products = React.lazy(() => import("./views/admin/products/Products"));
const CreateProduct = React.lazy(() =>
  import("./views/admin/products/CreateProduct")
);
const EditProduct = React.lazy(() =>
  import("./views/admin/products/EditProduct")
);

//SLIDE
const Slides = React.lazy(() => import("./views/admin/slides/Slides"));
const CreateSlide = React.lazy(() =>
  import("./views/admin/slides/CreateSlide")
);


//HOÁ ĐƠN
const Invoices = React.lazy(() => import("./views/admin/invoices/Invoices"));
const SalesReport = React.lazy(() =>
  import("./views/admin/totalrevenue/TotalRevenue")
);

// NGười dùng quản trị
const Users = React.lazy(() => import("./views/admin/users/Users"));
const CreateUser = React.lazy(() => import("./views/admin/users/CreateUser"));
const EditUser = React.lazy(() => import("./views/admin/users/EditUser"));
const RegisterAdmin = React.lazy(() =>
  import("./views/admin/register/Register")
);



//-----KHÁCH HÀNG -------

const Home = React.lazy(() => import("./views/customer/home/Home"));
const ShowCategories = React.lazy(() => import("./views/customer/categories/ShowCategories"));
const ShowTypeCategories = React.lazy(() => import("./views/customer/categories/ShowTypeCategories"));
const CheckOut = React.lazy(() => import("./views/customer/checkout/CheckOut"));
const CheckOutSuccess = React.lazy(() => import("./views/customer/checkout/CheckOutSuccess"));
const SearchProducts = React.lazy(() =>
  import("./views/customer/SearchProducts/SearchProducts")
);
const ProductDetail = React.lazy(() =>
  import("./views/customer/detail/ProductDetail")
);
const ShoppingCart = React.lazy(() => import("./views/customer/shoppingCart/ShoppingCart"));






const routes = [
  { path: "/quantri", exact: true, name: "Trang chủ" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },

  {
    path: "/thongtincanhan",
    name: "Thông tin cá nhân",
    element: Profile,
    exact: true,
  },
  { path: "/thongtincanhan/chinhsua", name: "Chỉnh sửa", element: EditProfile },

  // ,
  // {
  //   path: "/thongtincanhan",
  //   name: "Thông tin cá nhân",
  //   element: Profile,

  //   routes: [
  //     {
  //       path: "/thongtincanhan/chinhsua/",
  //       name: "Chỉnh sửa",
  //       component: EditProfile,
  //     },

  //   ],
  // },

  //DANH MỤC
  { path: "/danhmuc", name: "Danh mục", element: Categories },
  { path: "/danhmuc/taomoi", name: "Tạo danh mục", element: CreateCategory },
  {
    path: "/danhmuc/chinhsua/:id",
    name: "Danh mục sửa",
    element: EditCategory,
  },

  //DANH MỤC CON

  { path: "/danhmuccon", name: "Danh mục con", element: TypeCategories },
  {
    path: "/danhmuccon/taomoi",
    name: "Tạo mới danh mục con",
    element: CreateTypeCategory,
  },
  {
    path: "/danhmuccon/chinhsua/:id",
    name: "Sửa danh mục con",
    element: EditTypeCategory,
  },

  //LOAI SAN PHAM
  { path: "/loaisanpham", name: "Loại sản phẩm", element: ProductsType },
  {
    path: "/loaisanpham/taomoi",
    name: "Tạo loại sản phẩm",
    element: CreateProductType,
  },
  {
    path: "/loaisanpham/chinhsua/:id",
    name: "Loại sản phẩm sửa",
    element: EditProductType,
  },

  //ĐƠN VỊ TÍNH
  { path: "/donvitinh", name: "Đơn vị tính", element: Units },
  { path: "/donvitinh/taomoi", name: "Tạo Đơn vị tính", element: CreateUnit },
  {
    path: "/donvitinh/chinhsua/:id",
    name: "Đơn vị tính sửa",
    element: EditUnit,
  },

  //SAN PHAM
  { path: "/sanpham", name: "Sản phẩm", element: Products },
  { path: "/sanpham/taomoi", name: "Tạo  sản phẩm", element: CreateProduct },
  { path: "/sanpham/chinhsua/:id", name: "sản phẩm sửa", element: EditProduct },

  //SLIDES
  { path: "/slide", name: "Slides", element: Slides },
  { path: "/slide/taomoi", name: "Tạo  slide", element: CreateSlide },


  { path: "/quantrivien", name: "Quản trị", element: Users },
  { path: "/quantrivien/taomoi", name: "Tạo quản trị", element: RegisterAdmin },
  {
    path: "/quantrivien/chinhsua/:account",
    name: "Sửa quản trị",
    element: EditUser,
  },

  //Lap hoa don
  { path: "/laphoadon", name: "Lập hoá đơn", element: Invoices },

  //THỐNG KÊ
  { path: "/thongke", name: "Thống kê", element: SalesReport },

  // { path: '/thongtincanhan/chinhsua', name: 'Chỉnh sửa', element: EditProfile },



  //khách hàng
  { path: "/", exact: true, name: "Trang chủ", element: Home },
  { path: "/danhmuc/:alias", name: "Danh mục", element: ShowCategories },
  { path: "/danhmuccon/:alias", name: "Danh mục", element: ShowTypeCategories },

  // { path: "/", name: "Trang chủ", element: Home },
  { path: "/sanpham/:alias", name: "Trang chủ", element: ProductDetail },
  { path: "/timkiem/:search", name: "Tìm kiếm", element: SearchProducts },
  { path: "/giohang", name: "Giỏ hàng", element: ShoppingCart },
  { path: "/dathang", name: "Đặt hàng", element: CheckOut },
  { path: "/dathangthanhcong", name: "Đặt hàng thành công", element: CheckOutSuccess },
  
  
];

export default routes;
