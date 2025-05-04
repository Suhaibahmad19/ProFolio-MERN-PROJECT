import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
  Box,
} from "@mui/material";

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

function ClientSkillList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/skill/getall"); // No auth needed for public view
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

    fetchSkills();
  }, []);

  if (loading) {
    return <Typography>Loading skills...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading skills.</Typography>;
  }

  return (
    <SkillListContainer>
      <Typography variant="h4" gutterBottom>
        Skills
      </Typography>
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
            </SkillCard>
          </Grid>
        ))}
      </Grid>
    </SkillListContainer>
  );
}

export default ClientSkillList;
