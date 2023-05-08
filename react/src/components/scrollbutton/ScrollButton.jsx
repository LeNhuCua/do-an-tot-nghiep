import React, { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 150) {
      setVisible(true);
    } else if (scrolled <= 150) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
		in place of 'smooth' */
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <button
      style={{ display: visible ? "flex" : "none" }}
      onClick={scrollToTop}
      className="bg-gray-800 w-14 h-14 rounded-full  items-center justify-center fixed z-[99999] bottom-3 right-3 hover:bg-yellow-600 transition-all duration-300 hover:cursor-pointer"
    >
      <IoIosArrowUp className="text-white text-3xl" />
    </button>
  );
};

export default ScrollButton;
