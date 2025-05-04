import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
} from "@mui/material";

// Custom styles for better visual appearance
const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&:last-child": {
    paddingRight: theme.spacing(3),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function ClientTimelineList() {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelines = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/timeline/getall"); // No auth needed for public view
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch timeline events"
          );
        }
        const data = await response.json();
        setTimelines(data.timelines);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelines();
  }, []);

  if (loading) {
    return <Typography>Loading timeline events...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">Error loading timeline events.</Typography>
    );
  }

  return (
    <Grid container spacing={3} style={{ padding: 20 }}>
      <Grid item xs={12}>
        <StyledTypography variant="h4">Timeline</StyledTypography>
      </Grid>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <StyledTableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="timeline table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>From</StyledTableCell>
                    <StyledTableCell>To</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <StyledTableCell colSpan={4} align="center">
                        Loading timeline events...
                      </StyledTableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <StyledTableCell colSpan={4} align="center">
                        Error: {error}
                      </StyledTableCell>
                    </TableRow>
                  ) : timelines.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={4} align="center">
                        No timeline events found.
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    timelines.map((timeline) => (
                      <StyledTableRow key={timeline._id}>
                        <StyledTableCell component="th" scope="row">
                          {timeline.title}
                        </StyledTableCell>
                        <StyledTableCell>
                          {timeline.description}
                        </StyledTableCell>
                        <StyledTableCell>
                          {timeline.timeline.from}
                        </StyledTableCell>
                        <StyledTableCell>
                          {timeline.timeline.to || "-"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </StyledCardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );
}

export default ClientTimelineList;
