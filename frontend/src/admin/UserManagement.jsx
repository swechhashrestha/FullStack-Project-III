import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/users/all`,
        {
          withCredentials: true,
        }
      );
      setUsers(res.data.users);
    } catch (error) {
      console.log("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/auth/users/${id}`,
        { withCredentials: true }
      );
      alert(res.data.message);
      getUsers();
    } catch (error) {
      console.log("Failed to delete user", error);
    }
  };

  if (loading) {
    return <p className="text-center py-10 font-medium text-amber-900">Loading users...</p>;
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-amber-950">User Management</h1>
        <button
          onClick={() => {
            navigate("/admin/add-user");
          }}
          className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto border border-stone-200">
        <table className="w-full text-left">
          <thead className="bg-stone-100 text-amber-950 text-sm uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t border-stone-100 hover:bg-stone-50/50 transition"
              >
                <td className="p-4 font-medium text-stone-800">
                  {user.fullName}
                </td>

                <td className="p-4 text-stone-600">{user.email}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      user.role === "admin"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        navigate("/admin/edit-user", { state: user._id });
                      }}
                      className="text-amber-700 hover:text-amber-900 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;