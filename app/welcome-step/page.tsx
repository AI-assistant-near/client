"use client";
import React from "react";
import { useGlobalAudio } from "../providers/AudioProvider";
import { Mic } from "lucide-react"

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { isActivated, activateMicrophone } = useGlobalAudio();

  async function handleActivateClick() {
    await activateMicrophone(); 
    // Once user grants permission, you have a global stream + audio context
    if (isActivated) {
      onNext();
    } else {
      // Might do a small delay or check again after the promise
      onNext();
    }
  }

  return (
    <>
      <div className="relative z-10 flex flex-col items-center justify-center w-full mx-auto p-8 rounded-2xl backdrop-blur-md bg-[rgba(30,30,36,0.4)] border border-[rgba(155,92,255,0.3)] shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#e0c3fc] to-[#b892ff] bg-clip-text text-transparent">
            Welcome to our liveness voice proof agent!
          </h1>
          <p className="text-[#c4b5fd] text-sm">Please activate your microphone to continue</p>
        </div>

        <button
          onClick={handleActivateClick}
          className={`
            flex items-center justify-center gap-2
            px-6 py-3 rounded-full
            font-medium text-lg
            transition-all duration-300 ease-in-out
            ${
              isActivated
                ? "bg-[#9b4dca] text-white shadow-lg shadow-[#9b4dca]/30"
                : "bg-gradient-to-r from-[#b892ff] to-[#9b4dca] text-white shadow-lg shadow-[#9b4dca]/30 hover:shadow-xl hover:shadow-[#9b4dca]/40 hover:-translate-y-1"
            }
          `}
        >
          <Mic className={`w-5 h-5 ${isActivated ? "animate-pulse" : ""}`} />
          {isActivated ? "Microphone Activated!" : "Activate Microphone"}
        </button>

        {isActivated && <div className="mt-4 text-[#c4b5fd] text-sm animate-pulse">Processing...</div>}
      </div>
    </>
  );
}