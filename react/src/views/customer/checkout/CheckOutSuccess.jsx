import React from "react";
import phaohoa from "../../../assets/images/phaohoa.png";
import logo from "../../../assets/images/logo.png";
const CheckOutSuccess = () => {
  return (
    <div className="relative lg:mt-12 mt-6">
      <div className="absolute  right-0 lg:right-3 animate-ping1">
        <img className="h-32 lg:h-80" src={phaohoa} alt="" srcset="" />
      </div>
      <div className="absolute  left-0 lg:left-3 h-24 lg:h-60  animate-ping1">
        <img className="h-24 lg:h-60" src={phaohoa} alt="" srcset="" />
      </div>
      <div className="cs-container flex flex-col items-center gap-3">
    
        <div>
          <h1 className="text-xl text-center font-bold text-[#FFBD71] uppercase">
            Đặt hàng thành công
          </h1>
          <h1 className="text-xl text-center">
            Cảm ơn bạn đã đặt hàng tại cửa hàng Kim Huy
          </h1>
        </div>
        <div>
          <p className="text-center">
            Chuyên viên CSKH sẽ <span className="font-bold">gọi điện</span> gọi điện cho bạn để xác nhận đơn hàng.!!!
          </p>
          <p className="text-center">
            Bạn vui lòng vào  <span className="font-bold">email</span> để xem thông tin chi tiết về đơn hàng.!!!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSuccess;
