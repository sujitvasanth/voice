import { CloudProvider } from "@/cloud/useCloud";
import "@livekit/components-styles/components/participant";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import VoiceDropdown from "../components/VoiceDropdown"; // Import the dropdown
import { useEffect, useState } from "react";

function App({ Component, pageProps }: AppProps) {
  const voices = pageProps?.voices || []; // Get voices from pageProps or set as an empty array

  function handleVoiceChange(voiceId: string) {
    console.log("Selected voice:", voiceId); // Handle voice change, log the selected voice
  }

  return (
    <CloudProvider>
      <VoiceDropdown voices={voices} onVoiceChange={handleVoiceChange} /> 
      {/* Render the dropdown and pass voices */}
      <Component {...pageProps} />
    </CloudProvider>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const path = require("path");

  // Adjust the path to point to the parent directory
  const filePath = path.join(process.cwd(), "../listofallvoices.txt");
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

export default App;
