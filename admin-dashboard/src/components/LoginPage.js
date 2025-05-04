import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link as MuiLink,
} from "@mui/material"; // Renamed Material UI Link
import { Link as RouterLink, useNavigate } from "react-router-dom"; // Import React Router Link

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Login error:", error);
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
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ cursor: "pointer" }} // Add cursor for better UX
              >
                Forgot password?
              </MuiLink>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
