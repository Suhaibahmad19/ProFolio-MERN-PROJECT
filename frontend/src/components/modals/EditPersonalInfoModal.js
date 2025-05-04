import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Attachment from "@mui/icons-material/Attachment";
import { styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Input = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function EditPersonalInfoModal({ open, onClose, userData, onUserInfoUpdated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [portfolioURL, setPortfolioURL] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [linkedInURL, setLinkedInURL] = useState("");
  const [instagramURL, setInstagramURL] = useState("");
  const [twitterURL, setTwitterURL] = useState("");
  const [facebookURL, setFacebookURL] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setAboutMe(userData.aboutMe || "");
      setPortfolioURL(userData.portfolioURL || "");
      setGithubURL(userData.githubURL || "");
      setLinkedInURL(userData.linkedInURL || "");
      setInstagramURL(userData.instagramURL || "");
      setTwitterURL(userData.twitterURL || "");
      setFacebookURL(userData.facebookURL || "");
      setYoutubeURL(userData.youtubeURL || "");
      setAvatarFile(null); // Reset files when modal opens with new data
      setResumeFile(null);
    }
  }, [userData]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    setResumeFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("aboutMe", aboutMe);
    formData.append("portfolioURL", portfolioURL);
    formData.append("githubURL", githubURL);
    formData.append("linkedInURL", linkedInURL);
    formData.append("instagramURL", instagramURL);
    formData.append("twitterURL", twitterURL);
    formData.append("facebookURL", facebookURL);
    formData.append("youtubeURL", youtubeURL);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const response = await fetch(
        "http://localhost:4000/user/update/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData, // Send as FormData for file uploads
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Assuming the backend returns the updated user object
        const updatedUserResponse = await fetch(
          "http://localhost:4000/user/profile",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (updatedUserResponse.ok) {
          const updatedUserData = await updatedUserResponse.json();
          onUserInfoUpdated(updatedUserData.user);
          onClose();
          alert(data.message || "Personal information updated successfully!");
        } else {
          const errorData = await updatedUserResponse.json();
          alert(
            "Failed to fetch updated user info: " +
              (errorData.message || "Something went wrong")
          );
        }
      } else {
        const errorData = await response.json();
        alert(
          "Failed to update personal information: " +
            (errorData.message || "Something went wrong")
        );
      }
    } catch (error) {
      console.error("Error updating personal info:", error);
      alert(
        "Failed to update personal information: " +
          (error.message || "Network error")
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-personal-info-modal-title"
      aria-describedby="edit-personal-info-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="edit-personal-info-modal-title"
          variant="h6"
          component="h2"
        >
          Edit Personal Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About Me"
                multiline
                rows={4}
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Portfolio URL"
                value={portfolioURL}
                onChange={(e) => setPortfolioURL(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={githubURL}
                onChange={(e) => setGithubURL(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={linkedInURL}
                onChange={(e) => setLinkedInURL(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram URL"
                value={instagramURL}
                onChange={(e) => setInstagramURL(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Twitter URL"
                value={twitterURL}
                onChange={(e) => setTwitterURL(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facebook URL"
                value={facebookURL}
                onChange={(e) => setFacebookURL(e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="YouTube URL"
                value={youtubeURL}
                onChange={(e) => setYoutubeURL(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Avatar Upload */}
            <Grid item xs={12}>
              <label htmlFor="avatar-upload">
                <Input
                  accept="image/*"
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <IconButton
                  color="primary"
                  aria-label="upload avatar"
                  component="span"
                >
                  <PhotoCamera /> Upload Avatar
                </IconButton>
                {avatarFile && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {avatarFile.name}
                  </Typography>
                )}
              </label>
            </Grid>

            {/* Resume Upload */}
            <Grid item xs={12}>
              <label htmlFor="resume-upload">
                <Input
                  accept="image/*,.pdf,.doc,.docx" // Adjust accepted file types as needed
                  id="resume-upload"
                  type="file"
                  onChange={handleResumeChange}
                />
                <IconButton
                  color="primary"
                  aria-label="upload resume"
                  component="span"
                >
                  <Attachment /> Upload Resume
                </IconButton>
                {resumeFile && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {resumeFile.name}
                  </Typography>
                )}
              </label>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Update Information
          </Button>
          <Button onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default EditPersonalInfoModal;
