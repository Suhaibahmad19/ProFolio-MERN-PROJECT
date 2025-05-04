import React, { useState } from "react";
import { TextField, Button, styled, Box, Typography } from "@mui/material";

const MessageInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
}));

const SendButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function MessageSend() {
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [submissionError, setSubmissionError] = useState("");

  const handleNameChange = (event) => {
    setSenderName(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (senderName.trim() && subject.trim() && message.trim()) {
      setSubmissionStatus(null);
      setSubmissionError("");
      try {
        const response = await fetch("http://localhost:4000/message/send", {
          // Ensure this is your correct backend endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderName: senderName,
            subject: subject,
            message: message,
          }),
        });

        if (response.ok) {
          console.log("Message sent successfully!");
          setMessage("");
          setSubject("");
          setSenderName("");
          setSubmissionStatus("success");
          // Optionally, provide visual feedback to the user (e.g., a success message)
          setTimeout(() => setSubmissionStatus(null), 3000); // Clear status after a delay
        } else {
          const errorData = await response.json();
          console.error("Error sending message:", errorData);
          setSubmissionStatus("error");
          setSubmissionError(errorData.message || "Failed to send message.");
          // Optionally, display the error message to the user
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setSubmissionStatus("error");
        setSubmissionError("Network error. Please try again.");
        // Optionally, display the error message to the user
      }
    } else {
      setSubmissionStatus("error");
      setSubmissionError("Please fill in all fields.");
    }
  };

  return (
    <Box>
      <MessageInput
        label="Your Name"
        value={senderName}
        onChange={handleNameChange}
        variant="outlined"
        margin="normal"
        required
      />
      <MessageInput
        label="Subject"
        value={subject}
        onChange={handleSubjectChange}
        variant="outlined"
        margin="normal"
        required
      />
      <MessageInput
        label="Message"
        multiline
        rows={4}
        value={message}
        onChange={handleMessageChange}
        variant="outlined"
        margin="normal"
        required
      />
      <SendButton
        variant="contained"
        onClick={handleSendMessage}
        disabled={!senderName.trim() || !subject.trim() || !message.trim()}
      >
        Send Message
      </SendButton>

      {submissionStatus === "success" && (
        <Typography color="success" sx={{ mt: 1 }}>
          Message sent successfully!
        </Typography>
      )}
      {submissionStatus === "error" && (
        <Typography color="error" sx={{ mt: 1 }}>
          {submissionError}
        </Typography>
      )}
    </Box>
  );
}

export default MessageSend;
