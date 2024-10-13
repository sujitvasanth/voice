import { CloudProvider } from "@/cloud/useCloud";
import "@livekit/components-styles/components/participant";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import VoiceDropdown from "../components/VoiceDropdown"; // Import the dropdown

function handleVoiceChange(voiceId: string) {
  // Implement your logic here (publish data to LiveKit or console log for testing)
  console.log("Selected voice:", voiceId);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CloudProvider>
      <VoiceDropdown onVoiceChange={handleVoiceChange} />
      <Component {...pageProps} />
    </CloudProvider>
  );
}
