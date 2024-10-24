// src/components/Navbar/Navbar.tsx
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
          onChange={(e) => setSearchTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            backgroundColor: "white",
            borderRadius: "4px",
            marginRight: "16px",
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
        <Box sx={{ display: "flex", flexWrap: "wrap", padding: "16px" }}>
          {searchResults.map((book: any) => (
            <motion.div
              key={book.isbn}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  maxWidth: 200,
                  margin: "8px",
                  backgroundColor: "#ffebee",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={book.cover || "https://via.placeholder.com/140"}
                  alt={book.title}
                />
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Author: {book.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ISBN: {book.isbn}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddBook(book.isbn)}
                  >
                    Add
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ padding: "16px", marginTop: "10px" }}>
          {error}
        </Typography>
      )}
    </AppBar>
  );
};

export default Navbar;
