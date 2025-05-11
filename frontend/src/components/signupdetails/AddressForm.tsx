import React from "react";

interface AddressFormProps {
  formData: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ formData, handleChange }) => (
  <div className="space-y-3">
    <h1 className="text-start text-2xl">Enter Your Address Details</h1>
    <input
      type="text"
      name="street"
      value={formData.street}
      onChange={handleChange}
      placeholder="Street"
      className="p-2 border rounded w-full"
    />
    <div className="flex flex-row gap-x-2">
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="City"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="State"
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="flex flex-row gap-x-2">
      <input
        type="text"
        name="zip"
        value={formData.zip}
        onChange={handleChange}
        placeholder="Zip Code"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="Country"
        className="p-2 border rounded w-full"
      />
    </div>
  </div>
);

export default AddressForm;
