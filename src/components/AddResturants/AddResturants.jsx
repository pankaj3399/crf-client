import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import PhoneInput from 'react-phone-number-input'

const AddRestaurantForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    LLC: "",
    phoneNumber: "",
    email: "",
    ownerName: "",
    password: "",
    primaryContactName: "",
    primaryContactAddress: "",
    primaryContactEmail: "",
    agreeTerms: false,
  });
  const [termsError, setTermsError] = useState(false);

  useEffect(() => {
    if (initialData === "") {
      setFormData({
        restaurantName: "",
        address: "",
        LLC: "",
        phoneNumber: "",
        email: "",
        ownerName: "",
        password: "",
        primaryContactName: "",
        primaryContactAddress: "",
        primaryContactEmail: "",
        agreeTerms: false,
      });
    }
    else if (initialData) {
      setFormData({
        restaurantName: initialData.restaurantName || "",
        address: initialData.address || "",
        LLC: initialData.llc || "",
        phoneNumber: initialData.phoneNumber || "",
        email: initialData.email || "",
        ownerName: initialData.ownerName || "",
        password: initialData.password || "",
        primaryContactName: initialData.primaryContactDetails?.name || "",
        primaryContactAddress: initialData.primaryContactDetails?.address || "",
        primaryContactEmail: initialData.primaryContactDetails?.email || "",
        agreeTerms: initialData.agreementAccepted || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "agreeTerms") setTermsError(!checked);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setTermsError(true);
      return;
    }
    const payload = {
      restaurantName: formData.restaurantName,
      address: formData.address,
      llc: formData.LLC,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      ownerName: formData.ownerName,
      password: formData.password,
      primaryContactDetails: {
        name: formData.primaryContactName,
        address: formData.primaryContactAddress,
        email: formData.primaryContactEmail,
      },
      agreementAccepted: formData.agreeTerms,
      isAccepted: true,
    };
    onSubmit(payload, setFormData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">LLC</label>
          <input
            type="text"
            name="LLC"
            value={formData.LLC}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          {/* <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={10}
            pattern="\d{10,}"
            title="Enter a valid phone number with 10 digits."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          /> */}

          <PhoneInput
            value={formData.phoneNumber}
            onChange={(phoneNumber) => { setFormData({ ...formData, phoneNumber }) }}
            required
            minLength={10} // Minimum length required
            maxLength={14} // Maximum length required
            defaultCountry="US" // Set default country
            // international
            // countryCallingCodeEditable={false}
            className="border w-full border-gray-300 mt-1 px-3 py-2 rounded-md shadow-sm !focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">Create Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Primary Contact Name</label>
          <input
            type="text"
            name="primaryContactName"
            value={formData.primaryContactName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">Primary Contact Address</label>
          <input
            type="text"
            name="primaryContactAddress"
            value={formData.primaryContactAddress}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Primary Contact Email</label>
          <input
            type="email"
            name="primaryContactEmail"
            value={formData.primaryContactEmail}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="ml-2 text-gray-700">
            Agree to terms and conditions
          </span>
        </label>
      </div>
      {termsError && (
        <p className="text-red-500 text-sm mb-2">Please accept terms and condition to proceed.</p>
      )}
      <div className="flex justify-between gap-4 mt-4">
        <Button type="submit">
          {initialData ? "Edit Restaurant" : "Add Restaurant"}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddRestaurantForm;
