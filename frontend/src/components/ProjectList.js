import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  styled,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddProjectModal from "./modals/AddEditProjectModal";

// Custom styles for project cards
const ProjectCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const CardMediaStyled = styled(CardMedia)({
  height: 200,
  // position: "relative", // Removed relative positioning for overlay
});

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ProjectListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/project/getall", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProjects();
    } else {
      console.error("No authentication token found.");
      // Optionally redirect to login
    }
  }, [authToken]);

  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleProjectAdded = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleDeleteClick = (id) => {
    setDeleteProjectId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteProjectId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteDialogOpen(false);
    if (!deleteProjectId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/project/delete/${deleteProjectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== deleteProjectId)
        );
        setDeleteProjectId(null);
        // Optionally show a success message
      } else {
        const errorData = await response.json();
        console.error("Error deleting project:", errorData);
        setError(errorData.message || "Failed to delete project");
        setDeleteProjectId(null);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project");
      setDeleteProjectId(null);
      // Optionally show an error message to the user
    }
  };

  const handleEditClick = async (project) => {
    setProjectToEdit(project);
    setIsAddModalOpen(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p._id === updatedProject._id ? updatedProject : p
      )
    );
  };

  if (loading) {
    return <Typography>Loading projects...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading projects.</Typography>;
  }

  return (
    <ProjectListContainer>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ marginBottom: 2 }}
        >
          Add New Project
        </Button>
      </Grid>
      <Grid container spacing={3} style={{ width: "100%" }}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <ProjectCard>
              <CardMediaStyled
                component="img"
                alt={project.title}
                height="200"
                image={
                  project.image.url ||
                  "https://source.unsplash.com/random/800x600?project"
                } // Use actual image URL or a default
              />
              <CardContentStyled>
                <Typography variant="h6" component="div" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {project.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Technologies: {project.technologies}
                </Typography>
                <Box mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Stack: {project.stack}
                  </Typography>
                </Box>
              </CardContentStyled>
              <CardActions sx={{ padding: (theme) => theme.spacing(1) }}>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(project)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(project._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </ProjectCard>
          </Grid>
        ))}
      </Grid>

      <AddProjectModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onProjectAdded={handleProjectAdded}
        projectData={projectToEdit}
        onProjectUpdated={handleProjectUpdated}
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
            Are you sure you want to delete this project? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ProjectListContainer>
  );
}

export default ProjectList;
