import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../API";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import { CCol } from "@coreui/react";

const Address = ({ onDataChange }) => {
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    await axios.get(`${API}/api/provinces`).then(({ data }) => {
      setProvinces(data);
    });
  };

  useEffect(() => {
    if (selectedProvinces) {
      fetchDistricts();
    }
  }, [selectedProvinces]);

  const fetchDistricts = async () => {
    await axios
      .get(`${API}/api/provinces/${selectedProvinces.provinceId}/districts`)
      .then(({ data }) => {
        setDistricts(data);
      });
  };

  useEffect(() => {
    if (selectedDistricts) {
      fetchWards();
    }
  }, [selectedDistricts]);

  const fetchWards = async () => {
    await axios
      .get(`${API}/api/districts/${selectedDistricts.districtId}/wards`)
      .then(({ data }) => {
        setWards(data);
      });
  };

  useEffect(() => {
    // Call onDataChange function whenever the data is updated
    onDataChange(selectedProvinces, selectedDistricts, selectedWard);
  }, [selectedProvinces, selectedDistricts, selectedWard]);

  const handleProvincesChange = (event) => {
    const province = provinces.find(
      (province) => province.provinceId === event.target.value
    );
    setSelectedProvinces(province);
    setSelectedDistricts(null);
    setDistricts([]);
    setWards([]);
  };

  const handleDistrictsChange = (event) => {
    const district = districts.find(
      (district) => district.districtId === event.target.value
    );
    setSelectedDistricts(district);
    setWards([]);
  };
  const handleWardsChange = (event) => {
    const selectedWard = wards.find(
      (ward) => ward.wardId === event.target.value
    );
    setSelectedWard(selectedWard);
  };



  return (
    <div className="row ">
      <CCol xl={4}>
        <label>Tỉnh/Thành phố</label>

        <Dropdown
          filter
          emptyMessage="Không có dữ liệu"
          value={selectedProvinces}
          onChange={(e) => setSelectedProvinces(e.value)}
          options={provinces}
          optionLabel="name"
          placeholder="Chọn Tỉnh/Thành phố"
          className="w-full md:w-14rem"
          required
        />
      </CCol>
      <CCol xl={4}>
        <label>Quận/huyện</label>

        <Dropdown
          filter
          emptyMessage="Không có dữ liệu"
          disabled={!selectedProvinces}
          value={selectedDistricts}
          onChange={(e) => setSelectedDistricts(e.value)}
          options={districts}
          optionLabel="name"
          placeholder="Chọn Quận/huyện"
          className="w-full md:w-14rem"
        />
      </CCol>
      <CCol xl={4}>
        <label>Chọn Phường/Xã</label>
        <Dropdown
          filter
          emptyMessage="Không có dữ liệu"
          disabled={!selectedDistricts}
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.value)}
          options={wards}
          optionLabel="name"
          placeholder="Chọn Phường/Xã"
          className="w-full md:w-14rem"
        />
      </CCol>
    </div>
  );
};

export default Address;
