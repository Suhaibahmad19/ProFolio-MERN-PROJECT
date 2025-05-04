import React from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import ClientPersonalInfo from "./ClientPersonalInfo"; // May need ClientPersonalInfo
import ClientProjectList from "./ClientProjectList";
import ClientSkillList from "./ClientSkillList"; // ✅ Updated import
import ClientTimelineList from "./ClientTimelineList"; // May need ClientTimelineList
import ClientSoftwareApplicationList from "./ClientSoftwareApplicationList"; // May need ClientSoftwareApplicationList
import ClientMessageSend from "./ClientMessageSend"; // May need ClientMessageSend

const ClientPortfolioPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Portfolio
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ClientPersonalInfo readOnly />{" "}
              {/* Adjust if PersonalInfo has edit features */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ClientProjectList />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ClientSkillList />{" "}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ClientTimelineList readOnly />{" "}
              {/* Adjust if TimelineList has edit features */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ClientSoftwareApplicationList readOnly />{" "}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ClientMessageSend />{" "}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientPortfolioPage;
