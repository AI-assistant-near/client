"use client";

import React from "react";
import { motion } from "framer-motion";
import { TokenIcon } from "@web3icons/react";
import { ArrowLeftRight } from "lucide-react";

export enum Token {
  ETH = "eth",
  BTC = "btc",
  SOL = "sol",
  NEAR = "near",
  ZCASH = "zcash",
}

interface SwapPopupProps {
  tokenA: Token;
  tokenB: Token;
}

export default function SwapPopup({ tokenA, tokenB }: SwapPopupProps) {
  // Default to ETH if tokens are undefined
  const symbolA = tokenA ? tokenA.toString().toUpperCase() : Token.ETH.toString().toUpperCase();
  const symbolB = tokenB ? tokenB.toString().toUpperCase() : Token.BTC.toString().toUpperCase();
  
  return (
    <motion.div
      // Initial state: invisible, smaller, and slightly lower on the screen
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      // Animate to: fully visible, normal size, and positioned in place
      animate={{ opacity: 1, scale: 1, y: 0 }}
      // Transition options: adjust duration and easing for a slower pop-up effect
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg"
    >
      {/* Left token icon */}
      <TokenIcon 
        symbol={symbolA} 
        variant="mono" 
        size="64" 
        color="#FFFFFF" 
      />
      {/* Arrow icon in between */}
      <ArrowLeftRight size={24} className="mx-4" />
      {/* Right token icon */}
      <TokenIcon 
        symbol={symbolB} 
        variant="mono" 
        size="64" 
        color="#FFFFFF" 
      />
    </motion.div>
  );
}