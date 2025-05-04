import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/user/password/reset/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset successfully!");
        // Optionally, redirect to login after successful reset
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(
          data.message ||
            "Failed to reset password. Token might be invalid or expired."
        );
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Reset password error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPasswordPage;
