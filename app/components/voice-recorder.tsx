"use client";

import { useState, useRef, useEffect } from "react";
import MicButton from "./mic-button";
import CloseButton from "./close-button";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeStep from "../welcome-step/page";
import Onboarding from "../onboarding/page";
import AgentAction from "../agent-action/page";
export default function VoiceRecorder() {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const goToNextStep = () => {
    setStep((prev) => (prev + 1) as 0 | 1 | 2);
  };

  const goToStep = (newStep: 0 | 1 | 2) => {
    setStep(newStep);
  };

  const goToPreviousStep = () => {
    setStep((prev) => (prev - 1) as  1 | 2);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scale, setScale] = useState(1);

  // Audio graph references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // MediaRecorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Initialize the audio graph on user activation
  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      console.log("Stream tracks:", stream.getTracks());

      // Create AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      console.log("audio context", audioContext);

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      console.log("analyser", analyser);

      // Initialize data array
      if (analyserRef.current) {
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        console.log("Initialized dataArray:", dataArrayRef.current);
      }

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      console.log("source", source);

      // Mark as initialized so we don't reinitialize on every record
      setIsInitialized(true);
    } catch (error) {
      console.error("Error during audio initialization:", error);
    }
  };

  // Start recording: assumes initialization has already occurred.
  const startRecording = () => {
    if (!mediaStreamRef.current) {
      console.error("Media stream not initialized. Please activate your microphone first.");
      return;
    }

    // Set up MediaRecorder
    if (typeof MediaRecorder !== "undefined") {
      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        console.log("Recording finished, blob size:", blob.size);
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");
        console.log(formData)
        try {
          const response = await fetch("/api/agent", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log("Audio uploaded successfully.");
        } catch (err) {
          console.error("Error uploading audio:", err);
        }
        recordedChunksRef.current = [];
      };

      recorder.start();
      console.log("MediaRecorder started", recorder.state);
      setIsRecording(true);
      analyzeAudio();
    } else {
      console.error("MediaRecorder is not supported in this browser.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder stopped");
    }
    setIsRecording(false);
  };

  // Analyze audio to get volume level using the cached dataArrayRef
  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const updateLevel = () => {
      if (!isRecording || !analyserRef.current || !dataArrayRef.current) {
        console.log("Exiting audio analysis loop.");
        return;
      }
      const dataArray = dataArrayRef.current;
      analyserRef.current.getByteFrequencyData(dataArray);
      console.log("Data array:", dataArray);

      requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  // Use requestAnimationFrame to update the scale value based on audio volume
  useEffect(() => {
    let animationFrameId: number;
  
    const updateAudioLevel = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / dataArrayRef.current.length;
        const normalizedLevel = Math.min(average / 128, 1);
        setScale(1 + normalizedLevel * 0.7);
      }
      animationFrameId = requestAnimationFrame(updateAudioLevel);
    };
  
    if (isRecording) {
      animationFrameId = requestAnimationFrame(updateAudioLevel);
    }
  
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRecording]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      console.log("Updated scale:", scale);
    }
  }, [scale]);

  return (
    <div className= "max-w-[30rem] w-full flex flex-col items-center justify-center bg-black text-white"
    >
      <div 
      style={{ padding: "2rem" }}
      >
        {step === 0 && <WelcomeStep onNext={goToNextStep} /* ...other props */ />}
        {step === 1 && <Onboarding onNext={goToNextStep} /* ...other props */ />}
        {step === 2 && <AgentAction /* no onNext if final? */ />}
    
        {/* Show the 'Go Back' button if step > 0 */}
        {step > 0 && (
          <button className="rounded-full" onClick={goToPreviousStep}>
            Back
          </button>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="flex flex-col items-center justify-center w-full h-full">
  //     <div className="absolute bottom-10 w-full flex flex-col items-center">
  //     <AnimatePresence>
  //         {isRecording && (
  //           <motion.div
  //             key="voiceIcon"
  //             initial={{ opacity: 0, scale: 0.8 }}
  //             animate={{ opacity: 1, scale }}
  //             exit={{ opacity: 0, scale: 0.8 }}
  //             transition={{
  //               type: "spring",
  //               stiffness: 100,
  //               damping: 15,
  //               duration: 1.5,
  //             }}
  //             style={{
  //               width: 100,
  //               height: 100,
  //               borderRadius: "50%",
  //               backgroundColor: "#6200EE",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               margin: "20px 0",
  //             }}
  //           >
  //             <span style={{ color: "white", fontSize: "2rem" }}>🎤</span>
  //           </motion.div>
  //         )}
  //       </AnimatePresence>
  //       {/* If not initialized, prompt user to activate microphone */}
  //       {!isInitialized ? (
  //         <button
  //           className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
  //           onClick={initializeAudio}
  //         >
  //           Activate Microphone
  //         </button>
  //       ) : (
  //         <div className="flex items-center justify-center gap-16 mb-6">
  //           {isRecording && <CloseButton onClick={stopRecording} />}
  //           <MicButton
  //             isRecording={isRecording}
  //             onClick={() => {
  //               isRecording ? stopRecording() : startRecording();
  //             }}
  //           />
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
