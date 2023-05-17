import React, { createContext, useState } from "react";

export const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const Handle = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };
  return (
    <SidebarContext.Provider
      value={{ isOpenSidebar, Handle, setIsOpenSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
