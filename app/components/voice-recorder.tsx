"use client";

import { useState, useRef, useEffect } from "react";
import MicButton from "./mic-button";
import CloseButton from "./close-button";
import { AnimatePresence, motion } from "framer-motion";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [scale, setScale] = useState(1);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  // Declare the data array ref at the top so it's available everywhere in the component
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      console.log("Stream tracks:", stream.getTracks());
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
          console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        });
      });

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume();
      }
      console.log("audio context", audioContext);

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      console.log("analyser", analyser);

      // Initialize the data array once, and store it in the ref
      if (analyserRef.current && !dataArrayRef.current) {
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        console.log("Initialized dataArray:", dataArrayRef.current);
      }

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      console.log("source", source);

      // Start recording and audio analysis
      setIsRecording(true);
      analyzeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    // Stop the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    // Reset state
    setIsRecording(false);
  };

  // Analyze audio to get volume level using the cached dataArrayRef
  const analyzeAudio = () => {
    if (!analyserRef.current 
      // || !dataArrayRef.current
    ) return;

    const updateLevel = () => {
      if (!isRecording || !analyserRef.current 
        || !dataArrayRef.current
      ){console.log("entered the exit"); return;};

      // Reuse the data array from the ref
      const dataArray = dataArrayRef.current;
      analyserRef.current.getByteFrequencyData(dataArray);
      console.log("Data array:", dataArray);
      
      // Calculate average volume
      let sum = 0;s
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      // Normalize to 0-1 range
      const normalizedLevel = Math.min(average / 128, 1);
      setScale(1 + normalizedLevel * 0.5);

      console.log("Computed average:", average, "Normalized audio level:", normalizedLevel);

      // Continue analyzing on next frame
      requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

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
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Controls */}
      <div className="absolute bottom-10 w-full flex flex-col items-center">
        {/* Recording controls */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              key="voiceIcon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                backgroundColor: "#6200EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <span style={{ color: "white", fontSize: "2rem" }}>🎤</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center justify-center gap-16 mb-6">
          {isRecording && <CloseButton onClick={stopRecording} />}
          <MicButton isRecording={isRecording} onClick={isRecording ? stopRecording : startRecording} />
        </div>
      </div>
    </div>
  );
}
