import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function AddProjectModal({
  open,
  onClose,
  onProjectAdded,
  projectData,
  onProjectUpdated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githublink, setGithublink] = useState("");
  const [projectlink, setProjectlink] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [deployed, setDeployed] = useState("");
  const [image, setImage] = useState(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (projectData) {
      setTitle(projectData.title || "");
      setDescription(projectData.description || "");
      setGithublink(projectData.githublink || "");
      setProjectlink(projectData.projectlink || "");
      setTechnologies(projectData.technologies || "");
      setStack(projectData.stack || "");
      setDeployed(projectData.deployed || "");
      // We don't pre-fill the image here, as the user might not want to change it
    } else {
      // Reset form if modal is opened without projectData
      setTitle("");
      setDescription("");
      setGithublink("");
      setProjectlink("");
      setTechnologies("");
      setStack("");
      setDeployed("");
      setImage(null);
    }
  }, [projectData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("githublink", githublink);
    formData.append("projectlink", projectlink);
    formData.append("technologies", technologies);
    formData.append("stack", stack);
    formData.append("deployed", deployed);
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      if (projectData) {
        // Update existing project
        response = await fetch(
          `http://localhost:4000/project/update/${projectData._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          }
        );
      } else {
        // Add new project
        response = await fetch("http://localhost:4000/project/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (projectData) {
          onProjectUpdated(data.project); // Assuming your backend sends the updated project
        } else {
          onProjectAdded(data);
        }
        onClose();
        // Reset form state (optional, depending on desired behavior)
        setTitle("");
        setDescription("");
        setGithublink("");
        setProjectlink("");
        setTechnologies("");
        setStack("");
        setDeployed("");
        setImage(null);
        alert("Project added/updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Failed to add/update project: " + errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);

      alert("Failed to add/update project: " + error.message);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-project-modal-title"
      aria-describedby="add-project-modal-description"
    >
      <Box sx={style}>
        <Typography id="add-project-modal-title" variant="h6" component="h2">
          {projectData ? "Edit Project" : "Add New Project"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={4}
          />
          <TextField
            label="GitHub Link"
            fullWidth
            margin="normal"
            value={githublink}
            onChange={(e) => setGithublink(e.target.value)}
            required
          />
          <TextField
            label="Project Link"
            fullWidth
            margin="normal"
            value={projectlink}
            onChange={(e) => setProjectlink(e.target.value)}
            required
          />
          <TextField
            label="Technologies"
            fullWidth
            margin="normal"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            required
          />
          <TextField
            label="Stack"
            fullWidth
            margin="normal"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            required
          />
          <TextField
            label="Deployed"
            fullWidth
            margin="normal"
            value={deployed}
            onChange={(e) => setDeployed(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="image-upload">Image</InputLabel>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              inputProps={{ accept: "image/*" }}
            />
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {projectData ? "Update Project" : "Add Project"}
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default AddProjectModal;
