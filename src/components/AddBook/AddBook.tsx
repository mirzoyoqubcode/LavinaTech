import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import md5 from "crypto-js/md5";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface BookData {
  title: string;
  authors: string[];
  cover?: string;
  published?: string;
  pages?: number;
}

const AddBook: React.FC = () => {
  const [isbn, setIsbn] = useState("");
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { key, secret } = useSelector((state: RootState) => state.auth);

  const fetchBookDetails = async () => {
    setLoading(true);
    setError("");
    setBookData(null);

    console.log("Fetching book details for ISBN:", isbn); // Debugging log

    try {
      const response = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );

      console.log("Response from API:", response.data); // Log the API response

      const data = response.data[`ISBN:${isbn}`];

      if (data) {
        const bookInfo: BookData = {
          title: data.title,
          authors: data.authors
            ? data.authors.map((author: any) => author.name)
            : [],
          cover: data.cover
            ? data.cover.large || data.cover.medium || data.cover.small
            : undefined,
          published: data.publish_date,
          pages: data.number_of_pages,
        };

        setBookData(bookInfo);
      } else {
        setError("No book found with this ISBN.");
      }
    } catch (err: any) {
      console.error("Error fetching book details:", err);
      if (err.response) {
        console.log("Response error data:", err.response.data); // Log response error data
        setError(`Error ${err.response.status}: ${err.response.statusText}`);
      } else if (err.request) {
        console.log("Request object:", err.request); // Log the request object
        setError("No response received from the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSignature = (
    method: string,
    url: string,
    body: string,
    userSecret: string
  ): string => {
    const stringToSign = `${method}${url}${body}${userSecret}`;
    return md5(stringToSign).toString();
  };

  const addBookToLibrary = async () => {
    if (!key || !secret) {
      setError("Missing credentials. Please log in.");
      return;
    }

    if (!isbn) {
      setError("Please enter an ISBN.");
      return;
    }

    setLoading(true);
    setError("");

    const method = "POST";
    const url = "/books";
    const body = JSON.stringify({ isbn });
    const sign = generateSignature(method, url, body, secret);

    try {
      const response = await axios.post(
        `https://no23.lavina.tech${url}`,
        { isbn },
        {
          headers: {
            Key: key,
            Sign: sign,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isOk) {
        setError("");
        alert("Book added successfully!");
        setIsbn("");
        setBookData(null);
      } else {
        setError(response.data.message || "Failed to add book.");
      }
    } catch (err: any) {
      console.error("Error adding book:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the book."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add a New Book
      </Typography>
      <Box>
        <TextField
          label="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchBookDetails}
          disabled={loading || !isbn}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Fetch Book Details"
          )}
        </Button>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Box>

      {bookData && (
        <Card>
          {bookData.cover && (
            <CardMedia
              component="img"
              height="350"
              image={bookData.cover}
              alt={bookData.title}
            />
          )}
          <CardContent>
            <Typography variant="h5">{bookData.title}</Typography>
            <Typography variant="subtitle1">
              {bookData.authors.join(", ")}
            </Typography>
            {bookData.published && (
              <Typography variant="body2">
                Published: {bookData.published}
              </Typography>
            )}
            {bookData.pages && (
              <Typography variant="body2">Pages: {bookData.pages}</Typography>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={addBookToLibrary}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Book"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AddBook;
