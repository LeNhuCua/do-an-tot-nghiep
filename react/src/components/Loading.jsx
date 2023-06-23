import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  return (
  
      <div className="fixed top-1/2 z-[9999] left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <ProgressSpinner
          style={{ width: "6.25rem", height: "6.25rem" }}
          strokeWidth="8"
          // fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
  
  );
};

export default Loading;
