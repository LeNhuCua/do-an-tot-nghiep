import React, { createContext, useState } from "react";

export const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const Open = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, Open }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
