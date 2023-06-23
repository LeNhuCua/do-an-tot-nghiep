import React from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { API_IMAGES } from "../../../API";

const DetailUser = (props) => {
  const { detailFind, visible, setVisible } = props;
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header={`Chi tiết nhân viên ${detailFind.fullName}`}
        visible={visible}
        maximizable
        className="w-[90%] h-[80vh] xl:w-2/3"
        onHide={() => setVisible(false)}
      >
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
          <div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-info-circle mr-2"></i>
                <b>Họ và tên</b>
              </div>
            </Divider>
            <p className="pl-16">{detailFind && detailFind.fullName}</p>
          </div>
          <div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-circle mr-2"></i>
                <b>Email</b>
              </div>
            </Divider>
            <p className="pl-16">{detailFind && detailFind.email}</p>
          </div>
          <div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-pencil mr-2"></i>
                <b>Chức vụ</b>
              </div>
            </Divider>
            <p className="pl-16">{detailFind && detailFind.role.name}</p>{" "}
          </div>

          {/* <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-stop mr-2"></i>
                      <b>Trọng lượng</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.weight}{" "}
                    {detailFind && detailFind.unit.name}
                  </p>{" "}
                </div> */}
          <div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-eraser mr-2"></i>
                <b>Giới tính</b>
              </div>
            </Divider>
            <p className="pl-16">
              {detailFind && detailFind.gender === 1
                ? "Nam"
                : detailFind && detailFind.gender === 0
                ? "Nữ"
                : "Chưa cập nhật"}
            </p>
          </div>
          <div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-file mr-2"></i>
                <b>Số điện thoại</b>
              </div>
            </Divider>
            <p className="pl-16">
              {detailFind && detailFind.phoneNumber
                ? detailFind.phoneNumber
                : "Chưa cập nhật"}
            </p>
          </div>
          <div className="">
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-image mr-2"></i>
                <b>Ảnh đại diện</b>
              </div>
            </Divider>
            <Image
              src={`${API_IMAGES}/${detailFind && detailFind.avatar}`}
              alt="Ảnh đại diện"
              width="250"
              preview
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailUser;
