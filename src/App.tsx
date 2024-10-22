import React from "react";
import { CssBaseline, Container } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register/Register";
import Main from "./components/Main/Main";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Login from "./components/Login/Login";
import AddBook from "./components/AddBook/AddBook";

const App: React.FC = () => {
  const { key } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <CssBaseline />
      <Routes>
        <Route
          path="/register"
          element={key ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/login" element={key ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={<Main />} />
        <Route path="/addbook" element={<AddBook />} />
      </Routes>
    </Container>
  );
};

export default App;
