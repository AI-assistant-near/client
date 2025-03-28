
export default function Onboarding({ onNext }: { onNext: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center w-full bg-[#1e1e24] text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Voice Recorder App</h1>
        <p className="text-lg mb-8">Click the button below to start recording your voice.</p>
        <div className="w-full max-w-3xl rounded-lg border border-gray-800 overflow-x-hidden overflow-y-auto">
            {/* Add your onboarding content here */}
        </div>
        </div>
    );
}  
