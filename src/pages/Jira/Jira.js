import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  IconButton,
  Drawer,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ScreenSearchDesktop as ScreenSearchDesktopIcon,
  Hub as HubIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import io from "socket.io-client";
import Markdown from "react-markdown";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import he from "he";
import Tooltip from "@mui/material/Tooltip";
import infobellImg from "../../assets/Images/infobellLogo.png";
import cohereimg from "../../assets/Images/images.png";
import openaiimg from "../../assets/Images/openai-logo-0.png";
import styles from "./Jira.module.css";
import Menu from "@mui/material/Menu";
// import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MenuItem from "@mui/material/MenuItem";
// import DeleteIcon from '@mui/icons-material/Delete';
import LegendToggleIcon from "@mui/icons-material/LegendToggle";
import { useAuth } from "../Login/AuthContext";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import HtmlToText from "./HtmltoText";
import AssistantIcon from "@mui/icons-material/Assistant";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const socket1 = io("http://localhost:5000/cohere", {
  transports: ["websocket"],
});
const socket2 = io("http://localhost:5000/research", {
  transports: ["websocket"],
});

const sdk = require("microsoft-cognitiveservices-speech-sdk");
// const fs = require('fs').promises;
const SPEECH_KEY = "f4a8f5be7801494fa47bc87d6d8ca31d";
const SPEECH_REGION = "eastus";
const speechConfig = sdk.SpeechConfig.fromSubscription(
  SPEECH_KEY,
  SPEECH_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";
speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural";
//////////////////////////////

const Jira = () => {
  const navigate = useNavigate();
  const queryRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState("");
  const [cohere, setCohere] = useState();
  const [finalContent, setFinalContent] = useState("");
  const [finalCohere, setFinalCohere] = useState("");
  const [coheremsg, setCoheremsg] = useState([]);
  const location = useLocation();
  const { profile } = location.state || {};
  const [logout, setLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  let [answerFlag1, setAnswerFlag1] = useState(true);
  let [answerFlag2, setAnswerFlag2] = useState(true);
  const { logoutUser } = useAuth();
  const [randomQueries, setRandomQueries] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [previousWords, setPreviousWords] = useState([]);
  const [currentSearchValue, setCurrentSearchValue] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  // todo: Make a function to populate 3 values here and make them visible for second query onwords as well.
  const queries = [
    "Find all bugs in the Adventurous Rider project",
    "How many issues are in medium priority in project AR",
    "Please provide details for the issue ar-4",
    "How many closed issues are there across all projects?",
    "Give me a list of closed issues of AR project in table form",
    "What is the summary of issue AR-77?",
    "Give me a list of closed issues of Praveenna Bharathi in general give in bullet points",
    "How many closed issues are there in AR project?",
    "Give me details on issue ar-77 in bullet points",
    "Give me details of issues assigned to David Silva AR project",
    "How many issues are in medium priority in project AR",
  ];
  // todo: Make a function to populate 3 values here and make them visible for second query onwords as well.
  const servicenow_queries = [
    "What incidents have a priority of 1?",
    "What incidents are currently Open?",
    "Which incident was opened by Lisa White?",
    "List the incidents assigned to Balamurali Ommi?",
    "list the incidents which are In progress?",
    "Give the details of the incident related to VPN connection issue?",
    "list the details of the incident related to keyword 'VPN' ?",
    "What is the status of the 'Slow application response time' incident?",
    "Show details of the incident reported by Emily Davis?",
    "give the details of the incidents related to 'Network team'?",
  ];

  const getRandomQueries = (arr, n) => {
    let shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  useEffect(() => {
    setRandomQueries(getRandomQueries(queries, 3));
  }, []);

  useEffect(() => {
    if (messages) {
      console.log(messages);
    }
  }, [messages]);

  let synthesizer = null;
  const volumeup = (text) => {
    if (isSpeaking) {
      // Stop the current speech
      if (synthesizer) {
        synthesizer.close();
        console.log("Speech stopped");
      }
      synthesizer = null;
      setIsSpeaking(false);
    } else {
      // Start new speech
      synthesizer = new sdk.SpeechSynthesizer(speechConfig);
      setIsSpeaking(true);

      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("Synthesis finished.");
          } else {
            console.error(`Speech synthesis failed: ${result.reason}`);
          }
          setIsSpeaking(false);
        },
        (error) => {
          console.error("Speech synthesis error:", error);
          setIsSpeaking(false);
        }
      );
    }
  };

  useEffect(() => {
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      "f4a8f5be7801494fa47bc87d6d8ca31d", // Replace with your key
      "eastus"
    ); // Replace with your actual key and region

    // Create the recognizer
    const speechRecognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    setRecognizer(speechRecognizer);

    return () => {
      if (speechRecognizer) {
        speechRecognizer.close();
      }
    };
  }, []);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  const correctSpecialWords = (text) => {
    return text
      .split(" ")
      .map((word) => {
        switch (word.toLowerCase()) {
          case "amd epic":
            return "AMD EPYC";
          case "amd risen":
            return "AMD RYZEN";
          case "processes":
            return "processors";
          case "epic":
            return "EPYC";
          case "risen":
          case "horizon":
          case "rise and":
            return "RYZEN";
          case "amd":
          case "md":
          case "mda":
            return "AMD";
          default:
            return word;
        }
      })
      .join(" ");
  };
  // const startListening = async () => {
  //   if (recognizer) {
  //     setIsListening(true);

  //     recognizer.startContinuousRecognitionAsync(
  //       () => {
  //         console.log("Continuous recognition started");
  //       },
  //       (error) => {
  //         console.error("Error starting continuous recognition:", error);
  //         setIsListening(false);
  //       }
  //     );

  //     let previousWords = [];
  //     let currentSearchValue = "";

  //     recognizer.recognizing = (s, e) => {
  //       if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
  //         const currentWords = e.result.text.split(" ");
  //         const newWords = currentWords.filter(
  //           (word) => !previousWords.includes(word)
  //         );

  //         if (newWords.length > 0) {
  //           const interimText = correctSpecialWords(newWords.join(" "));
  //           currentSearchValue = (
  //             currentSearchValue +
  //             " " +
  //             interimText
  //           ).trim();

  //           console.log("New words:", interimText);
  //           console.log("Updated Search Value:", currentSearchValue);

  //           setSearchValue(currentSearchValue);
  //           previousWords = currentWords;
  //         }
  //       }
  //     };
  //   }
  // };

  // const startListening=async()=>{
  //   if(recognizer){
  //     setIsListening(true)
  //     recognizer.startContinuousRecognitionAsync(()=>{
  //       console.log("Continuous Recognition started")
  //     },
  //   (error)=>{
  //     console.error("Error starting continuous recognition", error);
  //     setIsListening(false)
  //   })
  //   recognizer.recognizing=(s, e)=>{
  //     if(e.result.reason === sdk.ResultReason.RecognizingSpeech){
  //       const transcription =searchValue + e.result.text.split(" ");
  //       setSearchValue(transcription)
  //     }
  //   }
  //   }
  // }
  const startListening = async () => {
    if (recognizer) {
      setIsListening(true);

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("Continuous recognition started");
        },
        (error) => {
          console.error("Error starting continuous recognition:", error);
          setIsListening(false);
        }
      );

      recognizer.recognizing = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
          const currentWords = e.result.text.split(" ");
          const newWords = currentWords.filter(
            (word) => !previousWords.includes(word)
          );
          setCurrentSearchValue(currentSearchValue + " " + newWords.join(" "));
          setPreviousWords((prevWords) => [...prevWords, ...newWords]);
          setSearchValue(currentSearchValue.trim());
        }
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          setTranscription((prevTranscription) => {
            const newTranscription = prevTranscription + " " + e.result.text;
            setSearchValue(newTranscription);
            return newTranscription;
          });
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          console.log("NOMATCH: Speech could not be recognized.");
        }
      };
    }
  };

  const stopListening = () => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log("Continuous recognition stopped");
          setIsListening(false);
        },
        (error) => {
          console.error("Error stopping continuous recognition:", error);
        }
      );
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawerWidth = 200;
  useEffect(() => {
    socket2.on("response", (data) => {
      if (data.text === "stream ended") {
        setAnswerFlag1(true);
        setFinalContent(answers);
      } else {
        setAnswerFlag1(false);
        setAnswers((prevAnswers) => (prevAnswers || "") + data.text);
        console.log(data.text);
        console.log("socket2", answers);
      }
    });

    return () => {
      socket2.off("response");
    };
  }, [answers]);

  useEffect(() => {
    console.log("FINAL", finalContent); // Log the entire content when it changes
    setMessages((prev) => {
      // Create a shallow copy of the previous state
      let data = [...prev];
      console.log("AAAA", data);
      // Check if the last element exists, and update its 'answer1' property
      if (data.length > 0) {
        data[data.length - 1].answer = finalContent;
      }

      // Return the updated array to set the new state
      return data;
    });
  }, [finalContent]);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    socket1.on("response", (data) => {
      if (data.text === "stream ended") {
        setAnswerFlag2(true);

        setFinalCohere(cohere); // Store the entire content when stream ends
        // setCohere(""); // Reset answers state for future use
      } else {
        setAnswerFlag2(false);

        setCohere((prevCohere) => (prevCohere || "") + data.text);
        console.log("cohere", cohere);
      }
    });

    return () => {
      socket1.off("response");
    };
  }, [cohere]);

  useEffect(() => {
    console.log("FINAL", finalCohere); // Log the entire content when it changes
    setMessages((prev) => {
      // Create a shallow copy of the previous state
      let data = [...prev];

      // Check if the last element exists, and update its 'answer1' property
      if (data.length > 0) {
        data[data.length - 1].answer1 = finalCohere;
      }

      // Return the updated array to set the new state
      return data;
    });
    // setCoheremsg((prev) => {
    //   return [...prev, { answer: finalCohere }];
    // });
  }, [finalCohere]);
  useEffect(() => {
    if (answerFlag1 && answerFlag2) {
      setCohere();
      setAnswers(); // Reset answers state for future use
    }
  }, [answerFlag1, answerFlag2]);

  //////////////////////////////////////////////////////////////////////////////////////
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
    setCurrentSearchValue(newValue);
    setTranscription(newValue); // Update transcription with manual edit
    setManuallyEdited(true); // Mark as manually edited
  };

  const getAnswer = async () => {
    const userMessage = { answer: searchValue, sender: "user" };
    const botMessage = { sender: "bot", display: 0 };

    setMessages([...messages, userMessage, botMessage]);
    setCoheremsg([...coheremsg, userMessage, botMessage]);

    if (searchValue) {
      setIsOpen(false);
      try {
        const response = await fetch(
          // "https://copilot-backend.bluedesert-cfbaeeb3.eastus.azurecontainerapps.io/stream",
          "http://192.168.1.102:5651/stream",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchValue }),
          }
        );

        // Ensure the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Response:", response);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let streamedAnswer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          streamedAnswer += chunk;
          console.log("Chunk received:", chunk);
          console.log("Streamed answer so far:", streamedAnswer);
          setFinalContent(streamedAnswer);
          setAnswers(streamedAnswer);
        }

        setFinalContent(streamedAnswer);
        setSearchValue("");
        setPreviousWords([]);
        setCurrentSearchValue("");
      } catch (error) {
        console.log("Error in llm", error);
      }
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, answers]);

  const monitor = () => {
    navigate("/monitor");
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // justifyContent: "space-between",
            height: "10%",
          }}
        >
          <div style={{ width: "2%" }}>
            {" "}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <div>
                <DrawerHeader
                  style={{
                    minHeight: "60px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Tooltip title="Create new chat">
                    {" "}
                    <OpenInNewIcon
                      className={styles.newchat}
                      onClick={() => {
                        setIsOpen(true);
                        setMessages([]);
                      }}
                    />
                  </Tooltip>
                  {/* <img alt="" src={infobellImg} style={{ height: "3rem" }} />  */}
                  <IconButton
                    onClick={() => {
                      setOpen(false, () => {});
                    }}
                  >
                    {theme.direction === "ltr" ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                  {/* <ListItem disablePadding sx={{ marginBottom: "8px" }}>
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD", // Change background color on hover
                        },
                        backgroundColor:
                          selectedItem === "uploadDoc"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => {
                        setMonitoring(true);
                        monitor();
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <ScreenSearchDesktopIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Monitoring" />
                    </ListItemButton>
                  </ListItem> */}
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/Home")}>
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <QueryStatsIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Monitoring" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </div>
            </Drawer>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "98%",
              justifyContent: "space-between",
              marginLeft: 0,
            }}
          >
            <img src={infobellImg} style={{ height: "3rem" }} />

            {/* <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <Button
                  className={styles.logout}
                    sx={{
                      backgroundColor: "#00A9FF",
                      color: "white",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      minWidth: "unset",
                      minHeight: "unset",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      padding: 0,
                      position: "relative",
                    }}
                    variant="contained"
                    {...bindTrigger(popupState)}
                  >
                    <span className={styles.initialButton}>AMD</span>
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                    <MenuItem
                      onClick={() => {
                        setLogout(true);
                        popupState.close();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </PopupState> */}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "10px",
            justifyContent: "space-around",
            height: "78%",
          }}
        >
          {isOpen ? (
            <div
              style={{
                width: "70%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{ fontSize: "70px", opacity: "0.8", color: "#3B82F6" }}
                >
                  {" "}
                  Copilot
                </h1>
              </div>

              <div
                style={{
                  marginTop: "20%",
                  height: "50%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {randomQueries.map((query, index) => (
                  <div className={styles.promptCustom}>
                    <p
                      key={index}
                      onClick={() => {
                        setSearchValue(query);
                      }}
                      className={styles.subtext}
                    >
                      {query}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "10px",
                  height: "100%",
                  width: "50%",
                }}
              >
                <div
                  ref={messagesEndRef}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                  }}
                  className={styles.scrollContainer}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <h4>Copilot</h4>
                    <p style={{ color: "lightgray" }}>Your AI Partner </p>
                  </div>
                  {messages?.map((message, index) => (
                    <div
                      className="scroll-container"
                      style={{
                        display: "flex",
                        justifyContent:
                          message?.sender === "user"
                            ? "flex-end"
                            : "flex-start",
                        flexDirection:
                          message?.sender === "user" ? "" : "column",
                      }}
                    >
                      {message?.sender === "user" && (
                        <>
                          <p
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "8px",
                              backgroundColor:
                                message?.sender === "user"
                                  ? "#cccccc7d"
                                  : "unset",
                              width: "fit-content",
                            }}
                          >
                            {" "}
                            {message.answer}{" "}
                          </p>
                        </>
                      )}

                      {message?.sender === "bot" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              textAlign: "left",
                              justifyContent: "flex-start",
                              width: "auto",
                              flexDirection: "row",
                              overflow: "auto",
                              // message?.answer1?.length > 0 ? "row" : "column",
                            }}
                          >
                            {message?.answer &&
                              [0, 1].indexOf(message?.display) > -1 && (
                                <div
                                  onClick={() => {
                                    setMessages((prev) => {
                                      let values = [...prev];
                                      values[index]["display"] = 1;
                                      return values;
                                    });
                                  }}
                                  className={styles.robotmessageContainer}
                                  style={{
                                    width:
                                      message.display !== 0 ? "100%" : "100%",
                                  }}
                                >
                                  <img
                                    src={openaiimg}
                                    style={{ width: "50px" }}
                                  />
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {/* {" "} */}
                                    {message.answer}
                                  </ReactMarkdown>
                                  {/*<Markdown>{message.answer}</Markdown>*/}
                                  {/* <ParseContent text={message.answer} /> */}
                                  {/* <HtmlToText html={message.answer} /> */}
                                </div>
                              )}
                            {message?.answer1 &&
                              [0, 2].indexOf(message?.display) > -1 && (
                                <div
                                  onClick={() => {
                                    setMessages((prev) => {
                                      let values = [...prev];
                                      values[index]["display"] = 2;
                                      return values;
                                    });
                                  }}
                                  className={styles.robotmessageContainer}
                                  style={{
                                    width:
                                      message.display !== 0 ? "100%" : "50%",
                                  }}
                                >
                                  <img
                                    src={openaiimg}
                                    style={{ width: "50px" }}
                                  />
                                  <Markdown>{message.answer1}</Markdown>
                                </div>
                              )}
                          </div>

                          {/* <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{ fontSize: "12px", color: "gray" }}
                              onClick={() => {
                                if (message?.display === 0) {
                                  return;
                                }
                                setMessages((prev) => {
                                  let values = [...prev];
                                  values[index]["display"] = 0;
                                  return values;
                                });
                              }}
                            >
                              {message?.display !== 0 ? "Compare" : ""}
                            </p>
                            <p
                              style={{ fontSize: "12px", color: "gray" }}
                              onClick={() => {
                                if (message?.display === 0) {
                                  return;
                                }
                                setMessages((prev) => {
                                  let values = [...prev];
                                  values[index]["display"] =
                                    message?.display === 1 ? 2 : 1;
                                  return values;
                                });
                              }}
                            >
                              {message?.display !== 0
                                ? `<${message?.display === 1 ? 1 : 2} / 2>`
                                : ""}
                            </p>
                          </div> */}

                          {/* {!isOpen && message?.sender!=="user" ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                height: "5%",
                                justifyContent: "space-between",
                              }}
                            >
                              {message.display!==0 ?(<Button
                                variant="text"
                                className={styles.compareButton}
                                onClick={() => (


                                  setMessages((prev)=>{
                                    let values = [...prev]
                                    values[index]['display']=0;
                                    return values
                                  })

                                  // ( = 0message.display)
                                 
                                )}
                              >
                                Compare {message?.sender ||'33'}
                              </Button>):<p></p>}
                              <Button
                                variant="text"
                                className={styles.compareButton}
                                onClick={() => {
                                  if (message.display === 2) {
                                    setMessages((prev)=>{
                                      let values = [...prev]
                                      values[index]['display']=1;
                                      return values
                                    })
                                   
                                  } else {
                                    setMessages((prev)=>{
                                      let values = [...prev]
                                      values[index]['display']=2;
                                      return values
                                    });
                                  }
                                }}
                              >
                                {message.display === 1 ? "1/2" : "2/2"}
                              </Button>
                            </div>
                          ) : (
                            <div></div>
                          )} */}
                        </>
                      )}
                    </div>
                  ))}
                  {true && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          textAlign: "left",
                          justifyContent: "flex-start",
                          width: "auto",
                          flexDirection: "row",
                        }}
                      >
                        {/* {answers && (
                          <div className={styles.robotmessageContainer}>
                            <img src={cohereimg} style={{ width: "50px" }} />
                            <Markdown>{answers}</Markdown>
                          </div>
                        )} */}
                        {cohere && (
                          <div className={styles.robotmessageContainer}>
                            <img src={openaiimg} style={{ width: "50px" }} />
                            <p>{cohere}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <Dialog
          open={logout}
          onClose={() => setLogout(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Logout</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to logout?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogout(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/Login");
                handleLogout();
                setLogout(false);
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            height: "7%",
          }}
        >
          <div
            style={{
              width: "50%",
              border: "2px solid #ccc",
              borderRadius: 50,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              style={{ color: isListening ? "red" : "black" }}
              onClick={isListening ? stopListening : startListening}
            >
              <KeyboardVoiceIcon className={styles.sendIcon} />
            </Button>
            <input
              ref={queryRef}
              className={styles.searchInput}
              placeholder="Enter the prompt"
              value={searchValue || currentSearchValue}
              onChange={handleInputChange}
            />
            <Button style={{ color: "black" }} onClick={() => getAnswer()}>
              <SendIcon className={styles.sendIcon} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jira;
