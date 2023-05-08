import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  return (
    <div className="fixed top-1/2 left-1/2">
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  );
};

export default Loading;
