import React, { useContext, useEffect, useState } from "react";
import { AiFillBell, AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import Loading from "../../components/Loading";
import { useStateContext } from "../../context/ContextProvider";
import { SidebarContext } from "../../context/SidebarContext";
import useOnClickOutsideRef from "../../hook/OnClickOutside";

// import { HiOutlineMenuAlt1 } from "react-icons/hi";

const Header = () => {
  const { setUser, setToken, token, user } = useStateContext();
  const [isOpenAvatar, setIsOpenAvatar] = useState(false);
  const ref = useOnClickOutsideRef(() => setIsOpenAvatar(false));

  // const refOpen = useOnClickOutsideRef(() => setIsOpen(false));

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then((res) => {
      setUser(res.data.user);
    });
  }, []);

  if (!user) {
    return <Loading />;
  }

  let Author = "";
  if (!token) {
    Author = (
      <>
        <Link to="dangki">dang ki</Link>
        <Link to="login">login</Link>
      </>
    );
  } else Author = <button onClick={onLogout}>Đăng xuất</button>;

  return (
    <div className={`bg-white fixed w-full z-50`}>
      <header className="flex justify-between items-center h-[4rem] shadow-md  p-3 w-full">
        <div
          // ref={refOpen}
          className="cursor-pointer hover:text-yellow-400 transition-all duration-300 "
    
        >
          <div className="text-2xl">
            <AiOutlineMenu />
          </div>
        </div>
        <div className="flex gap-9 items-center">
          {/* <div className="flex items-center gap-4 bg-gray-200 p-2 rounded-xl">
            <div className="cursor-pointer text-gray-400 hover:text-yellow-400 transition-all duration-300">
              <AiOutlineSearch className="text-2xl " />
            </div>
            <input
              className="border-none outline-none bg-transparent"
              type="text"
              placeholder="Tim kiem"
            />
          </div> */}
          <div className="cursor-pointer text-white transition-all duration-300 w-10 h-10 bg-black flex items-center justify-center rounded-full hover:bg-yellow-400 before:content-['0'] before:flex before:items-center before:justify-center before:text-[0.75rem] before:border relative before:absolute before:-top-2 before:rounded-full before:-right-1 before:w-5 before:h-5 before:bg-yellow-400">
            <AiFillBell className="text-2xl " />
          </div>

          <div className="cursor-pointer text-white transition-all duration-300 w-10 h-10 bg-black flex items-center justify-center rounded-full hover:bg-yellow-400 before:content-['0'] before:flex before:items-center before:justify-center before:text-[0.75rem] before:border relative before:absolute before:-top-2 before:rounded-full before:-right-1 before:w-5 before:h-5 before:bg-yellow-400">
            <AiFillBell className="text-2xl " />
          </div>

          <div
            ref={ref}
            onClick={() => setIsOpenAvatar(!isOpenAvatar)}
            className=" w-10 h-10 cursor-pointer relative"
          >
            <img
              className="rounded-full w-full h-full object-cover"
              src="https://tse3.mm.bing.net/th?id=OIP.sVJbj_7kw12e4kBcWifP9AHaFd&pid=Api&P=0"
              alt="anh"
            />
            {isOpenAvatar ? (
              <div className="absolute bg-white border w-48 right-2 top-[4rem] rounded-md">
                <ul>
                  <li className="p-2 hover:bg-gray-200 transition-all duration-300">
                    <a href=""> Thông tin tài khoản</a>
                   
                  </li>
                  <li className="p-2 hover:bg-gray-200 transition-all duration-300">
                    Đổi mật khẩu
                  </li>
                  <li className="p-2 hover:bg-gray-200 transition-all duration-300">
                    {Author}
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>

          {user ? <p className=" p-5">Ten : {user.fullname}</p> : ""}
        </div>
      </header>
    </div>
  );
};

export default Header;
