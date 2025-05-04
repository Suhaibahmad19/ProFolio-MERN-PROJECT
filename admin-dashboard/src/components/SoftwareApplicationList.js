import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  styled,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddSoftwareApplicationModal from "./modals/AddSoftwareApplicationModal";

// Custom styles for software application cards (matching Skills)
const ApplicationCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const ApplicationCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center content horizontally
}));

const ApplicationListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const CardMediaStyled = styled(CardMedia)({
  height: 80,
  width: 80, // Ensure image is contained
  margin: (theme) => theme.spacing(1, 0), // Add vertical margin
});

function SoftwareApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteApplicationId, setDeleteApplicationId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:4000/softwareapplication/getall",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch software applications"
          );
        }
        const data = await response.json();
        setApplications(data.applications);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchApplications();
    } else {
      console.error("No authentication token found.");
      // Optionally redirect to login
    }
  }, [authToken]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleApplicationAdded = (newApplication) => {
    setApplications((prevApplications) => [
      ...prevApplications,
      newApplication,
    ]);
  };

  const handleDeleteClick = (id) => {
    setDeleteApplicationId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteApplicationId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteDialogOpen(false);
    if (!deleteApplicationId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/softwareapplication/delete/${deleteApplicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app._id !== deleteApplicationId)
        );
        setDeleteApplicationId(null);
        // Optionally show a success message
      } else {
        const errorData = await response.json();
        console.error("Error deleting application:", errorData);
        setError(errorData.message || "Failed to delete software application");
        setDeleteApplicationId(null);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      setError("Failed to delete software application");
      setDeleteApplicationId(null);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <Typography>Loading software applications...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading software applications.
      </Typography>
    );
  }

  return (
    <ApplicationListContainer>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Software Applications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ marginBottom: 2 }}
        >
          Add New Application
        </Button>
      </Grid>
      <Grid container spacing={3} style={{ width: "100%" }}>
        {applications.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app._id}>
            <ApplicationCard>
              <ApplicationCardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {app.name}
                </Typography>
                {app.svg && app.svg.url && (
                  <CardMediaStyled
                    component="img"
                    alt={app.name}
                    image={app.svg.url}
                    onError={(e) => {
                      console.error("Error loading image:", e);
                      e.target.style.display = "none";
                    }}
                  />
                )}
                {/* You might have a "proficiency" or similar field for applications */}
                {/* <Typography variant="body2" color="text.secondary">
                                    Proficiency: {app.proficiency || 'N/A'}
                                </Typography> */}
              </ApplicationCardContent>
              <Box
                sx={{
                  padding: (theme) => theme.spacing(1),
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(app._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ApplicationCard>
          </Grid>
        ))}
      </Grid>

      <AddSoftwareApplicationModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onApplicationAdded={handleApplicationAdded}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this software application? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ApplicationListContainer>
  );
}

export default SoftwareApplicationList;
