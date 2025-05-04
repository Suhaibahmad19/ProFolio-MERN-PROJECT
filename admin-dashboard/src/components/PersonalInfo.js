import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  styled,
  Avatar,
  Box,
  Divider,
  Link,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PublicIcon from "@mui/icons-material/Public"; // For Portfolio
import DescriptionIcon from "@mui/icons-material/Description"; // For Resume
import EditPersonalInfoModal from "./modals/EditPersonalInfoModal";

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  elevation: 3, // Add a subtle shadow
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600, // Make the title bolder
  color: theme.palette.primary.main, // Use primary color for emphasis
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.secondary.main, // Use secondary color
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const SocialLinks = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "flex",
  gap: theme.spacing(1.5), // Reduce gap slightly for icons
  alignItems: "center",
}));

const AboutMeBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100], // Light background for contrast
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

const ResumeLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "&:hover": {
    textDecoration: "underline",
  },
}));

function PersonalInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/user/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user info");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [authToken]);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUserInfoUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <Typography variant="h6">Loading personal information...</Typography>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <StyledContainer maxWidth="md">
      <StyledCard>
        <CardContent>
          <CardTitle variant="h5">Your Profile</CardTitle>
          {user && (
            <>
              <AvatarContainer>
                <Avatar
                  src={user?.avatar?.URL}
                  alt={user?.name}
                  sx={{ width: 120, height: 120, marginRight: 3 }} // Slightly larger avatar
                />
                <Typography variant="h6" fontWeight="bold">
                  {user?.name}
                </Typography>
              </AvatarContainer>
              <Divider sx={{ marginBottom: 2 }} />

              <InfoSection>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <InfoLabel>Name:</InfoLabel>
                      <Typography>{user?.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <InfoLabel>Email:</InfoLabel>
                      <Typography>{user?.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <InfoLabel>Phone:</InfoLabel>
                      <Typography>{user?.phone}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </InfoSection>
              <Divider sx={{ marginBottom: 2 }} />

              <InfoSection>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  About Me
                </Typography>
                <AboutMeBox>
                  <Typography>
                    {user?.aboutMe || "No information provided."}
                  </Typography>
                </AboutMeBox>
              </InfoSection>
              <Divider sx={{ marginBottom: 2 }} />

              <InfoSection>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Resume
                </Typography>
                {user?.resume?.URL ? (
                  <ResumeLink
                    href={user.resume.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DescriptionIcon color="primary" /> View Resume
                  </ResumeLink>
                ) : (
                  <Typography>-</Typography>
                )}
              </InfoSection>
              <Divider sx={{ marginBottom: 2 }} />

              <InfoSection>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Social Links
                </Typography>
                <SocialLinks>
                  {user?.portfolioURL && (
                    <IconButton
                      color="primary"
                      href={user.portfolioURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PublicIcon />
                    </IconButton>
                  )}
                  {user?.githubURL && (
                    <IconButton
                      color="primary"
                      href={user.githubURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {user?.linkedInURL && (
                    <IconButton
                      color="primary"
                      href={user.linkedInURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {user?.instagramURL && (
                    <IconButton
                      color="primary"
                      href={user.instagramURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                  {user?.twitterURL && (
                    <IconButton
                      color="primary"
                      href={user.twitterURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                  {user?.facebookURL && (
                    <IconButton
                      color="primary"
                      href={user.facebookURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon />
                    </IconButton>
                  )}
                  {user?.youtubeURL && (
                    <IconButton
                      color="primary"
                      href={user.youtubeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <YouTubeIcon />
                    </IconButton>
                  )}
                  {!user?.portfolioURL &&
                    !user?.githubURL &&
                    !user?.linkedInURL &&
                    !user?.instagramURL &&
                    !user?.twitterURL &&
                    !user?.facebookURL &&
                    !user?.youtubeURL && <Typography>-</Typography>}
                </SocialLinks>
              </InfoSection>

              <StyledButton
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleOpenEditModal}
              >
                Edit Profile
              </StyledButton>
            </>
          )}
        </CardContent>
      </StyledCard>

      <EditPersonalInfoModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        userData={user}
        onUserInfoUpdated={handleUserInfoUpdated}
      />
    </StyledContainer>
  );
}

export default PersonalInfo;
