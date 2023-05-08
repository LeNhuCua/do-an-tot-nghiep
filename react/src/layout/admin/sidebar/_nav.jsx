import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/quantri/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  {
    component: CNavTitle,
    name: "Quản lý",
  },
  {
    component: CNavGroup,
    name: "Menu",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Danh mục",
        to: "/quantri/danhmuc",
      },
      {
        component: CNavItem,
        name: "Danh mục con",
        to: "/quantri/danhmuccon",
      },
      // {
      //   component: CNavItem,
      //   name: "Loại sản phẩm",
      //   to: "/quantri/loaisanpham",
      // },
    ],
  },
  {
    component: CNavGroup,
    name: "Thông tin liên quan ",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Loại sản phẩm",
        to: "/quantri/loaisanpham",
      },
      {
        component: CNavItem,
        name: "Đơn vị tính",
        to: "/quantri/donvitinh",
      },
      // {
      //   component: CNavItem,
      //   name: "Loại sản phẩm",
      //   to: "/quantri/loaisanpham",
      // },
    ],
  },

  // {
  //   component: CNavItem,
  //   name: 'Danh mục',
  //   to: '/quantri/danhmuc',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Loại sản phẩm',
  //   to: '/quantri/loaisanpham',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: "Sản phẩm",
    to: "/quantri/sanpham",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Nhân viên",
    to: "/quantri/quantrivien",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: "Components",
  },
  
  {
    component: CNavGroup,
    name: "Bán hàng",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Lập hoá đơn",
        to: "/quantri/laphoadon",
      },
      {
        component: CNavItem,
        name: "Đơn hàng online",
        to: "/quantri/donhangonline",
      },
      // {
      //   component: CNavItem,
      //   name: "Loại sản phẩm",
      //   to: "/quantri/loaisanpham",
      // },
    ],
  },
  {
    component: CNavItem,
    name: "Thống kê",
    to: "/quantri/thongke",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Base',
    to: '/quantri/base/',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/quantri/base/accordion/',
      },
      {
        component: CNavItem,
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
];

export default _nav;
