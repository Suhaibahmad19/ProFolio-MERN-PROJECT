import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  styled,
  Box,
} from "@mui/material";

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
});

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ProjectListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

function ClientProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/project/getall"); // No need for authorization on public view
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

    fetchProjects();
  }, []);

  if (loading) {
    return <Typography>Loading projects...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading projects.</Typography>;
  }

  return (
    <ProjectListContainer>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
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
                }
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
            </ProjectCard>
          </Grid>
        ))}
      </Grid>
    </ProjectListContainer>
  );
}

export default ClientProjectList;
