import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.scss";
import { TextField, Button, Typography, Box, Grid } from "@mui/material";
import md5 from "crypto-js/md5";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const generateSignature = (
    method: string,
    url: string,
    userSecret: string
  ): string => {
    const stringToSign = `${method}${url}${userSecret}`;
    return md5(stringToSign).toString();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = "GET";
    const url = "/myself";
    const sign = generateSignature(method, url, secret);

    try {
      const response = await axios.get("https://no23.lavina.tech/myself", {
        headers: {
          Key: key,
          Sign: sign,
        },
      });

      const data = response.data.data;
      dispatch(setCredentials({ key: data.key, secret: data.secret }));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Please try again.");
    }
  };

  return (
    <Box className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4">Login</Typography>
        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/register" className={styles.link}>
              Register here
            </Link>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Login;
