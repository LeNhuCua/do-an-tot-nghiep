import React, { createContext, useState } from "react";
export const MenusContext = createContext();

const MenusProvider = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  const Open = () => {
    setSearchOpen(!searchOpen);
  };
  return <MenusContext.Provider value={{searchOpen,Open,hoverIndex,setHoverIndex}}>{children}</MenusContext.Provider>;
};

export default MenusProvider;
