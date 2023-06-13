import React from "react";
//-----KHÁCH HÀNG -------

const Home = React.lazy(() => import("../views/customer/home/Home"));
const ShowCategories = React.lazy(() =>
  import("../views/customer/categories/ShowCategories")
);
const ShowTypeCategories = React.lazy(() =>
  import("../views/customer/categories/ShowTypeCategories")
);
const CheckOut = React.lazy(() =>
  import("../views/customer/checkout/CheckOut")
);
const CheckOutSuccess = React.lazy(() =>
  import("../views/customer/checkout/CheckOutSuccess")
);
const SearchProducts = React.lazy(() =>
  import("../views/customer/SearchProducts/SearchProducts")
);
const ProductDetail = React.lazy(() =>
  import("../views/customer/detail/ProductDetail")
);
const ShoppingCart = React.lazy(() =>
  import("../views/customer/shoppingCart/ShoppingCart")
);

const Profile = React.lazy(() => import("../views/customer/profile/Profile"));
const ChangePassword = React.lazy(() => import("../views/customer/changepass/ChangePassword"));



const EditProfile = React.lazy(() =>
  import("../views/customer/profile/EditProfile")
);

const Order = React.lazy(() => import("../views/customer/order/Order"));
const OrderDetail = React.lazy(() =>
  import("../views/customer/order/OrderDetail")
);
const SendMessage = React.lazy(() =>
  import("../views/customer/message/SendMessage")
);
const ExchangeRate = React.lazy(() =>
  import("../views/customer/exchangeRate/ExchangeRate")
);

const SizeAway = React.lazy(() =>
  import("../views/customer/sizeAway/SizeAway")
);

const routes = [
  //khách hàng
  { path: "/", exact: true, name: "Trang chủ", element: Home },
  { path: "/danhmuc/:alias", name: "Danh mục", element: ShowCategories },
  { path: "/danhmuccon/:alias", name: "Danh mục", element: ShowTypeCategories },

  // { path: "/", name: "Trang chủ", element: Home },
  { path: "/sanpham/:alias", name: "Chi tiết", element: ProductDetail },
  { path: "/huongdandosize", name: "Chi tiết", element: SizeAway },

  { path: "/timkiem/:search", name: "Tìm kiếm", element: SearchProducts },
  { path: "/giohang", name: "Giỏ hàng", element: ShoppingCart },
  { path: "/dathang", name: "Đặt hàng", element: CheckOut },
  {
    path: "/dathangthanhcong",
    name: "Đặt hàng thành công",
    element: CheckOutSuccess,
  },

  {
    path: "/thongtincanhan",
    name: "Thông tin cá nhân",
    element: Profile,
    exact: true,
  },
  { path: "/thongtincanhan/chinhsua", name: "Chỉnh sửa", element: EditProfile },
  { path: "/doimatkhau", name: "Dổi mật khẩu", element: ChangePassword },

  { path: "/dondathang", name: "Dơn đặt hàng", element: Order },
  {
    path: "/dondathang/chitietdonhang/:id",
    name: "Chi tiết đơn đặt",
    element: OrderDetail,
  },
  { path: "/tinnhan", name: "Dơn đặt hàng", element: SendMessage },
  { path: "/xemtigia", name: "Tỉ giá", element: ExchangeRate },
];

export default routes;
