import React from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import { Editor } from "primereact/editor";
import { Image } from "primereact/image";
import { API_IMAGES } from "../../../API";

const DetailProducts = (props) => {
  const { detailFind, visible, setVisible } = props;
  console.log(detailFind);
  const renderHeader = () => {
    return <span className="ql-formats">Thông tin</span>;
  };

  const header = renderHeader();
  const renderImages = detailFind.product_image.map((image) => (
    <Image
      key={image.productImageId}
      src={`http://localhost:8000/product/image/${image.image}`}
      alt="Image"
      width="250"
      preview
    />
  ));
  const renderSizes = detailFind.product_size.map((size) => (
    // <Image
    //   key={image.productImageId}
    //   src={`http://localhost:8000/product/image/${image.image}`}
    //   alt="Image"
    //   width="250"
    //   preview
    // />
    <div>
      <Divider align="left">
        <div className="inline-flex align-items-center">
          <i className="pi pi-info-circle mr-2"></i>
          <b>Size: {size.size ? size.size[0].sizeValue : "2424324234"}</b>
        </div>
      </Divider>
      <p className="pl-16">Giá: {size.price}</p>
    </div>
  ));
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
          <TabView>
            <TabPanel header="Thông tin chung" leftIcon="pi pi-calendar mr-2">
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-info-circle mr-2"></i>
                      <b>Mã sản phẩm</b>
                    </div>
                  </Divider>
                  <p className="pl-16">{detailFind && detailFind.productId}</p>
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-circle mr-2"></i>
                      <b>Tên sản phẩm</b>
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
                  <p className="pl-16">{detailFind && detailFind.alias}</p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-dollar mr-2"></i>
                      <b>Giá</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {" "}
                    {new Intl.NumberFormat({
                      style: "currency",
                      currency: "JPY",
                    }).format(detailFind && detailFind.price)}{" "}
                    đ
                  </p>{" "}
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-shield mr-2"></i>
                      <b>Số lượng tồn</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {" "}
                    {new Intl.NumberFormat({
                      style: "currency",
                      currency: "JPY",
                    }).format(detailFind && detailFind.number)}{" "}
                    chiếc
                  </p>{" "}
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
                      <b>Loại vàng</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.product_type.name}
                  </p>
                </div>
                <div>
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-file mr-2"></i>
                      <b>Thuộc menu</b>
                    </div>
                  </Divider>
                  <p className="pl-16">
                    {detailFind && detailFind.type_category.name}
                  </p>
                </div>
                <div className="">
                  <Divider align="left">
                    <div className="inline-flex align-items-center">
                      <i className="pi pi-image mr-2"></i>
                      <b>Ảnh bìa</b>
                    </div>
                  </Divider>
                  <Image
                    src={`${API_IMAGES}/${detailFind && detailFind.avatar}`}
                    alt="Image"
                    width="250"
                    preview
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Mô tả" rightIcon="pi pi-user ml-2">
              <div className="m-0">
                <Editor
                  name="blog"
                  value={detailFind && detailFind.description}
                  headerTemplate={header}
                  style={{ height: "20rem" }}
                />
              </div>
            </TabPanel>
            <TabPanel header="Ảnh liên quan" rightIcon="pi pi-images ml-2">
              <div className="grid grid-cols-2 xl:grid-cols-3">
                {renderImages}
              </div>
            </TabPanel>
            <TabPanel header="Kích thước" rightIcon="pi pi-images ml-2">
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2">
                {renderSizes}
              </div>
            </TabPanel>
          </TabView>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailProducts;
