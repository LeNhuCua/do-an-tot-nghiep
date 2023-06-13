import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";

import { RiFileExcel2Fill } from "react-icons/ri";
import { AiOutlineToTop } from "react-icons/ai";

import axios from "axios";

import { IconButton } from "@mui/material";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import Loading from "../../Loading";

function UploadExcelForm(props) {
  const { fetch, ApiExcel } = props;
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onSubmit = async (event) => {
   
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);
    try {
      const response = await axios.post(ApiExcel, formData);
      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
      fetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Vui lòng chọn đúng định dạng file",
      });
    }
    
  };

  const uploadIcon = (
    <Tippy content="Tải lên">
      <IconButton
        type="submit"
        color="primary"
        className="me-2 hover:ring-2 ml-2"
        onClick={onSubmit}
      >
        <AiOutlineToTop />
      </IconButton>
    </Tippy>
  );

  return (
    <>
    
      <form className="" onSubmit={onSubmit} encType="multipart/form-data">
        <FileUpload
          mode="basic"
          name="file"
          url={ApiExcel}
          accept=".xlsx, .xls, .csv"
          maxFileSize={1000000}
          chooseLabel="Excel Import"
          onUpload={(event) => {
            const response = JSON.parse(event.xhr.responseText);
            if (response.status === 422) {
              Swal.fire({
                icon: "error",
                text: response.message,
              });
            }
            if (response.status === 401) {
              Swal.fire({
                icon: "error",
                text: response.message,
              });
            } else if (response.status === 200) {
              Swal.fire({
                icon: "success",
                text: response.message,
              });
              fetch();
            }
          }}
          onSelect={(event) => setUploadedFiles(event.files)}
        />
        {uploadedFiles.length > 0 ? uploadIcon : ""}
      </form>
    </>
  );
}

export default UploadExcelForm;
