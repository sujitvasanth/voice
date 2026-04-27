import { ChatMessageType, ChatTile } from "@/components/chat/ChatTile";
import {
  TrackReferenceOrPlaceholder,
  useChat,
  useDataChannel,
  useLocalParticipant,
  useTrackTranscription,
} from "@livekit/components-react";
import {
  LocalParticipant,
  Participant,
  Track,
  TranscriptionSegment,
} from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";

export function TranscriptionTile({
  agentAudioTrack,
  accentColor,
}: {
  agentAudioTrack: TrackReferenceOrPlaceholder;
  accentColor: string;
}) {
  const agentMessages = useTrackTranscription(agentAudioTrack);
  const localParticipant = useLocalParticipant();
  const localMessages = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });
  const [transcripts, setTranscripts] = useState<Map<string, ChatMessageType>>(
    new Map()
  );
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const { chatMessages, send: sendChat } = useChat();

  // ASR voice input messages arrive on this topic from the agent
  // published with the user's identity spoofed — we always render as "You"
  const asrTranscripts = useRef<Map<string, ChatMessageType>>(new Map());

  const onAsrData = useCallback((msg: { payload: Uint8Array; topic?: string }) => {
    try {
      const data = JSON.parse(new TextDecoder().decode(msg.payload));
      asrTranscripts.current.set(data.id, {
        name: "You",
        message: data.message,
        timestamp: data.timestamp,
        isSelf: true,
      });
    } catch {}
  }, []);

  useDataChannel("asr-user-input", onAsrData);

  useEffect(() => {
    agentMessages.segments.forEach((s) =>
      transcripts.set(
        s.id,
        segmentToChatMessage(s, transcripts.get(s.id), agentAudioTrack.participant)
      )
    );
    localMessages.segments.forEach((s) =>
      transcripts.set(
        s.id,
        segmentToChatMessage(s, transcripts.get(s.id), localParticipant.localParticipant)
      )
    );

    const allMessages = Array.from(transcripts.values());

    // merge ASR voice inputs
    asrTranscripts.current.forEach((msg) => allMessages.push(msg));

    for (const msg of chatMessages) {
      const isAgent =
        msg.from?.identity === agentAudioTrack.participant?.identity;
      const isSelf =
        msg.from?.identity === localParticipant.localParticipant.identity;
      // skip 🎤 messages — they are covered by asr-user-input channel
      if (msg.message.startsWith("🎤")) continue;
      let name = msg.from?.name;
      if (!name) {
        if (isAgent) name = "Agent";
        else if (isSelf) name = "You";
        else name = "Unknown";
      }
      allMessages.push({
        name,
        message: msg.message,
        timestamp: msg.timestamp,
        isSelf: isSelf,
      });
    }

    allMessages.sort((a, b) => a.timestamp - b.timestamp);
    setMessages(allMessages);
  }, [
    transcripts,
    chatMessages,
    localParticipant.localParticipant,
    agentAudioTrack.participant,
    agentMessages.segments,
    localMessages.segments,
  ]);

  return (
    <ChatTile messages={messages} accentColor={accentColor} onSend={sendChat} />
  );
}

function segmentToChatMessage(
  s: TranscriptionSegment,
  existingMessage: ChatMessageType | undefined,
  participant: Participant
): ChatMessageType {
  return {
    message: s.final ? s.text : `${s.text} ...`,
    name: participant instanceof LocalParticipant ? "You" : "Agent",
    isSelf: participant instanceof LocalParticipant,
    timestamp: existingMessage?.timestamp ?? Date.now(),
  };
}
