import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import RandomQueries from "../../components/IconsHolder/RandomQueries/RandomQueries";
import EmailComposer from "../../components/Email/Email";
import DeleteConformDialog from "./DeleteConformDialog";
import { Switch } from "@mui/material";

import {
  IconButton,
  Drawer,
  Divider,
  TextField,
  Button,
  Modal,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Box,
  Slider,
} from "@mui/material";
import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ScreenSearchDesktop as ScreenSearchDesktopIcon,
  Send as SendIcon,
  QuestionAnswerTwoTone,
  Event,
} from "@mui/icons-material";
import axios from "axios";
import io from "socket.io-client";
import Markdown from "react-markdown";
import fs from "fs";
// import { writeFile, mkdir } from 'fs/promises';
import infobellImg from "../../assets/Images/infobellLogo.png";
import cohereimg from "../../assets/Images/images.png";
import openaiimg from "../../assets/Images/openai-logo-0.png";
import styles from "./Home.module.css";
import { useAuth } from "../Login/AuthContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
// import * as Minio from 'minio'

// import AWS from "aws-sdk";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
// import { useLocation, Navigate } from 'react-router-dom';
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
// import { RecognitionCompletionStatus } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/RecognitionEvents";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import DocumentModal from "../../components/DocumentModal/DocumentModal";

const socket1 = io("http://localhost:5000/cohere");
const socket2 = io("http://localhost:5000/openai4");
const socket3 = io("http://localhost:5000/openai35");

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
//Key1 : 334e16bf5eb643a6b8ebd8f0e61bf937u0i
//Key2 : 8bcb5f3956be4afdbbbc3c3b937fa437
//Region : eastus
//Endpoint : https://eastus.api.cognitive.microsoft.com/

const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState("");
  const [cohere, setCohere] = useState();
  const [gemini, setGemini] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [finalCohere, setFinalCohere] = useState("");
  const [finalGemini, setFinalGemini] = useState("");
  const [widthM, setWidthM] = useState("100%");
  const [mail, setMail] = useState(false);

  // const { profile } = location.state || {};
  const [logout, setLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  let [answerFlag1, setAnswerFlag1] = useState(true);
  let [answerFlag2, setAnswerFlag2] = useState(true);
  let [answerFlag3, setAnswerFlag3] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  // const [filename, setFilename] = useState("");
  const [document, setDocument] = useState(false);
  const [link, setLink] = useState(false);
  // const top_k_ref = useRef(3);
  // const total_tokens_ref = useRef(100);
  const [maxTokens, setMaxTokens] = useState(100); // Default value
  const [temperature, setTemperature] = useState(0.5);
  const [topk, setTopk] = useState(2);
  const depthRef = useRef(null);
  const linkref = useRef("");
  const llm_endpoint_ref = useRef("");
  const embeddingRef = useRef("");
  const indexref = useRef("");
  const queryRef = useRef(null);
  const dimensionsRef = useRef("");
  const metricRef = useState("");
  const { logoutUser } = useAuth();
  const [selectedModel, setSelectedModel] = useState("cohere");
  const [filenameList, setFilenameList] = useState([]);
  const [selectedConnector, setSelectedConnector] = useState("");
  const [monitoring, setMonitoring] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [isCollapse0, setIsCollapse0] = useState(false);
  const [isCollapse, setIsCollapse] = React.useState(false);
  const [isCollapse2, setIsCollapse2] = useState(false);
  const [isCollapse3, setIsCollapse3] = useState(false);
  const [isCollapse4, setIsCollapse4] = useState(false);
  const [isCollapse5, setIsCollapse5] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [index, setIndex] = useState(false);
  const [config, setConfig] = useState(false);
  const [llm_endpoint, setLlm_endpoint] = useState("");
  const [indexes, setIndexes] = useState();
  const [files, setFiles] = useState();
  const [selectedIndex, setSelectedIndex] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [FileToDelete, setFileToDelete] = useState();
  const [openModal, setopenModal] = useState(false);
  const [responses, setResponses] = useState([]);
  const [ragresponses, setRagresponses] = useState([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [useChromaDB, setUseChromaDB] = useState(false);
  const [rag_answer, setRagAnswer] = useState("");
  const today = new Date();
  const date_for_file = today.toISOString().split("T")[0];

  console.log(typeof date_for_file);
  console.log(date_for_file);

  const get_fileDeleteModal = (file) => {
    setFileToDelete(file);
    setopenModal(true);
  };
  const onDelete = async (event) => {
    console.log(event, "delete event");
    const response = await axios.post("http://127.0.0.1:5000/delete_file", {
      file: Deletepayload,
    });
    console.log(response, "response from delete");
    // alert(response?.data?.message)
    handleClose();
    handleCollapse5();
  };
  const [ConfirmDialog, setConfirmDialog] = useState(false);
  const handleClose = () => {
    setConfirmDialog(false);
  };
  const [Deletepayload, setDeletepayload] = useState();
  const confirmDialog = (file) => {
    setConfirmDialog(true);
    setDeletepayload(file);
  };

  const handleChangeIndex = async (event) => {
    setSelectedIndex(event.target.value);
    const response = await axios.post("http://127.0.0.1:5000/set_index_name", {
      index_name: event.target.value,
    });
    alert("Vectorestore Ready");
  };

  const handleCollapse0 = () => {
    setIsCollapse0(!isCollapse0);
  };

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const handleCollapse2 = () => {
    setIsCollapse2(!isCollapse2);
  };
  const handleCollapse3 = async () => {
    const response = await axios.get("http://192.168.0.182:8080/index_list");
    console.log(response.data);
    setIndexes(response.data);
    setIsCollapse3(!isCollapse3);
  };

  const handleCollapse5 = async () => {
    const response = await axios.get("http://192.168.0.182:8080/list_files");
    // const response = await axios.get("http://127.0.0.1:5000/list_files");
    console.log(response.data);
    setFiles(response.data);
    setIsCollapse5(!isCollapse5);
  };
  const handleCollapse4 = async () => {
    setIsCollapse4(!isCollapse4);
  };

  const transformData = (rawData) => {
    let transformedData = [];
    rawData.forEach((item) => {
      const userMessage = { answer: item.Query, sender: "user" };
      const botMessage = { sender: "bot", display: 1, answer: item.Response };
      transformedData.push(userMessage, botMessage);
    });
    return transformedData;
  };

  const get_file = async (event) => {
    setMessages([]);
    console.log("get_file_single");
    console.log("this is file name" + event.target.value);
    // const response = await axios.post("http://127.0.0.1:5000/one_file", {
    const response = await axios.post("http://192.168.0.182:8080/one_file", {
      file: event.target.value,
    });
    console.log(typeof response);
    console.log(response.data);
    const transformedMessages = transformData(response.data);
    setMessages(transformedMessages);
    setIsOpen(false);
  };

  const get_file_mail = async (fileName) => {
    const fileResponse = await axios.post(
      "http://192.168.0.182:8080/one_file_mail",
      { file: fileName },
      { responseType: "blob" } // Important: This tells axios to treat the response as binary data
    );
    const file = new File([fileResponse.data], "conversational_report.pdf", {
      type: fileResponse.data.type,
    });
    console.log(file);
    setAttachment(file);
  };

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

  // Function to correct special words
  const correctSpecialWords = (text) => {
    const corrections = {
      "AMD Epic": "AMD EPYC",
      "AMD risen": "AMD RYZEN",
      processes: "processors",
      epic: "EPYC",
      risen: "RYZEN",
      horizon: "RYZEN",
      "rise and": "RYZEN",
      amd: "AMD",
      MD: "AMD",
      MDA: "AMD",
    };

    return text
      .split(" ")
      .map((word) => corrections[word.toLowerCase()] || word)
      .join(" ");
  };

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

      let previousWords = [];
      let currentSearchValue = "";

      recognizer.recognizing = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
          const currentWords = e.result.text.split(" ");
          const newWords = currentWords.filter(
            (word) => !previousWords.includes(word)
          );

          if (newWords.length > 0) {
            const interimText = correctSpecialWords(newWords.join(" "));
            currentSearchValue = (
              currentSearchValue +
              " " +
              interimText
            ).trim();

            console.log("New words:", interimText);
            console.log("Updated Search Value:", currentSearchValue);

            setSearchValue(currentSearchValue);
            previousWords = currentWords;
          }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
    return file;
    //handleFileUpload();
  };

  const handleFileUpload = async (file) => {
    console.log("later file upload", file);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          " http://127.0.0.1:5000/upload_doc",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);

        setDocument(false);
        setSelectedFile(file);
        alert("Document uploaded Successfully");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error in uploading");
        setDocument(false);
      }
    }
  };

  const getList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/list_objs");
      setFilenameList(response.data);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const deleteDoc = async (filename) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/deleteDoc", {
        filename: filename,
      });
      console.log("Success Deletion");
      getList();
    } catch (error) {
      alert("Error in Deleting");
    }
  };

  const create_index = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create_pinecone_index",
        {
          index_name: indexref.current.value,
          embedding_model: embeddingRef.current.value,
          dimension: Number(dimensionsRef.current.value),
          metrics: metricRef.current.value,
        }
      );
      console.log(response);
      alert("Created");
      setIndex(false);
    } catch (error) {
      alert("Error in creating Index");
      setIndex(false);
    }
  };

  const handle_basic_config = async () => {
    const response = await axios.post("http://127.0.0.1:5000/basic_config", {
      top_k: topk,
      max_tokens: maxTokens,
      temperature: temperature,
    });
    console.log("Done basic config");
  };

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const drawerWidth = 240;
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
      let data = [...prev];
      console.log("AAAA", data);
      if (data.length > 0) {
        data[data.length - 1].answer = finalContent;
      }
      return data;
    });
  }, [finalContent]);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    socket1.on("response", (data) => {
      if (data.text === "stream ended") {
        setAnswerFlag2(true);
        console.log(data.text);

        // setFinalCohere(cohere); // Store the entire content when stream ends
        // setCohere(""); // Reset answers state for future use
      } else {
        setAnswerFlag2(false);

        // setCohere((prevCohere) => (prevCohere || "") + data.text);
        // console.log("cohere", cohere);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].answer += data.text;
          return newMessages;
        });
      }
    });

    return () => {
      socket1.off("response");
    };
  }, [cohere]);

  // console.log(cohere);

  useEffect(() => {
    socket2.on("response", (data) => {
      if (data.text === "stream ended") {
        setAnswerFlag1(true);
        setFinalContent(answers);
      } else {
        setAnswerFlag1(false);
        setAnswers((prevAnswers) => prevAnswers + data.text);
        console.log(data.text);
        console.log("socket2", answers);
      }
    });

    return () => {
      socket2.off("response");
    };
  }, []);

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
    if (answerFlag1 && answerFlag2 && answerFlag3) {
      setCohere();
      setAnswers();
      setGemini();
      // Reset answers state for future use
    }
  }, [answerFlag1, answerFlag2, answerFlag3]);
  /////////////////////////////////////////////////////////gemini/////////
  useEffect(() => {
    socket3.on("response", (data) => {
      if (data.text === "stream ended") {
        setAnswerFlag3(true);
        setFinalGemini(gemini);
      } else {
        setAnswerFlag3(false);
        setGemini((prevAnswers) => (prevAnswers || "") + data.text);
        console.log(data.text);
        console.log("socket3", gemini);
      }
    });

    return () => {
      socket3.off("response");
    };
  }, [gemini]);

  useEffect(() => {
    console.log("FINAL", finalGemini); // Log the entire content when it changes
    setMessages((prev) => {
      // Create a shallow copy of the previous state
      let data = [...prev];
      console.log("AAAA", data);
      // Check if the last element exists, and update its 'answer1' property
      if (data.length > 0) {
        data[data.length - 1].answer2 = finalGemini;
      }

      // Return the updated array to set the new state
      return data;
    });
  }, [finalGemini]);

  //////////////////////////////////////////////////////////////////////////////////////
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const getAnswer = async () => {
    const query = searchValue;
    setSearchValue("");
    const userMessage = { answer: searchValue, sender: "user" };
    const botMessage = { sender: "bot", display: 0, answer: "" };
    setMessages([...messages, userMessage, botMessage]);
    setIsOpen(false);

    if (searchValue) {
      try {
        const response = await fetch(
          //  " http://172.17.46.186:8081/rag_qa_api_stream",
          // "http://127.0.0.1:5000/rag_qa_api_stream",
          "http://192.168.0.182:8080/rag_qa_api_stream",
          // "http://172.28.193.17:8080/rag_qa_api_stream",

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: searchValue }),
          }
        );
        console.log(response);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1].answer += chunk;
            return newMessages;
          });

          // setCohere((prevCohere) => (prevCohere || "") + chunk);
        }

        setSearchValue("");
        setTranscription("");
      } catch (error) {
        console.error("Error in llm:", error);
      }
    }
  };

  const linksend = async () => {
    try {
      const endpoint = useChromaDB
        ? "/web_scrape_chroma"
        : "/web_scrape_pinecone";
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, {
        link: linkref.current.value,
        maxDepth: depthRef.current.value,
        // user: profile.given_name + "_" + profile.family_name,
      });
      console.log(response.data); // Log the response data
      setLink(false);
      alert("Web-scraping Done Successfully!");
    } catch (error) {
      console.error("Error sending link:", error); // Log the error with context
    }
  };

  const setllm = () => {
    setIsCustom(false);
    setLlm_endpoint(llm_endpoint_ref.current.value);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        getAnswer();
      }
    };

    const inputElement = queryRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleKeyPress);
      }
    };
  });

  const handleChangeModel = (event) => {
    console.log("model", event.target.value);
    setSelectedModel(event.target.value);
    navigate("/jira_temp");
    // if (event.target.value === "compare") {
    //   setWidthM("33%");
    // } else {
    //   setWidthM("100%");
    // }
    // if (event.target.value === "custom") {
    //   setIsCustom(true);
    // }
  };
  // console.log(cohere);

  const handleConnector = (event) => {
    console.log("connector", event.target.value);
    setSelectedConnector(event.target.value);
    navigate("/Jira");
  };

  const monitor = () => {
    navigate("/monitor");
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  console.log(messages);

  useEffect(() => {
    scrollToBottom();
  }, [messages, answers]);

  return (
    <>
      {ConfirmDialog && (
        <DeleteConformDialog
          open={ConfirmDialog}
          onClose={handleClose}
          onConfirm={onDelete}
          itemName="History"
          message={`Are you sure you want to delete ?`}
        />
      )}
      {openModal && <Dialog></Dialog>}
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
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>

            {/* sidebar */}

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
                      style={{ color: "#707070" }}
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
                  <ListItem disablePadding sx={{ marginBottom: "8px" }}>
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
                  </ListItem>
                  <ListItem disablePadding sx={{ marginBottom: "8px" }}>
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD", // Change background color on hover
                        },
                        backgroundColor:
                          selectedItem === "createIndex"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => setIndex(true)}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <ControlPointDuplicateIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Create Index" />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem
                    disablePadding
                    onClick={handleCollapse0}
                    sx={{ marginBottom: "8px" }}
                  >
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD",
                        },
                        backgroundColor:
                          selectedItem === "custom_data"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleCollapse0();
                        setSelectedItem("custom_data");
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <WidgetsOutlinedIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Custom Data" />
                      {isCollapse0 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isCollapse0} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <List>
                        <ListItem disablePadding sx={{ marginBottom: "8px" }}>
                          <ListItemButton
                            sx={{
                              "&:hover": {
                                backgroundColor: "#CDF5FD", // Change background color on hover
                              },
                              backgroundColor:
                                selectedItem === "webScraping"
                                  ? "#CDF5FD"
                                  : "transparent",
                            }}
                            onClick={() => setLink(true)}
                          >
                            <ListItemIcon
                              style={{ minWidth: "20px", marginRight: "8px" }}
                            >
                              <ScreenSearchDesktopIcon
                                sx={{ fontSize: 20, color: "#00A9FF" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary="Web Scraping" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ marginBottom: "8px" }}>
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
                              // getList();
                              setSelectedFile(undefined);
                              setDocument(true);
                            }}
                          >
                            <ListItemIcon
                              style={{ minWidth: "20px", marginRight: "8px" }}
                            >
                              <CloudUploadOutlinedIcon
                                sx={{ fontSize: 20, color: "#00A9FF" }}
                              />
                            </ListItemIcon>
                            <ListItemText primary="Upload/Remove Doc" />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </Box>
                  </Collapse>
                  {/* 
                  <ListItem
                    disablePadding
                    onClick={handleCollapse}
                    sx={{ marginBottom: "8px" }}
                  >
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD",
                        },
                        backgroundColor:
                          selectedItem === "models" ? "#CDF5FD" : "transparent",
                      }}
                      onClick={() => {
                        handleCollapse();
                        setSelectedItem("models");
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <WidgetsOutlinedIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Models" />
                      {isCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isCollapse} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="model"
                          name="model"
                          value={selectedModel}
                          onChange={handleChangeModel}
                        >
                          {[
                            "Cohere",
                            "OpenAI4",
                            "OpenAI35",
                            "Gemini",
                            "Compare",
                            "Custom",
                          ].map((model) => (
                            <Box
                              key={model}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#CDF5FD",
                                },
                                backgroundColor:
                                  selectedModel === model
                                    ? "#CDF5FD"
                                    : "transparent",
                                marginBottom: "8px",
                              }}
                            >
                              <FormControlLabel

                                value={model}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      color: "#071952",
                                      "&.Mui-checked": {
                                        color: "#071952",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  model.charAt(0).toUpperCase() + model.slice(1)
                                }
                              />
                            </Box>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Collapse> */}
                  <ListItem
                    disablePadding
                    onClick={handleCollapse2}
                    sx={{ marginBottom: "8px" }}
                  >
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD",
                        },
                        backgroundColor:
                          selectedItem === "connectors"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleCollapse2();
                        setSelectedItem("connectors");
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <WidgetsOutlinedIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Connectors" />
                      {isCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={isCollapse2} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="model"
                          name="model"
                          value={selectedModel}
                          onChange={handleChangeModel}
                        >
                          {["Jira", "Salesforce", "ServiceNow"].map((model) => (
                            <Box
                              key={model}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#CDF5FD",
                                },
                                backgroundColor:
                                  selectedModel === model
                                    ? "#CDF5FD"
                                    : "transparent",
                                marginBottom: "8px",
                              }}
                            >
                              <FormControlLabel
                                value={model}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      color: "#071952",
                                      "&.Mui-checked": {
                                        color: "#071952",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  model.charAt(0).toUpperCase() + model.slice(1)
                                }
                              />
                            </Box>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Collapse>
                  <ListItem
                    disablePadding
                    onClick={() => handleCollapse3}
                    sx={{ marginBottom: "8px" }}
                  >
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD",
                        },
                        backgroundColor:
                          selectedItem === "indexes"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleCollapse3();
                        setSelectedItem("indexes");
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <WidgetsOutlinedIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Indexes" />
                      {isCollapse3 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isCollapse3} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="index"
                          name="index"
                          value={selectedIndex}
                          onChange={handleChangeIndex}
                        >
                          {indexes &&
                            indexes.map((index) => (
                              <Box
                                key={index}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "#CDF5FD",
                                  },
                                  backgroundColor:
                                    selectedIndex === index
                                      ? "#CDF5FD"
                                      : "transparent",
                                  marginBottom: "8px",
                                }}
                              >
                                <FormControlLabel
                                  value={index}
                                  control={
                                    <Radio
                                      size="small"
                                      sx={{
                                        color: "#071952",
                                        "&.Mui-checked": {
                                          color: "#071952",
                                        },
                                      }}
                                    />
                                  }
                                  label={
                                    index.charAt(0).toUpperCase() +
                                    index.slice(1)
                                  }
                                />
                              </Box>
                            ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Collapse>

                  {/* <ListItem
                    disablePadding
                    onClick={handleCollapse4}
                    sx={{ marginBottom: "8px" }}
                  >
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD",
                        },
                        backgroundColor:
                          selectedItem === "basicConfig"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleCollapse4();
                        setSelectedItem("basicConfig");
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <WidgetsOutlinedIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Basic Configuration" />
                      {isCollapse4 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isCollapse4} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, padding: "8px" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "15px",
                          }}
                        >
                          <div style={{ width: "48%" }}>
                            <Typography variant="body2" gutterBottom>
                              Top_K
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              value={topk}
                              onChange={(e) => {
                                setTopk(Number(e.target.value));
                                handle_basic_config();
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </div>
                          <div style={{ width: "48%" }}>
                            <Typography variant="body2" gutterBottom>
                              Max Tokens
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              value={maxTokens}
                              onChange={(e) => {
                                setMaxTokens(Number(e.target.value));
                                handle_basic_config();
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Typography gutterBottom>Temperature</Typography>
                        <Slider
                          style={{ color: "#CDF5FD" }}
                          value={temperature}
                          onChange={(e) => {
                            setTemperature(parseFloat(e.target.value));
                            handle_basic_config();
                          }}
                          aria-labelledby="temperature-slider"
                          step={0.1}
                          marks
                          min={0.1}
                          max={1}
                          valueLabelDisplay="auto"
                        />
                      </div>
                    </Box>
                  </Collapse> */}

                  <ListItem
                    disablePadding
                    onClick={() => handleCollapse5}
                    sx={{ marginBottom: "8px" }}
                  >
                    <ListItemButton
                      sx={{
                        "&:hover": {
                          backgroundColor: "#CDF5FD",
                        },
                        backgroundColor:
                          selectedItem === "history"
                            ? "#CDF5FD"
                            : "transparent",
                      }}
                      onClick={() => {
                        handleCollapse5();
                        setSelectedItem("history");
                      }}
                    >
                      <ListItemIcon
                        style={{ minWidth: "20px", marginRight: "8px" }}
                      >
                        <WidgetsOutlinedIcon
                          sx={{ fontSize: 20, color: "#00A9FF" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="History" />
                      {isCollapse5 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={isCollapse5} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          aria-label="index"
                          name="index"
                          value={selectedIndex}
                          onChange={get_file}
                        >
                          {files &&
                            files.map((file) => (
                              <Box
                                key={file}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "#CDF5FD",
                                  },
                                  backgroundColor:
                                    selectedIndex === file
                                      ? "#CDF5FD"
                                      : "transparent",
                                  marginBottom: "8px",
                                }}
                              >
                                <FormControlLabel
                                  value={file}
                                  control={
                                    <Radio
                                      size="small"
                                      sx={{
                                        color: "#071952",
                                        "&.Mui-checked": {
                                          color: "#071952",
                                        },
                                      }}
                                    />
                                  }
                                  label={
                                    file.charAt(0).toUpperCase() + file.slice(1)
                                  }
                                />
                              </Box>
                            ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Collapse>
                </List>

                <List></List>
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
            <img alt="" src={infobellImg} style={{ height: "3rem" }} />
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <Button
                    sx={{
                      backgroundColor: "gray",
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
            </PopupState>
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
          {/* isOpen checks if the randodom queries component is open or not. If it is open, it renders the RandomQueries component. If it is not open, it renders the search bar and the result table. */}
          {isOpen ? (
            <div
              style={{
                width: "40%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <RandomQueries onQuerySelect={(query) => setSearchValue(query)} />
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
                    <h4>Which response do you prefer?</h4>
                    <p style={{ color: "lightgray" }}>
                      Your choice will make ConvoGene better{" "}
                    </p>
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
                      {/* if is a query  */}

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
                      {/* if it is a response */}
                      {message?.sender === "bot" && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              textAlign: "left",
                              justifyContent: "flex-start",
                              // width: "auto",
                              flexDirection: "row",
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
                                      message.display !== 0 ? "100%" : widthM,
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <img
                                      alt=""
                                      src={openaiimg}
                                      style={{ width: "50px", height: "17px" }}
                                    />
                                    <p style={{ fontSize: "12px" }}>-GPT4</p>{" "}
                                  </span>
                                  <Markdown>{message.answer}</Markdown>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {isSpeaking ? (
                                      <VolumeOffIcon
                                        onClick={() => {
                                          setIsSpeaking(false);
                                          volumeup(message.answer1);
                                        }}
                                      />
                                    ) : (
                                      <VolumeUpIcon
                                        onClick={() => {
                                          volumeup(message.answer1);
                                          setIsSpeaking(true);
                                        }}
                                        className={styles.sendIcon}
                                        style={{
                                          width: "18px",
                                          height: "18px",
                                        }}
                                      />
                                    )}
                                    <p
                                      className={styles.sendIcon}
                                      onClick={() => {
                                        setMail(true);
                                        get_file_mail(
                                          "data_" + date_for_file + ".csv"
                                        );
                                      }}
                                      style={{
                                        marginLeft: "5px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Report
                                    </p>
                                  </div>
                                </div>
                              )}
                            {message?.answer1 &&
                              [0, 2].indexOf(message?.display) > -1 && (
                                <div>
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
                                        message.display !== 0 ? "100%" : widthM,
                                    }}
                                  >
                                    <img
                                      alt=""
                                      src={openaiimg}
                                      style={{
                                        width: "50px",
                                        height: "12px",
                                        marginBottom: "12px",
                                      }}
                                    />

                                    <Markdown>{message.answer1}</Markdown>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {isSpeaking ? (
                                      <VolumeOffIcon
                                        onClick={() => {
                                          setIsSpeaking(false);
                                          volumeup(message.answer1);
                                        }}
                                      />
                                    ) : (
                                      <VolumeUpIcon
                                        onClick={() => {
                                          volumeup(message.answer1);
                                          setIsSpeaking(true);
                                        }}
                                        className={styles.sendIcon}
                                        style={{
                                          width: "18px",
                                          height: "18px",
                                        }}
                                      />
                                    )}
                                    <p
                                      className={styles.sendIcon}
                                      onClick={() => {
                                        setMail(true);
                                        get_file_mail(
                                          "data_" + date_for_file + ".csv"
                                        );
                                      }}
                                      style={{
                                        marginLeft: "5px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Report
                                    </p>
                                  </div>
                                </div>
                              )}
                            {message?.answer2 &&
                              [0, 3].indexOf(message?.display) > -1 && (
                                <div
                                  onClick={() => {
                                    setMessages((prev) => {
                                      let values = [...prev];
                                      values[index]["display"] = 3;
                                      return values;
                                    });
                                  }}
                                  className={styles.robotmessageContainer}
                                  style={{
                                    width:
                                      message.display !== 0 ? "100%" : widthM,
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <img
                                      alt=""
                                      src={openaiimg}
                                      style={{ width: "50px", height: "17px" }}
                                    />
                                    <p style={{ fontSize: "12px" }}>-GPT3.5</p>{" "}
                                  </span>
                                  <p>{message.answer2}</p>
                                </div>
                              )}
                          </div>

                          <div
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
                              {message?.display !== 0 &&
                              selectedModel === "compare"
                                ? "Compare"
                                : ""}
                            </p>
                            <p
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{ fontSize: "12px", color: "gray" }}
                                onClick={() => {
                                  setMessages((prev) => {
                                    let values = [...prev];
                                    let newDisplayValue =
                                      message?.display !== 1
                                        ? message?.display - 1
                                        : 1;
                                    values[index]["display"] = newDisplayValue;
                                    return values;
                                  });
                                }}
                              >
                                {message?.display !== 0 &&
                                selectedModel === "compare"
                                  ? "<"
                                  : " "}
                              </p>

                              <p
                                style={{ fontSize: "12px", color: "gray" }}
                                onClick={() => {
                                  setMessages((prev) => {
                                    let values = [...prev];
                                    let newDisplayValue =
                                      message?.display !== 3
                                        ? message?.display + 1
                                        : 3;
                                    values[index]["display"] = newDisplayValue;
                                    return values;
                                  });
                                }}
                              >
                                {message?.display !== 0 &&
                                selectedModel === "compare"
                                  ? ">"
                                  : " "}
                              </p>
                            </p>
                          </div>
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
                          // width: "auto",
                          flexDirection: "row",
                        }}
                      >
                        {answers && (
                          <div className={styles.robotmessageContainer}>
                            <span
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <img
                                alt=""
                                src={openaiimg}
                                style={{ width: "50px", height: "17px" }}
                              />
                              <p style={{ fontSize: "12px" }}>-GPT4</p>{" "}
                            </span>
                            <Markdown>{answers}</Markdown>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              {isSpeaking ? (
                                <VolumeOffIcon
                                  onClick={() => {
                                    setIsSpeaking(false);
                                    volumeup(message.answer1);
                                  }}
                                />
                              ) : (
                                <VolumeUpIcon
                                  onClick={() => {
                                    volumeup(message.answer1);
                                    setIsSpeaking(true);
                                  }}
                                  className={styles.sendIcon}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                  }}
                                />
                              )}
                              <p
                                className={styles.sendIcon}
                                onClick={() => {
                                  setMail(true);
                                  get_file_mail(
                                    "data_" + date_for_file + ".csv"
                                  );
                                }}
                                style={{
                                  marginLeft: "5px",
                                  fontSize: "12px",
                                }}
                              >
                                Report
                              </p>
                            </div>
                          </div>
                        )}
                        {cohere && (
                          <div
                            className={styles.robotmessageContainer}
                            style={{ width: "100%" }}
                          >
                            <img
                              alt=""
                              src={cohereimg}
                              style={{
                                width: "50px",
                                height: "12px",
                                marginBottom: "12px",
                              }}
                            />

                            <Markdown>{cohere}</Markdown>
                          </div>
                        )}

                        {gemini && (
                          <div className={styles.robotmessageContainer}>
                            <span
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <img
                                alt=""
                                src={openaiimg}
                                style={{ width: "50px", height: "17px" }}
                              />
                              <p style={{ fontSize: "12px" }}>-GPT4</p>{" "}
                            </span>
                            <p>{gemini}</p>
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
              <KeyboardVoiceIcon className={styles.micIcon} />
            </Button>
            <input
              ref={queryRef}
              className={styles.searchInput}
              placeholder="Enter the prompt"
              value={searchValue}
              onChange={handleInputChange}
            />
            <Button style={{ color: "black" }} onClick={() => getAnswer()}>
              <SendIcon className={styles.sendIcon} />
            </Button>
          </div>
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
        <Modal
          open={link}
          onClose={() => setLink(false)} // Uncomment and add handleClose function if needed
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "2px" }}>Webscraping</p>
            <p style={{ fontSize: "12px", color: "gray", marginBottom: "8px" }}>
              Provide the link below
            </p>
            <TextField
              sx={{ width: "90%", marginBottom: "15px" }}
              id="outlined-basic"
              variant="outlined"
              label="Link"
              size="small"
              inputRef={linkref}
            />
            <TextField
              sx={{ width: "90%", marginBottom: "15px" }}
              id="outlined-basic"
              variant="outlined"
              label="Max Depth"
              size="small"
              inputRef={depthRef}
            ></TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={useChromaDB}
                  onChange={(e) => setUseChromaDB(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#1976d2", // Blue color when checked (Pinecone DB)
                      "&:hover": {
                        backgroundColor: "#1976d230",
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#1976d2", // Blue track color when checked
                    },
                    "& .MuiSwitch-switchBase": {
                      color: "#808080", // Gray color when unchecked (Chroma DB)
                      "&:hover": {
                        backgroundColor: "#80808030",
                      },
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#808080", // Gray track color when unchecked
                    },
                  }}
                />
              }
              label={
                useChromaDB ? "Store in Pinecone DB" : "Store in Chroma DB"
              }
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#3B82F6",
                  border: "2px solid",
                  // borderRadius: '20px',
                  width: "100px",
                  height: "40px",
                  padding: "10px",
                }}
                onClick={() => linksend()}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={index}
          onClose={() => setIndex(false)} // Uncomment and add handleClose function if needed
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "2px" }}>
              Create Index
            </p>
            <p style={{ fontSize: "12px", color: "gray", marginBottom: "8px" }}>
              Provide the details
            </p>
            <Typography variant="body2" style={{ marginBottom: "4px" }}>
              Index Name
            </Typography>
            <TextField
              sx={{ width: "90%", marginBottom: "15px" }}
              id="outlined-basic"
              variant="outlined"
              label="Index Name"
              size="small"
              inputRef={indexref}
            />
            <Typography variant="body2" style={{ marginBottom: "4px" }}>
              Embedding Endpoint
            </Typography>
            <TextField
              sx={{ width: "90%", marginBottom: "15px" }}
              id="outlined-basic"
              variant="outlined"
              label="Embedding Endpoint"
              size="small"
              inputRef={embeddingRef}
            ></TextField>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
                marginBottom: "15px",
              }}
            >
              <div style={{ width: "48%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    style={{ marginBottom: "4px", marginRight: "4px" }}
                  >
                    Dimensions
                  </Typography>
                  <Tooltip title="The length of the vector. Larger dimensions require more storage.">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
                <TextField
                  fullWidth
                  id="outlined-basic-dimensions"
                  variant="outlined"
                  size="small"
                  inputRef={dimensionsRef}
                />
              </div>
              <div style={{ width: "48%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    style={{ marginBottom: "4px", marginRight: "4px" }}
                  >
                    Metrics
                  </Typography>
                  <Tooltip
                    style={{ backgroundColor: "white" }}
                    title="How to measure the distance between the query and the stored vectors. Mostly it is cosine."
                  >
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
                <TextField
                  fullWidth
                  id="outlined-basic-metric"
                  variant="outlined"
                  size="small"
                  inputRef={metricRef}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#3B82F6",
                  border: "2px solid",
                  // borderRadius: '20px',
                  width: "100px",
                  height: "40px",
                  padding: "10px",
                }}
                onClick={() => create_index()}
              >
                Create
              </Button>
            </div>
          </div>
        </Modal>

        <DocumentModal
          open={document}
          onClose={() => setDocument(false)}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          filenameList={filenameList}
          deleteDoc={deleteDoc}
        />

        <Modal
          open={isCustom}
          onClose={() => setIsCustom(false)} // Uncomment and add handleClose function if needed
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "400px",
              margin: "auto",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "2px" }}>
              Custom LLM Details
            </p>
            <p style={{ fontSize: "12px", color: "gray", marginBottom: "8px" }}>
              Provide the api for custom model call
            </p>
            <TextField
              sx={{ width: "100%", marginBottom: "15px" }}
              id="outlined-basic"
              variant="outlined"
              label="Custom LLM Endpoint"
              size="small"
              inputRef={llm_endpoint_ref}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#3B82F6",
                  border: "2px solid",
                  // borderRadius: '20px',
                  width: "100px",
                  height: "40px",
                  padding: "10px",
                }}
                onClick={() => setllm()}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
        <EmailComposer
          open={mail}
          onClose={() => setMail(false)}
          initialAttachment={attachment}
        />
      </div>
    </>
  );
};

export default Home;
