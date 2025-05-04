import React from "react";
import ProjectList from "./components/ProjectList";
import MessageList from "./components/MessageList";
import SkillList from "./components/SkillList";
import TimelineList from "./components/TimelineList";
import SoftwareApplicationList from "./components/SoftwareApplicationList";
import PersonalInfo from "./components/PersonalInfo";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import ClientPortfolioPage from "./components/ClientPortfolioPage"; // ✅ New import

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  styled,
  Box,
  Card,
  CardContent,
} from "@mui/material";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
};

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: (theme) => theme.spacing(3),
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <AppBarStyled position="static" sx={{ width: "90%", maxWidth: 1200 }}>
        <ToolbarStyled>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </ToolbarStyled>
      </AppBarStyled>

      <Box sx={{ width: "90%", maxWidth: 1200, mt: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <PersonalInfo />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <ProjectList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <MessageList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <SkillList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TimelineList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <SoftwareApplicationList />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/portfolio" element={<ClientPortfolioPage />} />
        <Route path="/" element={<Navigate to="/portfolio" />} />
      </Routes>
    </Router>
  );
}

export default App;
