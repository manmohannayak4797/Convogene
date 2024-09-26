import React, { useRef, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const ChatbotPopup = ({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  handleSend,
  selectedOption,
  setSelectedOption,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div style={styles.container}>
        <List style={styles.messageList}>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              style={{
                ...styles.messageItem,
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {message.sender !== "user" && (
                <Avatar style={styles.avatar}>
                  <SmartToyIcon />
                </Avatar>
              )}
              <ListItemText
                primary={message.text}
                style={{
                  ...styles.messageText,
                  backgroundColor:
                    message.sender === "user" ? "#3B82F6" : "#E5E7EB",
                  color: message.sender === "user" ? "white" : "black",
                }}
              />
              {message.sender === "user" && (
                <Avatar style={styles.avatar}>
                  <PersonIcon />
                </Avatar>
              )}
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        <div style={styles.inputContainer}>
          <FormControl
            style={{
              width: "150px",
              position: "absolute",
              top: "16px",
              left: "16px",
            }}
          >
            <InputLabel>Select Service</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              label="Select Service"
            >
              <MenuItem value="jira">Jira</MenuItem>
              <MenuItem value="salesforce">Salesforce</MenuItem>
              <MenuItem value="servicenow">ServiceNow</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleSend(input, selectedOption)
            }
            style={{ ...styles.input, flexGrow: 1 }}
            placeholder="Type your message..."
          />
          <Button
            onClick={() => handleSend(input, selectedOption)}
            style={{ ...styles.sendButton, marginLeft: "8px" }}
          >
            Send
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

const styles = {
  container: {
    height: "500px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f0f4f8",
  },
  messageList: {
    flexGrow: 1,
    overflow: "auto",
    padding: "16px",
  },
  messageItem: {
    marginBottom: "12px",
  },
  messageText: {
    padding: "12px",
    borderRadius: "18px",
    maxWidth: "70%",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    marginRight: "8px",
    marginLeft: "8px",
    backgroundColor: "#3B82F6",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "white",
    borderTop: "1px solid #e0e0e0",
  },

  dropdown: {
    marginBottom: "16px",
  },
  messageList: {
    flexGrow: 1,
    overflow: "auto",
    padding: "16px",
    marginTop: "60px", // Add this line to create space for the dropdown
  },

  input: {
    marginRight: "8px",
    marginBottom: "8px",
  },
  sendButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    "&:hover": {
      backgroundColor: "#2563EB",
    },
  },
};

export default ChatbotPopup;
