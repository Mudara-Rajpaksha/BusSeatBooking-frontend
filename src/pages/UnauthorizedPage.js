import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginTop: 5,
          padding: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" textAlign="center">
          You don't have permission to access this page.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
