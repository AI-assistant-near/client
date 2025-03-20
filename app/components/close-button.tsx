"use client"

interface CloseButtonProps {
  onClick: () => void
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300"
      aria-label="Cancel recording"
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
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

