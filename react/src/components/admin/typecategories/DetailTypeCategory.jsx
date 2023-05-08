import React from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";

const DetailTypeCategory = (props) => {
  const { detailFind, visible, setVisible } = props;
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Chi tiết menu cấp 2"
        visible={visible}
        maximizable
        className="w-[90%] h-[60vh] xl:w-1/2"
        onHide={() => setVisible(false)}
      >
        {detailFind ? (
          <div
            className={`absolute btn right-5 text-white font-semibold ${
              detailFind.status === 1 ? "btn-success" : "btn-danger"
            }`}
          >
            {detailFind.status === 1 ? "Hiển thị" : "Ẩn"}
          </div>
        ) : (
          ""
        )}
        <div className="mt-5">
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
            <div>
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <i className="pi pi-info-circle mr-2"></i>
                  <b>Mã loại</b>
                </div>
              </Divider>
              <p className="pl-16">{detailFind && detailFind.categoryId}</p>
            </div>
            <div>
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <i className="pi pi-circle mr-2"></i>
                  <b>Tên loại</b>
                </div>
              </Divider>
              <p className="pl-16">{detailFind && detailFind.name}</p>
            </div>
            <div>
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <i className="pi pi-pencil mr-2"></i>
                  <b>Bí danh</b>
                </div>
              </Divider>
              <p className="pl-16">{detailFind && detailFind.alias}</p>
            </div>
            <div>
            <Divider align="left">
              <div className="inline-flex align-items-center">
                <i className="pi pi-file mr-2"></i>
                <b>Danh mục cha cấp 1</b>
              </div>
            </Divider>
            <p className="pl-16">{detailFind && detailFind.category.name}</p>
            </div>
         
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailTypeCategory;
