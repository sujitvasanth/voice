import { CloudProvider } from "@/cloud/useCloud";
import "@livekit/components-styles/components/participant";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import VoiceDropdown from "../components/VoiceDropdown";

export default function App({ Component, pageProps }: AppProps) {
  const { voices } = pageProps;

  function handleVoiceChange(voiceId: string) {
    console.log("Selected voice:", voiceId);
  }

  return (
    <CloudProvider>
      <VoiceDropdown voices={voices} onVoiceChange={handleVoiceChange} />
      <Component {...pageProps} />
    </CloudProvider>
  );
}

// Add getStaticProps to load voices at build time
export async function getStaticProps() {
  const fs = require("fs");
  const path = require("path");

  const filePath = path.join(process.cwd(), "listofallvoices.txt");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const voices = fileContent.split("\n").map((line: string) => {
    const [name, id] = line.split(",");
    return { name: name.trim(), id: id.trim() };
  });

  return {
    props: {
      voices,
    },
  };
}
