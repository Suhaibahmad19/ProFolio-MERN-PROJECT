import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

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

function AddEditTimelineModal({
  open,
  onClose,
  onTimelineAdded,
  timelineData,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (timelineData) {
      setTitle(timelineData.title || "");
      setDescription(timelineData.description || "");
      setFrom(timelineData.timeline?.from || "");
      setTo(timelineData.timeline?.to || "");
    } else {
      setTitle("");
      setDescription("");
      setFrom("");
      setTo("");
    }
  }, [timelineData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const timelineEntry = {
      title,
      description,
      from,
      to,
    };

    try {
      const response = await fetch("http://localhost:4000/timeline/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(timelineEntry),
      });

      if (response.ok) {
        const data = await response.json();
        onTimelineAdded(data.timeline); // Assuming your backend sends the created timeline object
        onClose();
        // Reset form state
        setTitle("");
        setDescription("");
        setFrom("");
        setTo("");
        alert("Timeline event added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error adding timeline:", errorData);
        alert("Failed to add timeline event: " + errorData.message);
      }
    } catch (error) {
      console.error("Error adding timeline:", error);
      alert("Failed to add timeline event: " + error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-timeline-modal-title"
      aria-describedby="add-timeline-modal-description"
    >
      <Box sx={style}>
        <Typography id="add-timeline-modal-title" variant="h6" component="h2">
          Add New Timeline Event
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
            label="From (e.g., 2020, Jan 2021, May 15, 2022)"
            fullWidth
            margin="normal"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
          <TextField
            label="To (Optional, e.g., 2022, Dec 2023, Present)"
            fullWidth
            margin="normal"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Timeline Event
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default AddEditTimelineModal;
