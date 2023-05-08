import React, { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineClose, AiOutlineEdit, AiOutlineUpload } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { API_IMAGES } from "../../../API";
import { Messages } from "primereact/messages";
function Test({ images, setImages }) {
  const msgs = useRef(null);
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

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      // maxFiles:2
    });
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      msgs.current.show([
        {
          sticky: true,
          severity: "success",
          summary: "Thành công!! ",
          detail:
            " Phía dưới là danh sách ảnh bạn vừa mới thêm, click vào chọn ảnh 1 lần nữa để xem toàn bộ ảnh",
          closable: false,
        },
      ]);
    }
  }, [acceptedFiles]);
  const removeImage = (image) => {
    const newImages = [...images];
    const index = newImages.indexOf(image);
    if (index !== -1) {
      newImages.splice(index, 1);
      setImages(newImages);
    }
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
          <p className="flex justify-center">Kéo và thả ảnh vào đây ...</p>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <p className="font-bold">
              Click vào đây hoặc kéo thả ảnh từ máy của bạn để thêm ảnh mới
            </p>
            <AiOutlineUpload className="text-blue-600" fontSize={25} />
          </div>
        )}
      </div>
      <div>
        {acceptedFiles && acceptedFiles.length > 0 ? (
          <Messages ref={msgs} />
        ) : (
          ""
        )}
        {acceptedFiles && acceptedFiles.length > 0 ? (
          acceptedFiles.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center basis-1/2 border p-3 rounded-md"
            >
              <img
                className="w-28"
                key={index}
                src={URL.createObjectURL(file)}
                alt=""
              />
              <div className="flex-grow">
                <h6>{file.name || file.image}</h6>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
            {Object.values(images).map((image, index) => {
              const imageUrl = image.name
                ? URL.createObjectURL(image)
                : `${API_IMAGES}/${image.image}`;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center basis-1/2 border p-3 rounded-md"
                >
                  <img
                    className="w-28"
                    key={image.productImageId}
                    src={imageUrl}
                    alt={image.name || image.image}
                  />
                  <div className="flex-grow">
                    <h6>{image.name || image.image}</h6>
                    <div className="flex items-center gap-4">
                      <button
                        className="w-8 h-8 hover:bg-yellow-200 flex justify-center items-center rounded-full"
                        onClick={() =>
                          document.getElementById(`image-${index}`).click()
                        }
                      >
                        <AiOutlineEdit
                          className="cursor-pointer text-yellow-600"
                          fontSize={25}
                        />
                      </button>
                      <div className="w-8 h-8 hover:bg-red-200 flex justify-center items-center rounded-full">
                        <AiOutlineClose
                          className="cursor-pointer text-red-600"
                          fontSize={25}
                          onClick={() => removeImage(image)}
                        />
                      </div>
                      <input
                        id={`image-${index}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) =>
                          setImages([
                            ...images.slice(0, index),
                            event.target.files[0] || {},
                            ...images.slice(index + 1),
                          ])
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* image && <img src={`${API_IMAGES}/${image}`} alt="" /> */}
      </div>
    </div>
  );
}

export default Test;
