import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      const response = await axios.post(
        "https://no23.lavina.tech/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { key, secret } = response.data.data;
      dispatch(setCredentials({ key, secret }));
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  return (
    <Box className={styles.registerForm}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Register New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="key"
                value={formData.key}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="secret"
                type="password"
                value={formData.secret}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Login here
            </Link>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Register;
