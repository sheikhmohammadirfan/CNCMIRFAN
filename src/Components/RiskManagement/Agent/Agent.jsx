import { post } from "../../../Service/CrudFactory";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "90vh",
    maxHeight: "100vh",
    height: 500,
    margin: 0,
    padding: theme.spacing(3),
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
      minHeight: 350,
      height: 350,
      maxHeight: 400,
    },
  },
  chatWindow: {
    flex: "1 1 0%",
    overflowY: "auto",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    background: "#f7f7f7",
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[200]}`,
    minHeight: 0,
    maxHeight: "100%",
  },
  messageRow: {
    display: "flex",
    marginBottom: theme.spacing(1.5),
  },
  userMessage: {
    marginLeft: "auto",
    background: theme.palette.primary.light,
    color: "#fff",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 2),
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  agentMessage: {
    marginRight: "auto",
    background: theme.palette.grey[200],
    color: theme.palette.text.primary,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 2),
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  input: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
}));

function mockAgentResponse(userMessage) {
  // Simulate a response from the agent
  if (!userMessage.trim())
    return "How can I help you with risk management today?";
  return `You said: "${userMessage}". (This is a mock  response.)`;
}

export default function Agent() {
  const classes = useStyles();
  const [messages, setMessages] = useState([
    {
      sender: "agent",
      text: "Hello! I'm your Risk Management AI Agent. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    
    try {
      const response = await post("/agentx/rmagent/", { query: currentInput });
      console.log("API response:", response);
      if (response.status) {
        setMessages((prev) => [
          ...prev,
          { sender: "agent", text: response.data || "No reply from agent." },
        ]); 
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "agent", text: response.message || "Error contacting the server." },
        ]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "Error contacting the server." },
      ]);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper className={classes.root} elevation={2}>
      <Typography variant="h5" className={classes.header}>
        AI Agent
      </Typography>
      <Box className={classes.chatWindow}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            className={classes.messageRow}
            justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}
          >
            <Box
              className={
                msg.sender === "user"
                  ? classes.userMessage
                  : classes.agentMessage
              }
            >
              {msg.text}
            </Box>
          </Box>
        ))}
        <div ref={chatEndRef} />
      </Box>
      <form
        className={classes.inputContainer}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <TextField
          className={classes.input}
          variant="outlined"
          size="small"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          multiline
          minRows={1}
          maxRows={4}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          aria-label="send"
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </form>
    </Paper>
  );
}
