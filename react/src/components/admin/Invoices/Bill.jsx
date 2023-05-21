import React from "react";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Bill = (props) => {
  const { c, removeFromInvoice, increaseAmount, reduceAmount } = props;
  console.log(c);
  return (
    <div className="">
      <div
        key={c.productId}
        className="flex border my-2 relative flex-wrap w-full p-3 align-items-center gap-3  hover:bg-blue-100 rounded-lg"
      >
        <div
          onClick={() => removeFromInvoice(c.productId, c.sizeId)}
          className="absolute p-1 hover:cursor-pointer text-white hover:bg-yellow-500 rounded-full bg-slate-500 right-0 -top-2"
        >
          <AiOutlineClose />
        </div>
        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
          <span className="font-bold">{c.name}</span>
          <div className="flex align-items-center gap-2">
            <i className="pi pi-tag text-sm"></i>
            <span>{c.productId}</span>
          </div>
          <h6>
            Size: <span> {c.sizeValue}</span>
          </h6>

          <span className="font-bold text-900">
            ${" "}
            {new Intl.NumberFormat({
              style: "currency",
              currency: "JPY",
            }).format(c.sizePrice)}{" "}
            VNĐ
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            className="w-6 h-6 bg-green-500 rounded-md hover:bg-green-400 text-white cursor-pointer flex items-center justify-center"
            onClick={() => increaseAmount(c.productId, c.sizeId)}
          >
            <AiOutlinePlus />
          </button>
          <h2>{c.amount}</h2>
          <button
            className="w-6 h-6 bg-green-500 rounded-md hover:bg-green-400 text-white cursor-pointer flex items-center justify-center"
            onClick={() => reduceAmount(c.productId, c.sizeId)}
          >
            <AiOutlineMinus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
