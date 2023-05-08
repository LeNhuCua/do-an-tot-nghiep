import React from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";

const DetailUnit = (props) => {
  const { detailFind, visible, setVisible } = props;
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Chi tiết đơn vị tính"
        visible={visible}
        maximizable
        className="w-[90%] h-[60vh] xl:w-1/2"
        onHide={() => setVisible(false)}
      >
        <div className="mt-5">
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <i className="pi pi-info-circle mr-2"></i>
              <b>Mã đơn vị tính</b>
            </div>
          </Divider>
          <p className="pl-16">{detailFind && detailFind.unitId}</p>
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <i className="pi pi-circle mr-2"></i>
              <b>Tên đơn vị tính</b>
            </div>
          </Divider>
          <p className="pl-16">{detailFind && detailFind.name}</p>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailUnit;
