import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { API_IMAGES } from "../../../API";

function UploadImages({ images, setImages }) {
  console.log(images);
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
      'image/jpeg': [],
      'image/png': []
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
            <p className="font-bold">Click vào đây hoặc kéo thả ảnh từ máy của bạn</p>
            <AiOutlineUpload className="text-blue-600" fontSize={25}/>
          </div>
        )}
      </div>
      <div>
        {Object.values(images).length > 0 && (
          <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
            {Object.values(images).map((image,index) => (
              <div key={index} className="flex justify-between items-center basis-1/2 border p-3 rounded-md">
                
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
    
      </div>
    </div>
  );
}

export default UploadImages;
