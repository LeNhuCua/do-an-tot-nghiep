import React, { useState } from "react";

import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { useForm } from "react-hook-form";
import { CCol, CForm } from "@coreui/react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useEffect } from "react";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import { API } from "../../../API";

const DetailShippingCost = (props) => {
  const { detailFind, visible, setVisible,fetchShippingCost } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    form,
    control,
  } = useForm({
    mode: "onChange",
  });
  const [shippingCost, setShippingCost] = useState(null);
  console.log(detailFind);
  useEffect(() => {
    setShippingCost(detailFind.shippingCost);
  }, [detailFind]);

  const updateData = async () => {
    const formData = {
      _method: "PATCH",
      shippingCost: shippingCost,
    };

    await axiosClient
      .put(
        `${API}/api/admin-shippingCosts/${detailFind.shippingCostId}`,
        formData
      )
      .then((response) => {
        setVisible(false)
        if (response.data.status === 400) {
          // if (data.productId !== product.productId) {
            fetchShippingCost();
          // }
          // navigate("/quantri/sanpham");

          Swal.fire({
            icon: "success",
            title: "Thông tin đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "Kiểm tra lại thông tin",
          });
        }
      });
  };
  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Cập nhật phí giao hàng"
        visible={visible}
        maximizable
        className="w-[90%] h-[60vh] xl:w-1/2"
        onHide={() => setVisible(false)}
      >
        <div className="mt-5">
          <CForm className="row g-4" onSubmit={handleSubmit(updateData)}>
            <CCol md={6}>
              <span className="p-float-label ">
                <InputNumber
                  id="price"
                  suffix=" VNĐ"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.value)}
                  type="text"
                  placeholder="Vd: 55.000"
                  className="w-full md:w-14rem"
                  min={0}
                />

                <label htmlFor="price">Phí giao hàng</label>
              </span>

              {/* {validationError.name && (
        <small className="cs-text-error">
          Tên loại sản phẩm đã tồn tại
        </small>
      )} */}
            </CCol>
            <CCol xs={6}>
              <Button className="youtube p-0 w-full justify-center">
                <i className="pi pi-check"></i>
                <span className="p-3">Xác nhận</span>
              </Button>
            </CCol>
          </CForm>
        </div>
      </Dialog>
    </div>
  );
};

export default DetailShippingCost;
