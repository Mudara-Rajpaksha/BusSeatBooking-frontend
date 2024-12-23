import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../css/LoginPage.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      setError("All fields are required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.role === "0") {
      setError("Please select a role");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const roleMap = {
        1: "admin",
        2: "commuter",
        3: "operator",
      };

      const registrationData = {
        username: formData.username,
        password: formData.password,
        role: roleMap[formData.role],
      };

      const response = await API.post("/auth/register", registrationData);

      if (response.data.status === "success") {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter username"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter password"
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm password"
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="0">Select Role</option>
        <option value="1">Admin</option>
        <option value="2">Commuter</option>
        <option value="3">Operator</option>
      </select>
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};

export default Register;
