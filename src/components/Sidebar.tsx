import React, { useEffect, useState } from "react";
import { Power } from "lucide-react";
import { Link } from "react-router-dom";
import customermanagement from "../assets/customermanagement.svg";
import vendormanagement from "../assets/vendormanagment.svg";
import vendormanagementactive from "../assets/vendormanagementactive.svg";
import home from "../assets/home.svg";
import logo from "../assets/HBN-05.svg";
import homeactive from "../assets/homeactive.svg";
import customermanagementactive from "../assets/customermanagementactive.svg";

const Sidebar: React.FC = () => {
  const path = window.location.pathname;
  const [activeItem, setActiveItem] = useState(path);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: activeItem === "/home" ? homeactive : home,
    },
    {
      id: "vendor-management",
      label: "Vendor Management",
      icon:
        activeItem === "/vendor-management"
          ? vendormanagementactive
          : vendormanagement,
    },
    {
      id: "customer-management",
      label: "Customer Management",
      icon:
        activeItem === "/customer-management"
          ? customermanagementactive
          : customermanagement,
    },
    {
      id: "review-vendors",
      label: "Review Vendors",
      icon:
        activeItem === "/review-vendors"
          ? vendormanagementactive
          : vendormanagement,
      hidden: "hidden",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="sidebar shadow-2xl md:w-56 w-16 flex flex-col items-center md:items-start">
      {/* Logo Section */}
      <div className="p-4 flex justify-center w-full">
        <img src={logo} alt="Logo" className="w-14 md:w-28 lg:w-32" />
      </div>

      {/* Menu Items */}
      <div className="menu flex flex-col w-full">
        {menuItems.map((item) => (
          <Link
            to={`/${item.id}`}
            key={item.id}
            onClick={() => setActiveItem(`/${item.id}`)}
          >
            <div
              className={`menu-item flex items-center space-x-3 px-4 py-2 w-full ${
                activeItem === `/${item.id}` ? "active" : ""
              } lg:${item.hidden}`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="size-5 max-md:size-6"
              />
              <span className="text-xs hidden md:inline">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      <div className="logout mt-auto w-full">
        <div
          className="menu-item flex items-center space-x-3 px-4 py-2 cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          <Power color="red" size={20} />
          <span className="hidden md:inline">Logout</span>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
