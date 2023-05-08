import React, { useState } from "react";

const CustomerInfoForm = ({ onUpdate }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [receivedAmount, setReceivedAmount] = useState(null);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "name") {
      setName(value);
    } else if (name === "phone") {
      setPhoneNumber(value);
    } else if (name === "receivedAmount") {
      setReceivedAmount(value);
    }

    onUpdate(name, value); // Update in parent state
  };

  return (
    <form>
      <div>
        <label htmlFor="name">Tên khách hàng</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="phone">Điện thoại</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={phoneNumber}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="receivedAmount">Tiền nhận</label>
        <input
          type="number"
          id="receivedAmount"
          name="receivedAmount"
          value={receivedAmount}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
};

export default CustomerInfoForm;
