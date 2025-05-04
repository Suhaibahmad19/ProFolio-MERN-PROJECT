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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddEditSkillModal from "./modals/AddEditSkillModal"; // We'll create this next

// Custom styles for skill cards
const SkillCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  height: "100%", // Ensure consistent height for all cards
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const SkillCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1, // Allows content to take up available vertical space
}));

const SkillListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

function SkillList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState(null);
  const [deleteSkillId, setDeleteSkillId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/skill/getall", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch skills");
        }
        const data = await response.json();
        setSkills(data.skills);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchSkills();
    } else {
      console.error("No authentication token found.");
      // Optionally redirect to login
    }
  }, [authToken]);

  const handleOpenAddModal = () => {
    setSkillToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
  };

  const handleSkillAdded = (newSkill) => {
    setSkills((prevSkills) => [...prevSkills, newSkill]);
  };

  const handleEditClick = (skill) => {
    setSkillToEdit(skill);
    setIsAddEditModalOpen(true);
  };

  const handleSkillUpdated = (updatedSkill) => {
    setSkills((prevSkills) =>
      prevSkills.map((s) => (s._id === updatedSkill._id ? updatedSkill : s))
    );
  };

  const handleDeleteClick = (id) => {
    setDeleteSkillId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteSkillId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteDialogOpen(false);
    if (!deleteSkillId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/skill/delete/${deleteSkillId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill._id !== deleteSkillId)
        );
        setDeleteSkillId(null);
        // Optionally show a success message
      } else {
        const errorData = await response.json();
        console.error("Error deleting skill:", errorData);
        setError(errorData.message || "Failed to delete skill");
        setDeleteSkillId(null);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      setError("Failed to delete skill");
      setDeleteSkillId(null);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return <Typography>Loading skills...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading skills.</Typography>;
  }

  return (
    <SkillListContainer>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Skills
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ marginBottom: 2 }}
        >
          Add New Skill
        </Button>
      </Grid>
      <Grid container spacing={3} style={{ width: "100%" }}>
        {skills.map((skill) => (
          <Grid item xs={12} sm={6} md={4} key={skill._id}>
            <SkillCard>
              <SkillCardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {skill.title}
                </Typography>
                {skill.svg && skill.svg.url && (
                  <Box mb={1}>
                    <img
                      src={skill.svg.url}
                      alt={skill.title}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary">
                  Proficiency: {skill.proficiency}
                </Typography>
              </SkillCardContent>
              <Box
                sx={{
                  padding: (theme) => theme.spacing(1),
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditClick(skill)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteClick(skill._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </SkillCard>
          </Grid>
        ))}
      </Grid>

      <AddEditSkillModal
        open={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        onSkillAdded={handleSkillAdded}
        skillData={skillToEdit}
        onSkillUpdated={handleSkillUpdated}
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
            Are you sure you want to delete this skill?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </SkillListContainer>
  );
}

export default SkillList;
