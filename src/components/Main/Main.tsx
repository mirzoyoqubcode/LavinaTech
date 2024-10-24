import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import md5 from "crypto-js/md5";
import styles from "./Main.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

const generateSignature = (
  method: string,
  url: string,
  body: string,
  userSecret: string
): string => {
  const stringToSign = `${method}${url}${body}${userSecret}`;
  return md5(stringToSign).toString();
};

const Main: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [status, setStatus] = useState<number>(0);
  const { key, secret } = useSelector((state: RootState) => state.auth);

  const fetchBooks = async () => {
    setError("");
    try {
      const method = "GET";
      const url = "/books";
      const body = "";
      const sign = generateSignature(method, url, body, secret!);

      const result = await axios.get(`https://no23.lavina.tech${url}`, {
        headers: {
          Key: key!,
          Sign: sign,
        },
      });

      if (result.data.isOk) {
        setBooks(result.data.data || []);
      } else {
        setError(result.data.message || "Failed to fetch books.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred while fetching books."
      );
    }
  };

  const handleEditBookOpen = (book: any) => {
    setSelectedBook(book);
    setStatus(book.status);
    setOpen(true);
  };

  const handleEditBookClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

  const handleEditBook = async () => {
    if (!selectedBook) return;

    setError("");
    const id = selectedBook.id;
    const method = "PATCH";
    const url = `/books/${id}`;
    const body = JSON.stringify({ status });
    const sign = generateSignature(method, url, body, secret!);

    try {
      const result = await axios.patch(`https://no23.lavina.tech${url}`, body, {
        headers: {
          Key: key!,
          Sign: sign,
          "Content-Type": "application/json",
        },
      });

      if (result.data.isOk) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book.id === id
              ? { ...book, book: { ...book.book, status } }
              : book
          )
        );
        handleEditBookClose();
      } else {
        setError(result.data.message || "Failed to update book status.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while updating book status."
      );
    }
  };

  const handleDeleteBook = async (id: number) => {
    setError("");
    const method = "DELETE";
    const url = `/books/${id}`;
    const body = "";
    const sign = generateSignature(method, url, body, secret!);

    try {
      const result = await axios.delete(`https://no23.lavina.tech${url}`, {
        headers: {
          Key: key!,
          Sign: sign,
        },
      });

      if (result.data.isOk) {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.book.id !== id)
        );
      } else {
        setError(result.data.message || "Failed to delete book.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred while deleting book."
      );
    }
  };

  useEffect(() => {
    if (key && secret) {
      fetchBooks();
    } else {
      setError("Missing credentials. Please register.");
    }
  }, [key, secret]);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: "2rem",
      }}
    >
      <Navbar />
      <Box className={styles.bookList}>
        {error && <Typography color="error">{error}</Typography>}
        {books.length > 0 ? (
          books.map((bookData) => (
            <motion.div
              key={bookData.book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={styles.bookCard}>
                <CardMedia
                  component="img"
                  height="140"
                  image={bookData.book.cover}
                  alt={bookData.book.title}
                />
                <CardContent>
                  <Typography variant="h5">{bookData.book.title}</Typography>
                  <Typography color="textSecondary">
                    {bookData.book.author}
                  </Typography>
                  <Typography color="textSecondary">
                    Published: {bookData.book.published}
                  </Typography>
                  <Typography color="textSecondary">
                    Pages: {bookData.book.pages}
                  </Typography>
                  <Typography color="textSecondary">
                    Status: {getStatusText(bookData.book.status)}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditBookOpen(bookData.book)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteBook(bookData.book.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Typography>No books available.</Typography>
        )}
      </Box>

      <Dialog open={open} onClose={handleEditBookClose}>
        <DialogTitle>Edit Book Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <MenuItem value={0}>New</MenuItem>
              <MenuItem value={1}>Reading</MenuItem>
              <MenuItem value={2}>Finished</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditBookClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditBook} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "New";
    case 1:
      return "Reading";
    case 2:
      return "Finished";
    default:
      return "Unknown";
  }
};

export default Main;
