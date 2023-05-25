import React from "react";
import { Link } from "react-router-dom";

const AppFooter = () => {
  return (
    <div className="bg-black py-24">
      <div className="cs-container">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Link to="/">
              <img
                className="h-full"
                src="https://vitejs.dev/logo-with-shadow.png"
                alt="logo"
              />
            </Link>
            <p className="text-white">
              Kim huy.VN Trang Thông Tin Chính Thức.
            </p>
            <p className="text-white">
              ⛪ Địa chỉ: 192/2 Nguyễn Thái Bình, Phường 12, Quận Tân Bình,
              Thành phố Hồ Chí Minh
            </p>
            <p className="text-white">Email : cskh.Kim huy.vn@gmail.com</p>
            <p className="cs-hover text-yellow-50">https://Kim huy.vn/</p>
            <p className="cs-hover text-white">
              https://twitter.com/Kim huy_vn
            </p>
            <p className="cs-hover text-white">
              https://instagram.com/Kim huy.vn
            </p>
            <p className="cs-hover text-white">
              https://facebook.com/pg/www.Kim huy.vn
            </p>
            <p className="cs-hover text-white">
              https://www.youtube.com/www.Kim huy.vn
            </p>
            <p className="cs-hover text-white">http://bit.ly/Kim huy_map</p>

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

          <div className="flex flex-col gap-5 text-white">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex flex-col gap-5">
                <h1 className="uppercase text-xl text-white font-bold">
                  Hỗ trợ khách hàng
                </h1>
                <ul className="mt-3 flex flex-col gap-4">
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <Link className="no-underline text-white" to="/">Chăm sóc khách hàng</Link>
                  </li>
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <a href="">Thanh toán</a>
                  </li>
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <a href="">Hướng dẫn mua hàng</a>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-5">
                <h1 className="uppercase text-xl text-white font-bold">
                  Chính sách
                </h1>
                <ul className="mt-3 flex flex-col gap-4">
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <a href="">Chế độ bảo hành</a>
                  </li>
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <a href="">Chính sách đổi trả</a>
                  </li>
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <a href="">Bảo mật thông tin</a>
                  </li>
                  <li className="item-footer cs-hover flex items-center gap-1 before:content-[''] before:w-0 before:h-[1px] before:inline-block before:bg-yellow-400">
                    <a href="">Chính sách giao nhận</a>
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
            <a
              className="flex justify-center"
              href="http://online.gov.vn/Home/WebDetails/86431"
            >
              <img
                className="h-[6.5rem]"
                src="https://Kim huy.vn/data/upload/media/logoSaleNoti.png"
                alt=""
              />
            </a>
          </div>

          <div className="flex flex-col gap-5 text-white">
            <h1 className="uppercase text-xl text-white font-bold">
              Fanpage
            </h1>
            <img className="w-full" src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/327444093_2788457291284176_7743836337035052954_n.jpg?stp=dst-jpg_p600x600&_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=kJB9PraYpwEAX_yKYSw&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfD-vXGCvdr3m6gOoC8aGblocwCxNPsB9RhDeIl2ZszaBw&oe=641769AD" alt="" />
            <img className="w-full" src="https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/335874112_140779275587337_5625903833141732777_n.jpg?stp=cp1_dst-jpg_p720x720&_nc_cat=111&ccb=1-7&_nc_sid=110474&_nc_ohc=nPoS_ej_neoAX95ff6z&_nc_ht=scontent.fsgn2-6.fna&oh=00_AfDkW5Wkchc9Yuj_sjwwjPqegHb8pypNXXHHUxKTA5giCw&oe=64188AF8" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
