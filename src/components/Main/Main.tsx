// src/components/Main/Main.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import md5 from "crypto-js/md5";
import styles from "./Main.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { motion } from "framer-motion";

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
        err.response?.data?.message || "An error occurred while fetching books"
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
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Typography>No books available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Main;
