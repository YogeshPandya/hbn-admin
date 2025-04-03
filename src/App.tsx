import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard, { DashBoard } from "./pages/Dashboard";
import "./App.css";
import  { Toaster } from "react-hot-toast";
import VendorManagement from "./pages/VendorManagement";
import CustomerManagement from "./pages/CustomerManagement";
import ReviewVendors from "./components/common/review-vendors";
import DashboardLayout from "./pages/Dashboard";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
      localStorage.getItem("isLoggedIn") === "true"
    );

    useEffect(() => {
      localStorage.setItem("isLoggedIn", (JSON.stringify(isLoggedIn)));
    }, [isLoggedIn]);
  

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route path="home" element={<DashBoard />} /> 
            <Route path="vendor-management" element={<VendorManagement />} />
            <Route
              path="customer-management"
              element={<CustomerManagement />}
            />
            <Route path="review-vendors" element={<ReviewVendors />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
