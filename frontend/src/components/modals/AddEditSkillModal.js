import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Typography,
} from "@mui/material";

function AddEditSkillModal({
  open,
  onClose,
  onSkillAdded,
  skillData,
  onSkillUpdated,
}) {
  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const isEdit = !!skillData;

  useEffect(() => {
    if (skillData) {
      setTitle(skillData.tile || "");
      setProficiency(skillData.proficiency || "");
      setIconPreview(skillData.svg?.url || "");
    } else {
      setTitle("");
      setProficiency("");
      setIcon(null);
      setIconPreview("");
    }
  }, [skillData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type.startsWith("image/png") || file.type.startsWith("image/jpeg"))
    ) {
      setIcon(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setIcon(null);
      setIconPreview("");
      alert("Please upload a PNG or JPEG file.");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title); // Include title for add operations
    formData.append("proficiency", proficiency);
    if (icon) {
      formData.append("svg", icon);
    }

    const authToken = localStorage.getItem("authToken");
    const apiUrl = isEdit
      ? `http://localhost:4000/skill/update/${skillData._id}`
      : "http://localhost:4000/skill/add";
    const method = isEdit ? "PUT" : "POST";

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      let body;
      if (icon || !isEdit) {
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ proficiency }); // Only send proficiency for update
      }

      console.log("Submitting with headers:", headers);
      console.log("Submitting with body:", body); // Debugging log

      const response = await fetch(apiUrl, {
        method: method,
        headers: headers,
        body: body,
      });

      if (response.ok) {
        const data = await response.json();
        if (isEdit) {
          onSkillUpdated(data.skill);
        } else {
          onSkillAdded(data.application);
        }
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save skill.");
      }
    } catch (error) {
      console.error("Error saving skill:", error);
      alert("Failed to save skill.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isEdit ? "Edit Skill" : "Add New Skill"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="proficiency-label">Proficiency</InputLabel>
          <Select
            labelId="proficiency-label"
            id="proficiency"
            value={proficiency}
            label="Proficiency"
            onChange={(e) => setProficiency(e.target.value)}
            required
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
            <MenuItem value="Expert">Expert</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="icon-upload">PNG or JPEG Icon</InputLabel>
          <Input
            id="icon-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            aria-describedby="icon-helper-text"
          />
          {iconPreview && (
            <Typography variant="caption" display="block" gutterBottom>
              {isEdit ? "Current Icon:" : "Selected Icon:"} {iconPreview}
            </Typography>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {isEdit ? "Update Skill" : "Add Skill"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditSkillModal;
