import React, { useState } from "react";
import { useNavigate } from "react-router";
import logo from "../assets/HBN-02.svg";
import upright from "../assets/upright.png";
import { login } from "../api/api";
import toast from "react-hot-toast";

const LoginPage = (props: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  // ✅ Gmail Validation Function
  const isValidGmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  // ✅ Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!isValidGmail(email)) {
      validationErrors.email = "Only Gmail addresses are allowed";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required";
    } else if (password.length < 0) {
      validationErrors.password = "Password must be at least 1 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await login(email, password);
      props.setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login successful!");
      response.data.data.role === "admin" ? navigate("/home") : navigate("/login");
    } catch (error) {
      props.setIsLoggedIn(false);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page p-10">
      <div className="login-container">
        <div className="login-logo">
          <div className="logo-text">
            <div className="flex flex-col items-center justify-between">
              <img src={logo} alt="" width={"40%"} />
              <div className="logo-subtext">Next Business Network</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border p-2 rounded w-full ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border p-2 rounded w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Remember me
            </label>
          </div>

          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
      </div>

      <div className="absolute w-full -top-10 rotate-180">
        <img src={upright} alt="" />
      </div>
      <div className="absolute w-full -bottom-40 right-[]">
        <img src={upright} alt="" />
      </div>
    </div>
  );
};

export default LoginPage;
