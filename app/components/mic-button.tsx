"use client"

interface MicButtonProps {
  isRecording: boolean
  onClick: () => void
}

export default function MicButton({ isRecording, onClick }: MicButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-12 h-12 rounded-full
        transition-all duration-300
        ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"}
      `}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        {isRecording ? (
          <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
        ) : (
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        )}
        {!isRecording && (
          <>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </>
        )}
      </svg>
    </button>
  )
}

