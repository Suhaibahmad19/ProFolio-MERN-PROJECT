import React, { useState } from "react";
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

function AddSoftwareApplicationModal({ open, onClose, onApplicationAdded }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // Changed 'svg' to 'image'
  const authToken = localStorage.getItem("authToken");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      // Changed 'svg' to 'image'
      alert("Please upload a PNG or JPEG image."); // Updated alert message
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("svg", image); // Backend expects 'svg' field

    try {
      const response = await fetch(
        "http://localhost:4000/softwareapplication/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        onApplicationAdded(data.application);
        onClose();
        setName("");
        setImage(null); // Changed 'svg' to 'image'
        alert("Software application added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error adding application:", errorData);
        alert("Failed to add software application: " + errorData.message);
      }
    } catch (error) {
      console.error("Error adding application:", error);
      alert("Failed to add software application: " + error.message);
    }
  };

  const handleImageChange = (event) => {
    // Changed 'handleSvgChange' to 'handleImageChange'
    setImage(event.target.files[0]); // Changed 'svg' to 'image'
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-software-application-modal-title"
      aria-describedby="add-software-application-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="add-software-application-modal-title"
          variant="h6"
          component="h2"
        >
          Add New Software Application
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="image-upload">PNG/JPEG Icon</InputLabel>{" "}
            {/* Updated label */}
            <Input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg" // Updated accept attribute
              onChange={handleImageChange} // Updated handler
              required
              inputProps={{ accept: "image/png, image/jpeg" }} // Updated inputProps
            />
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Application
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default AddSoftwareApplicationModal;
