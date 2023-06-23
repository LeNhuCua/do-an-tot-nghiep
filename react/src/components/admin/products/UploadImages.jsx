import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { API, API_IMAGES } from "../../../API";
import { Accordion, AccordionTab } from "primereact/accordion";
import Swal from "sweetalert2";
import axios from "axios";

function UploadImages({ images, setImages, imagesCurrent ,setImagesCurrent}) {
  console.log(imagesCurrent);
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Thêm các ảnh được chọn vào mảng `images`
      const filteredFiles = acceptedFiles.filter(
        (file) =>
          file.type === "image/jpeg" || // kiểm tra định dạng file là ảnh
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/bmp" ||
          file.type === "image/jpg"
      );
      setImages([...images, ...filteredFiles]);
    },
    [images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    // maxFiles:2
  });
  const removeImage = (image) => {
    const newImages = [...images];
    const index = newImages.indexOf(image);
    if (index !== -1) {
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  const deleteImage = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Bạn có chắc muốn xoá ảnh này?",
      text: "Không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận!",
      cancelButtonText: "Huỷ bỏ!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    await axios
      .delete(`${API}/api/products/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        const img =  imagesCurrent.filter((image) => image.productImageId !== id);
        setImagesCurrent(img)
        // fetchProducts();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };


  return (
    <div className="py-3 px-1 border border-gray-400">
      <div
        {...getRootProps({ accept: "image/*" })}
        className={`dropzone  p-6 border-dashed border-2 border-blue-600 cursor-pointer ${
          isDragActive ? "isActive" : ""
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="flex justify-center">Kéo và thả ảnh vào đây...</p>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <p className="font-bold">Thêm ảnh mới</p>
            <AiOutlineUpload className="text-blue-600" fontSize={25} />
          </div>
        )}
      </div>
      <div>
        {Object.values(images).length > 0 && (
          <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
            {Object.values(images).map((image, index) => (
              <div
                key={index}
                className="flex justify-between items-center basis-1/2 border p-3 rounded-md"
              >
                <img
                  className="w-28"
                  key={image.name}
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                />
                <h6>{image.name}</h6>
                <div className="w-8 h-8 hover:bg-red-200 flex justify-center items-center rounded-full">
                  <AiOutlineClose
                    className="cursor-pointer text-red-600"
                    fontSize={25}
                    onClick={() => removeImage(image)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <Accordion>
            <AccordionTab
              header={
                <div className="flex align-items-center">
                  <i className="pi pi-images mr-2"></i>
                  <span className="vertical-align-middle">
                    Ảnh liên quan hiện tại
                  </span>
                </div>
              }
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
                {imagesCurrent
                  ? imagesCurrent.map((imageCurrent) => {
                      return (
                        <div
                          key={imageCurrent.productImageId}
                          className="flex justify-between items-center basis-1/2 border p-3 rounded-md"
                        >
                          <img
                            className="w-28"
                            src={`${API_IMAGES}/${imageCurrent.image}`}
                            alt={imageCurrent}
                          />
                          <h6>{imageCurrent.image}</h6>
                          <div className="w-8 h-8 hover:bg-red-200 flex justify-center items-center rounded-full">
                            <AiOutlineClose
                              className="cursor-pointer text-red-600"
                              fontSize={25}
                              onClick={() =>  deleteImage(imageCurrent.productImageId)}
                            />
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default UploadImages;
