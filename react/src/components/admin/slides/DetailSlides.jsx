import React from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Editor } from "primereact/editor";
import { Image } from "primereact/image";
import { API_IMAGES, API_SLIDE_IMAGES } from "../../../API";

const DetailSlides = (props) => {
  const { detailFind, visible, setVisible } = props;
  const renderHeader = () => {
    return <span className="ql-formats">Thông tin</span>;
  };
  console.log(detailFind);

  const header = renderHeader();
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Chi tiết sản phẩm"
        visible={visible}
        maximizable
        className="w-[90%] h-[80vh] xl:w-2/3"
        onHide={() => setVisible(false)}
      >
        {detailFind ? (
          <div
            className={`absolute btn right-5 z-50 text-white font-semibold ${
              detailFind.status === 1 ? "btn-success" : "btn-danger"
            }`}
          >
            {detailFind.status === 1 ? "Hiển thị" : "Ẩn"}
          </div>
        ) : (
          ""
        )}
        <div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
              <div>
                <Divider align="left">
                  <div className="inline-flex align-items-center">
                    <i className="pi pi-info-circle mr-2"></i>
                    <b>Mã sản phẩm</b>
                  </div>
                </Divider>
                <p className="pl-16">{detailFind && detailFind.slideId}</p>
              </div>


              <div className="">
                <Divider align="left">
                  <div className="inline-flex align-items-center">
                    <i className="pi pi-image mr-2"></i>
                    <b>Ảnh slide</b>
                  </div>
                </Divider>
                <Image
                  src={`${API_SLIDE_IMAGES}/${detailFind && detailFind.image}`}
                  alt="Image"
                  width="250"
                  preview
                />
              </div>
            </div>
     
        </div>
      </Dialog>
    </div>
  );
};

export default DetailSlides;
