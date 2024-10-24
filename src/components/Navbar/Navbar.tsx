import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import md5 from "crypto-js/md5";
import { RootState } from "../../redux/store";
import { motion } from "framer-motion";
import { CiLogout } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const key = useSelector((state: RootState) => state.auth.key);
  const secret = useSelector((state: RootState) => state.auth.secret);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  const generateSignature = (
    method: string,
    url: string,
    userSecret: string
  ): string => {
    const stringToSign = `${method}${url}${userSecret}`;
    return md5(stringToSign).toString();
  };

  const handleSearch = async () => {
    setError("");
    setSearchResults([]);

    if (!searchTitle) {
      setError("Please enter a book title.");
      return;
    }

    const method = "GET";
    const url = `/books/${encodeURIComponent(searchTitle)}`;
    const sign = generateSignature(method, url, secret!);

    try {
      const response = await axios.get(`https://no23.lavina.tech${url}`, {
        headers: {
          Key: key!,
          Sign: sign,
        },
      });

      if (response.data && response.data.isOk) {
        setSearchResults(response.data.data || []);
      } else {
        setError("No book found.");
      }
    } catch (err: any) {
      const serverError =
        err.response?.data?.message || "Error fetching data. Please try again.";
      setError(serverError);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddBook = async (isbn: string) => {
    setError("");

    const method = "POST";
    const url = "/books";
    const body = JSON.stringify({ isbn });
    const sign = generateSignature(method, url, secret!);

    try {
      const response = await axios.post(
        `https://no23.lavina.tech${url}`,
        body,
        {
          headers: {
            Key: key!,
            Sign: sign,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isOk) {
        alert("Book added successfully!");
      } else {
        setError("Failed to add the book.");
      }
    } catch (err: any) {
      const addBookError =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(addBookError);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#795548" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
          Bookshelf App
        </Typography>

        <TextField
          variant="outlined"
          size="small"
          value={searchTitle}
          placeholder="Search by title"
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            marginRight: "16px",
            outline: "none",
            borderColor: "#795548",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#795548",
              },
              "&:hover fieldset": {
                borderColor: "#5d4037",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#5d4037",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{ fontSize: "25px" }}
        >
          <CiLogout />
        </Button>
      </Toolbar>

      {searchResults.length > 0 && (
        <Box
          sx={{
            padding: "32px",
            backgroundColor: "#f9f9f9",
            minHeight: "60vh",
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {searchResults.map((book: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.isbn}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      maxWidth: 250,
                      margin: "8px auto",
                      borderRadius: "12px",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={book.cover || "https://via.placeholder.com/180"}
                      alt={book.title}
                      sx={{ borderRadius: "12px 12px 0 0" }}
                    />
                    <CardContent sx={{ textAlign: "center", padding: "16px" }}>
                      <Typography variant="h6" gutterBottom>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Author: {book.author}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ISBN: {book.isbn}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          marginTop: "16px",
                          backgroundColor: "#795548",
                          "&:hover": { backgroundColor: "#5d4037" },
                        }}
                        onClick={() => handleAddBook(book.isbn)}
                      >
                        Add to Bookshelf
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {error && (
        <Typography
          color="error"
          sx={{
            padding: "16px",
            marginTop: "10px",
            textAlign: "center",
            backgroundColor: "#f9dcdc",
            borderRadius: "8px",
          }}
        >
          {error}
        </Typography>
      )}
    </AppBar>
  );
};

export default Navbar;
