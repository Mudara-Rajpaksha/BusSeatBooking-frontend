import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../css/LoginPage.css"; // Import CSS

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "", // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await API.post("/auth/register", formData);
      alert(response.data.message);
      // Redirect to the login page upon successful registration
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
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
