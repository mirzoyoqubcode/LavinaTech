// src/components/Login/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { TextField, Button, Typography, Box } from "@mui/material";
import md5 from "crypto-js/md5"; // Import md5 for signature generation

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Keep the email field
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const generateSignature = (
    method: string,
    url: string,
    userSecret: string
  ) => {
    const stringToSign = `${method}+${url}+${userSecret}`;
    return md5(stringToSign).toString();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = "GET";
    const url = "/myself";
    const sign = generateSignature(method, url, secret);

    try {
      const response = await axios.get("`https://no23.lavina.tech/`${}`",  {
        headers: {
          Key: key,
          Sign: sign,
        },
      });

      const { data } = response.data;

      // Dispatch credentials to Redux
      dispatch(setCredentials({ key: data.key, secret: data.secret }));
      console.log("Login successful");
      navigate("/"); // Redirect to Main after successful login
    } catch (err: any) {
      console.error("Login error:", err.response ? err.response.data : err);
      setError(
        err.response?.data?.message || "Bad credentials. Please try again."
      );
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Secret"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>
    </Box>
  );
};

export default Login;