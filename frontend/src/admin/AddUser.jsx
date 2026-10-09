import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export class UserFormData {
  constructor(data = {}) {
    this.fullName = data.fullName || "";
    this.email = data.email || "";
    this.password = data.password || "";
  }

  toJSON() {
    return {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    };
  }

  static initial() {
    return new UserFormData({
      fullName: "",
      email: "",
      password: "",
    });
  }
}

export class UserApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async registerUser(userDataInstance) {
    const payload = userDataInstance.toJSON();

    const response = await axios.post(
      `${this.baseUrl}/api/auth/users/register`,
      payload,
      { withCredentials: true },
    );

    return response.data;
  }
}

const userService = new UserApiService();

const AddUser = () => {
  const [userForm, setUserForm] = useState(() => UserFormData.initial());
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setUserForm(
      (prevForm) => new UserFormData({ ...prevForm, [field]: value }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responseData = await userService.registerUser(userForm);

      setUserForm(UserFormData.initial());
      navigate("/admin/user-management");
      alert(responseData.message || "User registered successfully");
    } catch (error) {
      console.error("Failed to register User", error);
      alert(error.response?.data?.message || "Failed to register User");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow border border-stone-200 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-950">
          Add User
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-stone-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userForm.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter user's name"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-stone-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userForm.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter user's email"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userForm.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter user's password"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-800 text-white py-2.5 rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm shadow-sm"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
