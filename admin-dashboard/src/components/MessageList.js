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

// Styled components for better visual appearance
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

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/message/getall", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchMessages();
    } else {
      console.error("No authentication token found.");
      // Optionally redirect to login
    }
  }, [authToken]);

  const handleDeleteClick = (id) => {
    setDeleteMessageId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteMessageId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteDialogOpen(false);
    if (!deleteMessageId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/message/delete/${deleteMessageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== deleteMessageId)
        );
        setDeleteMessageId(null);
        // Optionally show a success message
      } else {
        const errorData = await response.json();
        console.error("Error deleting message:", errorData);
        setError(errorData.message || "Failed to delete message");
        setDeleteMessageId(null);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete message");
      setDeleteMessageId(null);
      // Optionally show an error message to the user
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: 20 }}>
      <Grid item xs={12}>
        <StyledTypography variant="h4">Client Messages</StyledTypography>
      </Grid>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <StyledTableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="messages table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sender Name</StyledTableCell>
                    <StyledTableCell>Subject</StyledTableCell>
                    <StyledTableCell>Message</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <StyledTableCell colSpan={5} align="center">
                        Loading messages...
                      </StyledTableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <StyledTableCell colSpan={5} align="center">
                        Error: {error}
                      </StyledTableCell>
                    </TableRow>
                  ) : messages.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={5} align="center">
                        No messages found.
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    messages.map((message) => (
                      <StyledTableRow key={message._id}>
                        <StyledTableCell component="th" scope="row">
                          {message.senderName}
                        </StyledTableCell>
                        <StyledTableCell>{message.subject}</StyledTableCell>
                        <StyledTableCell>{message.message}</StyledTableCell>
                        <StyledTableCell>
                          {new Date(message.createdAt).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteClick(message._id)}
                            color="inherit"
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
            Are you sure you want to delete this message?
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

export default MessageList;
