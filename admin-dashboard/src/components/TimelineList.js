import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Grid,
  Card,
  CardContent,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import AddIcon from "@mui/icons-material/Add";
import AddEditTimelineModal from "./modals/AddEditTimelineModal"; // We'll create this next

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

const StyledButton = styled(Button)(({ theme }) => ({
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

function TimelineList() {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTimelineId, setDeleteTimelineId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTimelines = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/timeline/getall");
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

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleTimelineAdded = (newTimeline) => {
    setTimelines((prevTimelines) => [...prevTimelines, newTimeline]);
  };

  const handleDeleteClick = (id) => {
    setDeleteTimelineId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTimelineId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteDialogOpen(false);
    if (!deleteTimelineId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/timeline/delete/${deleteTimelineId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setTimelines((prevTimelines) =>
          prevTimelines.filter((timeline) => timeline._id !== deleteTimelineId)
        );
        setDeleteTimelineId(null);
        // Optionally show a success message
      } else {
        const errorData = await response.json();
        console.error("Error deleting timeline:", errorData);
        setError(errorData.message || "Failed to delete timeline event");
        setDeleteTimelineId(null);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting timeline:", error);
      setError("Failed to delete timeline event");
      setDeleteTimelineId(null);
      // Optionally show an error message to the user
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: 20 }}>
      <Grid item xs={12}>
        <StyledTypography variant="h4">Timeline</StyledTypography>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Add New Timeline Event
        </StyledButton>
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
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <StyledTableCell colSpan={6} align="center">
                        Loading timeline events...
                      </StyledTableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <StyledTableCell colSpan={6} align="center">
                        Error: {error}
                      </StyledTableCell>
                    </TableRow>
                  ) : timelines.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={6} align="center">
                        No timeline events found. Add some!
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    timelines.map((timeline) => (
                      <StyledTableRow key={timeline._id}>
                        <StyledTableCell component="th" scope="row">
                          {timeline._id}
                        </StyledTableCell>
                        <StyledTableCell>{timeline.title}</StyledTableCell>
                        <StyledTableCell>
                          {timeline.description}
                        </StyledTableCell>
                        <StyledTableCell>
                          {timeline.timeline.from}
                        </StyledTableCell>
                        <StyledTableCell>
                          {timeline.timeline.to || "-"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteClick(timeline._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
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

      <AddEditTimelineModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onTimelineAdded={handleTimelineAdded}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this timeline event? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default TimelineList;
