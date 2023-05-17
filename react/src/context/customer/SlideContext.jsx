import React, { createContext, useRef } from "react";

export const SlideContext = createContext();
const SlideProvider = ({children}) => {
  const swiperRef = useRef();
  const swiperRef1 = useRef();

  return (
    <SlideContext.Provider
      value={{ swiperRef, swiperRef1 }}
    >
        {children}
    </SlideContext.Provider>
  );
};

export default SlideProvider;
