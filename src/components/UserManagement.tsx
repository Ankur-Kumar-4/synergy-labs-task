"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Plus, Pencil, Trash2, X } from "lucide-react";

interface Address {
  street: string;
  city: string;
}

interface Company {
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: Address;
}

type FormData = Partial<
  Omit<User, "company" | "address"> & {
    "company.name": string;
    street: string;
    city: string;
  }
>;

type FormErrors = Partial<Record<keyof FormData, string>>;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data: User[] = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string): void => {
    let error = "";
    switch (name) {
      case "name":
        if (value.length < 3) error = "Name must be at least 3 characters long";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "phone":
        if (!/^\+?[\d\s-]{10,}$/.test(value)) error = "Invalid phone number";
        break;
      case "street":
      case "city":
        if (!value)
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        break;
      case "company.name":
        if (value && value.length < 3)
          error = "Company name must be at least 3 characters long";
        break;
      case "website":
        if (
          value &&
          !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            value
          )
        ) {
          error = "Invalid website URL";
        }
        break;
    }
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (Object.values(formErrors).some((error) => error)) {
      alert("Please correct the form errors before submitting");
      return;
    }
    if (formMode === "create") {
      const newUser: User = {
        ...formData,
        id: Math.max(...users.map((u) => u.id)) + 1,
        username: `USER-${formData.name?.toLowerCase().replace(/\s+/g, "-")}`,
        company: { name: formData["company.name"] || "" },
        address: { street: formData.street || "", city: formData.city || "" },
      } as User;
      setUsers([...users, newUser]);
      alert("User created successfully!");
    } else if (formMode === "edit" && currentUser) {
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              ...formData,
              company: {
                ...user.company,
                name: formData["company.name"] || user.company.name,
              },
              address: {
                ...user.address,
                street: formData.street || user.address.street,
                city: formData.city || user.address.city,
              },
            }
          : user
      );
      setUsers(updatedUsers);
      alert("User updated successfully!");
    }
    setFormMode(null);
    setCurrentUser(null);
    setFormData({});
  };

  const handleDelete = (id: number): void => {
    setUsers(users.filter((user) => user.id !== id));
    setDeleteConfirmation(null);
    alert("User deleted successfully!");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <motion.h1
        className="text-5xl font-extrabold text-center mb-9 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        User Management
      </motion.h1>

      {/* Search and Create User button */}
      <div className="flex justify-between mb-8">
        <motion.div
          className="relative flex-grow mr-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full pl-12 pr-4 py-3 border-2 border-blue-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </motion.div>
        <motion.button
          onClick={() => {
            setFormMode("create");
            setFormData({});
            setFormErrors({});
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Plus className="inline-block mr-2" />
          Create User
        </motion.button>
      </div>

      {/* User Table */}
      <motion.div
        className="bg-white rounded-lg shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setFormMode("edit");
                        setCurrentUser(user);
                        setFormData({
                          ...user,
                          "company.name": user.company.name,
                          street: user.address.street,
                          city: user.address.city,
                        });
                        setFormErrors({});
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300"
                    >
                      <Pencil className="inline-block" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(user.id)}
                      className="text-red-600 hover:text-red-900 transition duration-300"
                    >
                      <Trash2 className="inline-block" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Create/Edit User Form */}
      <AnimatePresence>
        {formMode && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
                {formMode === "create" ? "Create New User" : "Edit User"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  "name",
                  "email",
                  "phone",
                  "street",
                  "city",
                  "company.name",
                  "website",
                ].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replace(".", " ")}
                    </label>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "website"
                          ? "url"
                          : "text"
                      }
                      id={field}
                      name={field}
                      value={formData[field as keyof FormData] || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!["company.name", "website"].includes(field)}
                    />
                    {formErrors[field as keyof FormErrors] && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors[field as keyof FormErrors]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode(null);
                      setCurrentUser(null);
                      setFormData({});
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {formMode === "create" ? "Create User" : "Update User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmation)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
