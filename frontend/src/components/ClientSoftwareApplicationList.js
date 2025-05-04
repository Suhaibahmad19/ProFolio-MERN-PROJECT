import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
  Box,
  CardMedia,
} from "@mui/material";

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

function ClientSoftwareApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:4000/softwareapplication/getall" // No auth needed for public view
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

    fetchApplications();
  }, []);

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
      <Typography variant="h4" gutterBottom>
        Software Applications
      </Typography>
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
            </ApplicationCard>
          </Grid>
        ))}
      </Grid>
    </ApplicationListContainer>
  );
}

export default ClientSoftwareApplicationList;
