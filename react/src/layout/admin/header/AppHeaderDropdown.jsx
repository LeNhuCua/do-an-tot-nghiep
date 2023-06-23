import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import avatar from "../../../assets/images/avatar.png";

import { CAvatar, CBadge, CDropdownHeader, CDropdownItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilAccountLogout,
  cilBell,
  cilLockLocked,
  cilUser,
} from "@coreui/icons";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../../context/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_IMAGES } from "../../../API";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setUser, setToken, token, user } = useStateContext();
  const navi = useNavigate();
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      navi("/quantri/dangnhap");
    });
  };

  return (
    <div>
      <div onClick={handleClick} className="hover:cursor-pointer">
        {user.avatar ? (
          <CAvatar src={`${API_IMAGES}/${user.avatar}`} size="md" />
        ) : (
          <CAvatar src={avatar} size="md" />
        )}
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <CDropdownHeader className="bg-light fw-semibold p-2 ">
          Account
        </CDropdownHeader>

        <div className="hover:bg-gray-300 py-1 px-4 ">
          <Link
            to="/quantri/thongtincanhan"
            className="no-underline text-gray-900 hover:text-yellow-500 duration-300"
          >
            <div>
              <CIcon icon={cilUser} className="me-2" />
              Thông tin cá nhân
            </div>
          </Link>
        </div>
        <div className="hover:bg-gray-300 py-1 px-4 ">
          <Link
            to="/quantri/doimatkhau"
            className="no-underline text-gray-900 hover:text-yellow-500 duration-300"
          >
            <div>
              <CIcon icon={cilLockLocked} className="me-2" />
              Đổi mật khẩu
            </div>
          </Link>
        </div>

        {/* <div className="hover:bg-gray-300 py-1 px-4">
          <Link to="/quantri/thongtincanhan" className="no-underline">
            <div >
              <CIcon icon={cilBell} className="me-2" />
                Thông tin cá nhân
              <CBadge color="info" className="ms-2">
                42
              </CBadge>
            </div>
          </Link>
        </div> */}

        <MenuItem className="border font-bold" onClick={onLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
}
