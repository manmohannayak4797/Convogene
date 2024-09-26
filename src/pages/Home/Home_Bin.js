// getAnswer();

// const getAnswer = async () => {
//   const query = searchValue;
//   setSearchValue("");
//   console.log(" After enter key checking", searchValue);
//   console.log(query);
//   console.log("logger");
//   const userMessage = { answer: query, sender: "user" };
//   const botMessage = { sender: "bot", display: 0 };

//   setTimeout(() => {
//     setMessages([...messages, userMessage, botMessage]);
//     // setCoheremsg([...coheremsg, userMessage, botMessage]);
//   }, 300);
//   if (query && selectedModel === "compare") {
//     console.log("insider getAnswer");
//     setIsOpen(false);
//     //   try {
//     //     const [response1, response2] = await Promise.all([
//     //       axios.post("http://127.0.0.1:5000/cohere", { text: searchValue }),
//     //       axios.post("http://127.0.0.1:5000/openai4", { text: searchValue }),
//     //       axios.post("http://127.0.0.1:5000/openai35", { text: searchValue }),
//     //     ]);
//     //     console.log(response1, response2);

//     //     setSearchValue("");
//     //   } catch (error) {
//     //     console.log("Error in llm");
//     //   }
//     // } else if (query && selectedModel === "custom") {
//     //   const response = await axios.post(llm_endpoint, { text: searchValue });
//     //   console.log("custom testing needs time");

//     // getAnswer(); updates messages state  , finalcohere state , and  response state
//     // so it will go to useEffect which is written for coresponding state

//   } else if (query) {
//     // create_new_file()
//     console.log("insider getAnswer");
//     setIsOpen(false);

//     try {
//       const response = await axios.post(
//         // "http://172.28.193.17:5000/rag_qa_api_stream",
//         // "http://127.0.0.1:5000/rag_qa_api_stream",
//         "http://192.168.0.182:8080/rag_qa_api_stream",
//         // "http://127.0.0.1:5000/communication",
//         {
//           text: query,
//         }
//       );
//       setResponses((prevResponses) => [
//         ...prevResponses,
//         { query: query, response },
//       ]);
//       setAnswerFlag2(true);
//       console.log(response.data); // Log the response data

//       setCohere(response?.data);
//       // responses = [...responses, { query: query, response }];
//       setResponses(responses);
//       console.log(response.data); // Log the response data
//       setSearchValue("");
//     } catch (error) {
//       console.error("Error in llm:", error);
//     }
//   }
// };



  // const getAnswer = async () => {
  //   const userMessage = { answer: searchValue, sender: "user" };
  //   const botMessage = { sender: "bot", display: 0 };
  //   setTimeout(() => {
  //     setMessages([...messages, userMessage, botMessage]);
  //     // setCoheremsg([...coheremsg, userMessage, botMessage]);
  //   }, 300);
  //   if (searchValue) {
  //     console.log("insider getAnswer");
  //     setIsOpen(false);
  //     try {
  //       const response = await axios.post(
  //         "http://192.168.0.182:8080/rag_qa_api_stream",
  //         { text: searchValue }
  //       );
  //       setResponses((prevResponses) => [
  //         ...prevResponses,
  //         { query: searchValue, response },
  //       ]);
  //       setAnswerFlag2(true);
  //       console.log(response.data); // Log the response data

  //       setCohere(response?.data);
  //       // responses = [...responses, { query: query, response }];
  //       setResponses(responses);
  //       console.log(response.data); // Log the response data
  //       setSearchValue("");
  //     } catch (error) {
  //       console.error("Error in llm:", error);
  //     }
  //   }
  // };



