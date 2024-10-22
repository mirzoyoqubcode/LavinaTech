// src/components/Register/Register.tsx
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    key: "",
    secret: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Create the user
      const response = await axios.post(
        "https://no23.lavina.tech/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // After successful registration, extract key and secret from the response
      const { key, secret } = response.data.data;

      // Dispatch credentials to Redux store
      dispatch(setCredentials({ key, secret }));

      // Redirect to the main page
      navigate("/");
    } catch (err: any) {
      // Handle any errors during registration
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  return (
    <Box className={styles.registerForm}>
      <Typography variant="h4" gutterBottom>
        Register New User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required // Optional: Add required validation
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required // Optional: Add required validation
        />
        <TextField
          label="Key"
          name="key"
          value={formData.key}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required // Optional: Add required validation
        />
        <TextField
          label="Secret"
          name="secret"
          type="password"
          value={formData.secret}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required // Optional: Add required validation
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" type="submit">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
