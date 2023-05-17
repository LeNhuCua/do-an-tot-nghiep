import React from "react";

const Feature = (props) => {
  const data = props.data;
  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="text-[5.2rem]">
        {
          <data.icon
            size={50}
            className="hover:text-yellow-500 hover:cursor-pointer"
          />
        }
      </div>

      <div className="text-center">
        <h1 className="uppercase text-yellow-500 text-2xl font-bold">
          {data.name}
        </h1>
        <span className="font-bold text-sm">{data.delivery}</span>
        <p className="text-sm">{data.sub}</p>
      </div>
    </div>
  );
};

export default Feature;
