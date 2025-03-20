import Image from "next/image";
import VoiceRecorder from "./components/voice-recorder";
export default function Home() {
  return (
  <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
  <div className="w-full max-w-3xl rounded-lg border border-gray-800 overflow-hidden">
    <div
      className="h-[500px] relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/placeholder.svg?height=500&width=800')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <VoiceRecorder />
    </div>
  </div>
</main>
  );
}
