import React from "react";
import { Link } from "react-router-dom";
import logofooter from "../../assets/images/logofooter.png";

const AppFooter = () => {
  return (
    <div className="bg-black py-24">
      <div className="cs-container">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Link to="/">
              <img className="h-full" src={logofooter} alt="logo" />
            </Link>
            <p className="text-yellow-50">
              Kim huy.VN Trang Thông Tin Chính Thức.
            </p>
            <p className="text-yellow-50">
              ⛪ Địa chỉ: Số 19, Đường Phương Sài, Phường Phương Sơn, Thành phố
              Nha Trang, Tỉnh Khánh Hoà
            </p>
            <p className="text-yellow-50">Email : cua.ln.61cntt@gmail.com</p>
            <p className="cs-hover text-yellow-50">https://kimhuy.vn/</p>
            <p className="cs-hover text-yellow-50">
              https://twitter.com/kimhuy
            </p>
            <p className="cs-hover text-yellow-50">
              https://instagram.com/kimhuy
            </p>
            <p className="cs-hover text-yellow-50">
              https://facebook.com/pg/www.kimhuy
            </p>
            <p className="cs-hover text-yellow-50">
              https://www.youtube.com/www.Kim huy.vn
            </p>
            <p className="cs-hover text-yellow-50">http://bit.ly/kimhuy</p>

            {/* <iframe
              width="100%"
              height="254"
              src="https://www.youtube.com/embed/epcfWIT_Ais"
              title="Check-in Kim huy.vn cửa hàng Sneaker chính hãng uy tín nhất tại HCM"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe> */}
          </div>

          <div className="flex flex-col gap-5 text-yellow-50">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex flex-col gap-5">
                <h1 className="uppercase text-xl text-yellow-50 font-bold">
                  Hỗ trợ khách hàng
                </h1>
                <ul className="mt-3 flex flex-col gap-4">
                  <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                    <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Chăm sóc khách hàng
                    </Link>
                  </li>
                  <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                    <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Thanh toán
                    </Link>
                  </li>
                  <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                    <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Hướng dẫn mua hàng
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-5">
                <h1 className="uppercase text-xl text-yellow-50 font-bold">
                  Chính sách
                </h1>
                <ul className="mt-3 flex flex-col gap-4">
                <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Chế độ bảo hành
                    </Link>
                  </li>
                  <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                  <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Chính sách đổi trả
                    </Link>
                  </li>
                  <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                  <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Bảo mật thông tin
                    </Link>
                  </li>
                  <li className="item-footer  cs-hover text-yellow-50  flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-500">
                  <Link
                      className="no-underline text-current text-yellow-50"
                      to="/"
                    >
                      Chính sách giao nhận
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p>
              Số ĐKKD: 41N8041309 cấp ngày 17/8/2018. Nơi cấp Ủy Ban Nhân Dân
              Quận Tân Bình. Hộ Kinh Doanh: Kim huy. Hotline: 0909.300.746
            </p>
            <h1 className="text-2xl uppercase font-bold text-center">
              Chứng nhận
            </h1>
        
          </div>

          <div className="flex flex-col gap-5 text-yellow-50">
            <h1 className="uppercase text-xl text-yellow-50 font-bold">
              Fanpage
            </h1>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
