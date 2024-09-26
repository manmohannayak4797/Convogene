import React, { useState, useEffect, useRef } from "react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

function TranscriptionApp() {
  const [transcript, setTranscript] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const recognizerRef = useRef(null);
  let previousWords = [];
  let currentSearchValue = "";

  useEffect(() => {
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(
      "f4a8f5be7801494fa47bc87d6d8ca31d", // Replace with your key
      "eastus"
    );
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();

    recognizerRef.current = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    // Handler to process recognized speech in real time (word-by-word)
    recognizerRef.current.recognizing = (s, e) => {
      if (e.result.reason === speechsdk.ResultReason.RecognizingSpeech) {
        const currentWords = e.result.text.split(" ");

        // Filter out already recognized words
        const newWords = currentWords.filter(
          (word) => !previousWords.includes(word)
        );

        if (newWords.length > 0) {
          // Apply corrections to special words
          const interimText = correctSpecialWords(newWords.join(" "));
          currentSearchValue = (currentSearchValue + " " + interimText).trim();

          console.log("New words:", interimText);
          console.log("Updated Search Value:", currentSearchValue);

          // Update the transcript with new words
          setSearchValue(currentSearchValue);
          setTranscript((prev) => (prev + " " + interimText).trim());

          // Update previousWords with the latest recognized words
          previousWords = currentWords;
        }
      }
    };

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, []);

  const correctSpecialWords = (text) => {
    let correctedText = text;

    correctedText = correctedText.replace(/\bAMD Epic\b/gi, "AMD EPYC");
    correctedText = correctedText.replace(/\bAMD risen\b/gi, "AMD RYZEN");
    correctedText = correctedText.replace(/\bprocesses\b/gi, "processors");
    correctedText = correctedText.replace(/\bepic\b/gi, "EPYC");
    correctedText = correctedText.replace(/\brisen\b/gi, "RYZEN");
    correctedText = correctedText.replace(/\bhorizon\b/gi, "RYZEN");
    correctedText = correctedText.replace(/\brise and\b/gi, "RYZEN");
    correctedText = correctedText.replace(/\bamd\b/gi, "AMD");

    return correctedText;
  };

  const startRecognition = () => {
    recognizerRef.current.startContinuousRecognitionAsync();
  };

  const stopRecognition = () => {
    recognizerRef.current.stopContinuousRecognitionAsync();
  };

  return (
    <div>
      <h1>Live Transcription</h1>
      <button onClick={startRecognition}>Start</button>
      <button onClick={stopRecognition}>Stop</button>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={5}
        cols={50}
      />
    </div>
  );
}

export default TranscriptionApp;
