import React, { useState } from "react";
import customermanagement from "../assets/customermanagement.svg";
import vendormanagement from "../assets/vendormanagment.svg";
import vendormanagementactive from "../assets/vendormanagementactive.svg";
import home from "../assets/home.svg";
import logo from "../assets/HBN-05.svg";
import homeactive from "../assets/homeactive.svg";
import customermanagementactive from "../assets/customermanagementactive.svg";
import { Power } from "lucide-react";



const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeItem = window.location.pathname;

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: activeItem === "home" ? homeactive : home,
    },
    {
      id: "vendor-management",
      label: "Vendor Management",
      icon:
        activeItem === "vendor-management"
          ? vendormanagementactive
          : vendormanagement,
    },
    {
      id: "customer-management",
      label: "Customer Management",
      icon:
        activeItem === "customer-management"
          ? customermanagementactive
          : customermanagement,
    },
    {
      id: "review-vendors",
      label: "Reviwe Vendors",
      icon:
        activeItem === "Reviwe Vendors"
          ? vendormanagementactive
          : vendormanagement,
    },
  ];

  // Handle Review Vendors click
  const handleReviewVendorsClick = () => {
    setIsMenuOpen(false); // Close the mobile menu
  };

  return (
    <div className="bg-white shadow-md w-full flex items-center justify-between p-4">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" width="70" />
      </div>

      {/* Mobile Hamburger Button */}
      <div className="lg:hidden flex items-center">
        <button
          className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Menu Items */}
      <div className="hidden lg:flex space-x-8 sticky-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-2 cursor-pointer ${
              activeItem === item.id ? "text-blue-600" : "text-gray-700"
            }`}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-4 lg:hidden absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-2 cursor-pointer ${
                activeItem === item.id ? "text-blue-600" : "text-gray-700"
              }`}
              onClick={() => {
                setIsMenuOpen(false); // Close menu after item click
              }}
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span>{item.label}</span>
            </div>
          ))}

          {/* Review Vendors Button - Visible only when activeItem is 'vendor-management' */}
          {/* {activeItem === "vendor-management" && (
            <div
              className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-blue-600"
              onClick={handleReviewVendorsClick}
            >
              <span className="text-md">Review Vendors</span>
            </div>
          )} */}

          {/* Logout Button */}
          <div className="-ml-6">
            <div
              className="menu-item flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-red-600"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              <Power color="red" size={20} />
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
