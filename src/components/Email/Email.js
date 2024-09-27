import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  TextareaAutosize,
  Button,
  Divider,
  Paper,
  Autocomplete,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import {
  Remove as MinimizeIcon,
  OpenInNew as ExpandIcon,
  Close as CloseIcon,
  AttachFile,
  InsertLink,
  EmojiEmotions,
  ArrowDropUp,
  EventNote,
  LockOutlined,
  Edit,
  MoreVert,
  Delete,
} from "@mui/icons-material";
import { Modal } from "@mui/material";
import axios from "axios";

const EmailComposer = ({ open, onClose, initialAttachment }) => {
  const emailSuggestions = [
    "sayaliredasani@gmail.com",
    "sayali@infobellit.com",
    "arun@infobellit.com",
    "aswin@infobelli.com",
    "manmohan@infobellit.com",
  ];

  const [emailid, setEmailid] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (initialAttachment) {
      setAttachments([initialAttachment]);
    }
  }, [initialAttachment]);

  const send_mail = async () => {
    const formData = new FormData();
    formData.append("to", emailid);
    formData.append("subject", subject);
    formData.append("msg", msg);

    attachments.forEach((attachment) => {
      formData.append("attachments", attachment);
    });
    console.log(attachments);

    try {
      const response = await axios.post(
        "http://192.168.0.182:8080/send_mail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data === "Success") {
        alert("Mail sent");
        onClose();
      } else {
        alert("Try sending mail later");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email");
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="email-composer-title"
      aria-describedby="email-composer-description"
    >
      <Paper elevation={3} sx={{ width: 600, m: "auto", mt: "10%", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            bgcolor: "grey.100",
          }}
        >
          <Typography variant="subtitle1" id="email-composer-title">
            New Message
          </Typography>
          <Box>
            <IconButton size="small">
              <MinimizeIcon />
            </IconButton>
            <IconButton size="small">
              <ExpandIcon />
            </IconButton>
            <IconButton onClick={() => onClose()} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Autocomplete
            multiple
            options={emailSuggestions}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="To"
                variant="standard"
                onChange={(e) => setEmailid(e.target.value)}
                sx={{ mb: 1 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      <Typography variant="caption" color="text.secondary">
                        Cc Bcc
                      </Typography>
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            fullWidth
            label="Subject"
            variant="standard"
            sx={{ mb: 2 }}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
          <TextareaAutosize
            minRows={10}
            placeholder="Type your message here"
            style={{ width: "100%", border: "1px solid #ddd", padding: "8px" }}
            onChange={(e) => setMsg(e.target.value)}
          />

          {attachments.length > 0 && (
            <List>
              {attachments.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeAttachment(index)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            bgcolor: "grey.100",
          }}
        >
          <Button
            onClick={() => send_mail()}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
          >
            Send
          </Button>
          <IconButton size="small">
            <AttachFile />
          </IconButton>
          <IconButton size="small">
            <InsertLink />
          </IconButton>
          <IconButton size="small">
            <EmojiEmotions />
          </IconButton>
          <IconButton size="small">
            <ArrowDropUp />
          </IconButton>
          <IconButton size="small">
            <EventNote />
          </IconButton>
          <IconButton size="small">
            <LockOutlined />
          </IconButton>
          <IconButton size="small">
            <Edit />
          </IconButton>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
          <IconButton size="small">
            <Delete />
          </IconButton>
        </Box>
      </Paper>
    </Modal>
  );
};

export default EmailComposer;
