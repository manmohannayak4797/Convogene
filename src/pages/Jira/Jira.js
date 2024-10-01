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
  Hub as HubIcon,
  Send as SendIcon,
} from "@mui/icons-material";
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

//////////////////////////////

const Jira = () => {
  const navigate = useNavigate();
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
  const [newQuery, setNewQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const queries = [
    "How do you create a new issue in JIRA",
    "How do you manage user access and permissions in ServiceNow",
    "Tell me about Employee's status on particular issue ",
    // "Which all projects are assigned to EmployeeName",
  ];

  const getRandomQueries = (arr, n) => {
    let shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  useEffect(() => {
    setRandomQueries(getRandomQueries(queries, 3));
  }, []);

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

  const handleDrawerClose = () => {
    setOpen(false);
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
    setSearchValue(event.target.value);
  };

  // const getAnswer = async () => {
  //   const userMessage = { answer: searchValue, sender: "user" };
  //   const botMessage = { sender: "bot", display: 0 };
  //   const d = { display: 0 };
  //   setTimeout(() => {
  //     setMessages([...messages, userMessage, botMessage]);
  //     setCoheremsg([...coheremsg, userMessage, botMessage]);
  //   }, 300);
  //   if (searchValue) {
  //     setIsOpen(false);
  //     try {
  //       const [response1, response2] = await Promise.all([
  //         axios.post("http://127.0.0.1:5000/cohere", { text: searchValue }),
  //         axios.post("http://127.0.0.1:5000/research", { text: searchValue }),
  //       ]);
  //       //
  //       // console.log(response)
  //       console.log(response1);
  //       setFinalCohere(response1.data);
  //       setSearchValue("");
  //     } catch (error) {
  //       console.log("Error in llm");
  //     }
  //   }
  // };

  const getAnswer = async () => {
    const userMessage = { answer: searchValue, sender: "user" };
    const botMessage = { sender: "bot", display: 0 };
    setMessages([...messages, userMessage, botMessage]);
    setCoheremsg([...coheremsg, userMessage, botMessage]);

    if (searchValue) {
      setIsOpen(false);
      try {
        const response = await fetch("http://192.168.0.182:5000/research", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            query: searchValue,
          }),
        });
        // response = response.json();
        console.log("Response:", response);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let streamedAnswer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          streamedAnswer += chunk;

          setAnswers(streamedAnswer);
        }

        setFinalContent(streamedAnswer);
        setSearchValue("");
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
                <DrawerHeader style={{ minHeight: "50px" }}>
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
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/Home")}>
                      <ListItemIcon style={{ minWidth: "20px" }}>
                        <HubIcon />
                      </ListItemIcon>
                      <ListItemText primary="RAG" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/jira")}>
                      <ListItemIcon style={{ minWidth: "20px" }}>
                        <HubIcon />
                      </ListItemIcon>
                      <ListItemText primary="Copilot" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/Monitor")}>
                      <ListItemIcon style={{ minWidth: "20px" }}>
                        <LegendToggleIcon />
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
                  // marginTop: "20%",
                  width: "90%",
                  height: "80%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                                  {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.answer}
                                  </ReactMarkdown> */}
                                  <Markdown>{message.answer}</Markdown>
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
            <input
              className={styles.searchInput}
              placeholder="Enter the prompt"
              value={searchValue}
              onChange={handleInputChange}
            />
            <div style={{ marginRight: 10 }}>
              <Button style={{ color: "black" }} onClick={() => getAnswer()}>
                {/* <IconsHolder
                  style={{ opacity: 0.3, backgroundColor:"black", color:"black" }}
                  className={styles.iconLarge}
                  type="SendIcon"
                /> */}
                <SendIcon className={styles.sendIcon} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jira;
