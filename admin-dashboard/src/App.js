import React from "react";
import ProjectList from "./components/ProjectList";
import MessageList from "./components/MessageList";
import SkillList from "./components/SkillList";
import TimelineList from "./components/TimelineList";
import SoftwareApplicationList from "./components/SoftwareApplicationList";
import PersonalInfo from "./components/PersonalInfo";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage"; // Import ForgotPasswordPage
import ResetPasswordPage from "./components/ResetPasswordPage"; // Import ResetPasswordPage
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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate, // Make sure useNavigate is imported here as well (though it's used in Dashboard)
} from "react-router-dom";

const AppBarStyled = styled(AppBar)({
  marginBottom: (theme) => theme.spacing(3),
});

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

// Protected Route component to check for the token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
};

// Dashboard component to hold all your admin functionalities
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
        alignItems: "center", // Center items horizontally
        padding: (theme) => theme.spacing(3),
        minHeight: "100vh", // Ensure the container takes at least the full viewport height
        backgroundColor: "#f0f2f5", // Optional: Add a background color
      }}
    >
      <AppBarStyled position="static" sx={{ width: "90%", maxWidth: 1200 }}>
        {" "}
        {/* Limit app bar width */}
        <ToolbarStyled>
          <Typography variant="h6" component="div">
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </ToolbarStyled>
      </AppBarStyled>

      <Box sx={{ width: "90%", maxWidth: 1200, mt: 3 }}>
        {" "}
        {/* Limit content width and add top margin */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <PersonalInfo />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom></Typography>
            <ProjectList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom></Typography>
            <MessageList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom></Typography>
            <SkillList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom></Typography>
            <TimelineList />
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom></Typography>
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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />{" "}
        {/* New route */}
        <Route
          path="/password/reset/:token"
          element={<ResetPasswordPage />}
        />{" "}
        {/* New route with parameter */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
