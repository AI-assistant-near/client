"use client";
import VoiceRecorder from "./components/voice-recorder";
import Hero from "./components/hero";
import SwapPopup from "./components/swap-popup";
import { Token } from "./components/swap-popup";

import { TokenIcon } from "@web3icons/react";
import { ArrowLeftRight } from "lucide-react";

export default function Home() {  

  return (
  <main>
  <div 
  // className="w-full max-w-3xl rounded-lg border border-gray-800 overflow-hidden"
  >
    {/* <div
      className="h-[500px] relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/placeholder.svg?height=500&width=800')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    > */}
    {/* <ArrowLeftRight size={24} className="mx-4" />
    <TokenIcon
      symbol={Token.ETH}
      variant="mono"
      size="64"
      color="#FFFFFF"
    /> */}
    <VoiceRecorder />''
    {/* </div> */}
  </div>

  {/* <SwapPopup tokenA={Token.ETH} tokenB={Token.BTC} /> */}

</main>
  );
}
