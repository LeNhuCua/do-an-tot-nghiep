import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const Typography = React.lazy(() =>
  import("./views/theme/typography/Typography")
);

// Base
const Accordion = React.lazy(() => import("./views/base/accordion/Accordion"));
const Breadcrumbs = React.lazy(() =>
  import("./views/base/breadcrumbs/Breadcrumbs")
);
const Cards = React.lazy(() => import("./views/base/cards/Cards"));
const Carousels = React.lazy(() => import("./views/base/carousels/Carousels"));
const Collapses = React.lazy(() => import("./views/base/collapses/Collapses"));
const ListGroups = React.lazy(() =>
  import("./views/base/list-groups/ListGroups")
);
const Navs = React.lazy(() => import("./views/base/navs/Navs"));
const Paginations = React.lazy(() =>
  import("./views/base/paginations/Paginations")
);
const Placeholders = React.lazy(() =>
  import("./views/base/placeholders/Placeholders")
);
const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
const Progress = React.lazy(() => import("./views/base/progress/Progress"));
const Spinners = React.lazy(() => import("./views/base/spinners/Spinners"));
const Tables = React.lazy(() => import("./views/base/tables/Tables"));
const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));

// Buttons
const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
const ButtonGroups = React.lazy(() =>
  import("./views/buttons/button-groups/ButtonGroups")
);
const Dropdowns = React.lazy(() =>
  import("./views/buttons/dropdowns/Dropdowns")
);

//Forms
const ChecksRadios = React.lazy(() =>
  import("./views/forms/checks-radios/ChecksRadios")
);
const FloatingLabels = React.lazy(() =>
  import("./views/forms/floating-labels/FloatingLabels")
);
const FormControl = React.lazy(() =>
  import("./views/forms/form-control/FormControl")
);
const InputGroup = React.lazy(() =>
  import("./views/forms/input-group/InputGroup")
);
const Layout = React.lazy(() => import("./views/forms/layout/Layout"));
const Range = React.lazy(() => import("./views/forms/range/Range"));
const Select = React.lazy(() => import("./views/forms/select/Select"));
const Validation = React.lazy(() =>
  import("./views/forms/validation/Validation")
);

const Charts = React.lazy(() => import("./views/charts/Charts"));

// Icons
const CoreUIIcons = React.lazy(() =>
  import("./views/icons/coreui-icons/CoreUIIcons")
);
const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));

// Notifications
const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
const Toasts = React.lazy(() => import("./views/notifications/toasts/Toasts"));

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
const EditSlide = React.lazy(() => import("./views/admin/slides/EditSlide"));

//HOÁ ĐƠN
const Invoices = React.lazy(() => import("./views/admin/invoices/Invoices"));
const SalesReport = React.lazy(() =>
  import("./views/admin/totalrevenue/TotalRevenue")
);

// import SalesReport from ' '

const Users = React.lazy(() => import("./views/admin/users/Users"));
const CreateUser = React.lazy(() => import("./views/admin/users/CreateUser"));
const EditUser = React.lazy(() => import("./views/admin/users/EditUser"));
const RegisterAdmin = React.lazy(() =>
  import("./views/admin/register/Register")
);

//khách hàng

const Home = React.lazy(() => import("./views/customer/home/Home"));
const ShowCategories = React.lazy(() => import("./views/customer/categories/ShowCategories"));
const ShowTypeCategories = React.lazy(() => import("./views/customer/categories/ShowTypeCategories"));
const CheckOut = React.lazy(() => import("./views/customer/checkout/CheckOut"));


const ProductDetail = React.lazy(() =>
  import("./views/customer/detail/ProductDetail")
);
const ShoppingCart = React.lazy(() => import("./views/customer/shoppingCart/ShoppingCart"));







const Widgets = React.lazy(() => import("./views/widgets/Widgets"));

const routes = [
  { path: "/quantri", exact: true, name: "Trang chủ" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/theme", name: "Theme", element: Colors, exact: true },
  { path: "/theme/colors", name: "Colors", element: Colors },
  { path: "/theme/typography", name: "Typography", element: Typography },

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
  { path: "/slide/chinhsua/:id", name: "Sửa", element: EditSlide },

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
  { path: "/giohang", name: "Giỏ hàng", element: ShoppingCart },
  { path: "/dathang", name: "Giỏ hàng", element: CheckOut },

  





  { path: "/base", name: "Base", element: Cards, exact: true },
  { path: "/base/accordion", name: "Accordion", element: Accordion },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", element: Breadcrumbs },
  { path: "/base/cards", name: "Cards", element: Cards },
  { path: "/base/carousels", name: "Carousel", element: Carousels },
  { path: "/base/collapses", name: "Collapse", element: Collapses },
  { path: "/base/list-groups", name: "List Groups", element: ListGroups },
  { path: "/base/navs", name: "Navs", element: Navs },
  { path: "/base/paginations", name: "Paginations", element: Paginations },
  { path: "/base/placeholders", name: "Placeholders", element: Placeholders },
  { path: "/base/popovers", name: "Popovers", element: Popovers },
  { path: "/base/progress", name: "Progress", element: Progress },
  { path: "/base/spinners", name: "Spinners", element: Spinners },
  { path: "/base/tables", name: "Tables", element: Tables },
  { path: "/base/tooltips", name: "Tooltips", element: Tooltips },
  { path: "/buttons", name: "Buttons", element: Buttons, exact: true },
  { path: "/buttons/buttons", name: "Buttons", element: Buttons },
  { path: "/buttons/dropdowns", name: "Dropdowns", element: Dropdowns },
  {
    path: "/buttons/button-groups",
    name: "Button Groups",
    element: ButtonGroups,
  },
  { path: "/charts", name: "Charts", element: Charts },
  { path: "/forms", name: "Forms", element: FormControl, exact: true },
  { path: "/forms/form-control", name: "Form Control", element: FormControl },
  { path: "/forms/select", name: "Select", element: Select },
  {
    path: "/forms/checks-radios",
    name: "Checks & Radios",
    element: ChecksRadios,
  },
  { path: "/forms/range", name: "Range", element: Range },
  { path: "/forms/input-group", name: "Input Group", element: InputGroup },
  {
    path: "/forms/floating-labels",
    name: "Floating Labels",
    element: FloatingLabels,
  },
  { path: "/forms/layout", name: "Layout", element: Layout },
  { path: "/forms/validation", name: "Validation", element: Validation },
  { path: "/icons", exact: true, name: "Icons", element: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", element: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", element: Flags },
  { path: "/icons/brands", name: "Brands", element: Brands },
  {
    path: "/notifications",
    name: "Notifications",
    element: Alerts,
    exact: true,
  },
  { path: "/notifications/alerts", name: "Alerts", element: Alerts },
  { path: "/notifications/badges", name: "Badges", element: Badges },
  { path: "/notifications/modals", name: "Modals", element: Modals },
  { path: "/notifications/toasts", name: "Toasts", element: Toasts },
  { path: "/widgets", name: "Widgets", element: Widgets },
];

export default routes;
