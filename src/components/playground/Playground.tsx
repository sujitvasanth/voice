import React, { useState } from 'react';
import { Room } from 'livekit-client';

interface Voice {
  name: string;
  id: string;
}

interface VoiceDropdownProps {
  voices: Voice[];
  room: Room;
}

const VoiceDropdown: React.FC<VoiceDropdownProps> = ({ voices, room }) => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceId = event.target.value;
    const selected: Voice | null = voices.find(voice => voice.id === voiceId) || null; // Ensure selected is either Voice or null

    setSelectedVoice(selected); // No undefined issue here

    if (selected && room) {
      const message = {
        name: selected.name,
        id: selected.id,
      };

      room.localParticipant.publishData(
        JSON.stringify(message),
        "reliable"
      );
      console.log("Sent voice change message:", message);
    }
  };

  return (
    <select onChange={handleVoiceChange}>
      <option value="">Select a voice</option> {/* Default option */}
      {voices.map((voice) => (
        <option key={voice.id} value={voice.id}>
          {voice.name}
        </option>
      ))}
    </select>
  );
};

export default VoiceDropdown;
