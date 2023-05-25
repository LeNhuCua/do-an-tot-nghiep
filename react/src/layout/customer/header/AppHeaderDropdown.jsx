import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import avatar8 from "../../../assets/images/avatars/8.jpg";
import { CAvatar, CBadge, CDropdownHeader, CDropdownItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilLockLocked, cilUser } from "@coreui/icons";

import { useStateContext } from "../../../context/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client-customer";
import { AiOutlineCaretDown } from "react-icons/ai";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setUser, tokenCustomer, setTokenCustomer, token, user } =
    useStateContext();
  const navigate = useNavigate();
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setTokenCustomer(null);
      navigate("/");
    });
  };
  // const { tokenCustomer, user } = useStateContext();

  return (
    <div>
      <div onClick={handleClick} className="hover:cursor-pointer">
        <div className="flex items-center ">
          <div className="text-sm">Xin chào</div>
          <div className="text-sm  flex items-center font-bold uppercase text-gray-500 px-2 cs-hover">
            <AiOutlineCaretDown className="inline-block" />
            <span className="ml-1 inline-block ">
              {" "}
              {user ? user.account : ""}
            </span>
          </div>
        </div>
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
        <div className="hover:bg-gray-300 py-1 px-4">
          <Link to="/dondathang" className="no-underline">
            <div>
              <CIcon icon={cilBell} className="me-2" />
              Thông tin đơn hàng
              <CBadge color="info" className="ms-2">
                42
              </CBadge>
            </div>
          </Link>
        </div>
        
        <div className="hover:bg-gray-300 py-1 px-4">
          <Link to="/thongtincanhan" className="no-underline">
            <div>
              <CIcon icon={cilBell} className="me-2" />
              Thông tin cá nhân
              <CBadge color="info" className="ms-2">
                42
              </CBadge>
            </div>
          </Link>
        </div>
        <MenuItem className="border" onClick={onLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
}
