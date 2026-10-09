import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export class EditUserModel {
  constructor(data = {}) {
    this.fullName = data.fullName || "";
    this.email = data.email || "";
  }

  toJSON() {
    return {
      fullName: this.fullName,
      email: this.email,
    };
  }

  static initial() {
    return new EditUserModel();
  }
}

export class EditUserApiService {
  constructor(baseUrl = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchUser(id) {
    const res = await axios.get(`${this.baseUrl}/api/auth/users/${id}`, {
      withCredentials: true,
    });
    return res.data.user;
  }

  async updateUser(id, userModelInstance) {
    const res = await axios.patch(
      `${this.baseUrl}/api/auth/users/${id}`,
      userModelInstance.toJSON(),
      { withCredentials: true }
    );
    return res.data;
  }
}

const userService = new EditUserApiService();

const EditUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state;

  const [userModel, setUserModel] = useState(() => EditUserModel.initial());

  const handleInputChange = (field, value) => {
    setUserModel((prev) => new EditUserModel({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!id) {
      navigate("/admin/user-management");
      return;
    }

    userService
      .fetchUser(id)
      .then((user) => {
        setUserModel(new EditUserModel({ fullName: user.fullName, email: user.email }));
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resData = await userService.updateUser(id, userModel);
      setUserModel(EditUserModel.initial());
      navigate("/admin/user-management");
      alert(resData.message || "User updated successfully");
    } catch (error) {
      console.error("Failed to update User", error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow border border-stone-200 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-950">Edit User</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-stone-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userModel.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-stone-700">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userModel.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-amber-800 bg-white text-stone-800 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-800 text-white py-2.5 rounded-lg hover:bg-amber-900 transition-colors font-medium text-sm shadow-sm uppercase tracking-wider"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUser;