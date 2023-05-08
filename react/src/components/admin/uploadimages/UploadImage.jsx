import { useState } from "react";
import { Button } from "primereact/button";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const UploadImage = ({ image, setImage, submitted }) => {
  const [validForm, setValidForm] = useState(false);

  console.log(typeof image);
  // const changeHandler = (event) => {
  //   setImage(event.target.files[0]);
  //   setValidForm(true); // khi chọn ảnh, form sẽ được validate
  //   setFileInput(event.target); //cập nhật trạng thái của file input
  // };
  const [activeAvatar, setActiveAvatar] = useState(false);

  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
      setValidForm(true); // khi chọn ảnh, form sẽ được validate

      setActiveAvatar(true);
    } else {
      setActiveAvatar(true);
    }
  };

  return (
    <div>
      <Button
        outlined
        type="button"
        label="Chọn ảnh"
        icon="pi pi-upload"
        onClick={() => document.getElementById("fileInput").click()}
      />
      <input
        type="file"
        accept="image/*"
        onChange={changeHandler}
        id="fileInput"
        style={{ display: "none" }}
      />

      {image && activeAvatar ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
          <div className="flex justify-between items-center border p-3 rounded-md">
            <img
              className="w-28"
              key={image.name}
              src={URL.createObjectURL(image)}
              alt={image.name}
            />
            <h6>{image.name}</h6>
          </div>
        </div>
      ) : (
        ""
      )}

      {submitted && !validForm && (
        <small className="cs-text-error">Ảnh bìa không được để trống</small>
      )}
    </div>
  );
};

export default UploadImage;
