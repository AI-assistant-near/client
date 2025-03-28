"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

/** Define the shape of our audio context */
interface GlobalAudioContextValue {
  /** The user’s MediaStream once activated (null if not yet activated). */
  stream: MediaStream | null;

  /** True if we already have a valid MediaStream. */
  isActivated: boolean;

  /** A global AudioContext for the entire app (null if not yet activated). */
  audioContext: AudioContext | null;

  /** A global AnalyserNode if you want to visualize/analyze audio. */
  analyser: AnalyserNode | null;

  /** A MediaStreamAudioSourceNode that’s connected to the analyser. */
  source: MediaStreamAudioSourceNode | null;

  /** Call this to request mic permission and initialize everything. */
  activateMicrophone: () => Promise<void>;
}

/** Provide default stubs so we never get undefined out of the context. */
const GlobalAudioContext = createContext<GlobalAudioContextValue>({
  stream: null,
  isActivated: false,
  audioContext: null,
  analyser: null,
  source: null,
  activateMicrophone: async () => {
    throw new Error("AudioProvider not mounted!");
  },
});

/** Hook for consumers to use. */
export function useGlobalAudio() {
  return useContext(GlobalAudioContext);
}

/**
 * The provider that wraps your app or a large portion of it,
 * so all children can share the same microphone stream, audio context, etc.
 */
export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  // We’ll store AudioContext, AnalyserNode, and MediaStreamAudioSourceNode in refs,
  // so they persist without re-renders.
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  /** This is a simple flag to indicate if we've successfully gotten a stream. */
  const isActivated = !!stream;

  /**
   * Main function to request permission from the user, create our audio context,
   * create the analyser, and connect them all together exactly once.
   */
  const activateMicrophone = useCallback(async () => {
    // If we already have a stream, don’t do anything again.
    if (stream) return;

    try {
      // 1) Request audio permission and store the resulting MediaStream
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(newStream);
      console.log("Microphone activated, got stream:", newStream);

      // 2) Create an AudioContext if we haven’t yet
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Safari may start an AudioContext in a 'suspended' state until user interaction
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        audioContextRef.current = audioContext;
        console.log("audioContext created:", audioContext);

        // 3) Create an analyser node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // example setting
        analyserRef.current = analyser;
        console.log("analyser created:", analyser);

        // 4) Create a MediaStreamAudioSourceNode and connect to the analyser
        const source = audioContext.createMediaStreamSource(newStream);
        sourceRef.current = source;
        source.connect(analyser);
        console.log("source node created and connected:", source);
      }

    } catch (err) {
      console.error("Mic permission was denied or an error occurred:", err);
    }
  }, [stream]);

  // Provide these values to the rest of the app
  const value: GlobalAudioContextValue = {
    stream,
    isActivated,
    audioContext: audioContextRef.current,
    analyser: analyserRef.current,
    source: sourceRef.current,
    activateMicrophone,
  };

  return (
    <GlobalAudioContext.Provider value={value}>
      {children}
    </GlobalAudioContext.Provider>
  );
}
