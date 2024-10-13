import React, { useState } from 'react';

const VoiceDropdown = ({ voices, room }) => {
  const [selectedVoice, setSelectedVoice] = useState(null);

  const handleVoiceChange = (event) => {
    const voiceId = event.target.value;
    const selected = voices.find(voice => voice.id === voiceId);
    setSelectedVoice(selected);

    if (selected && room) {
      const message = {
        name: selected.name,
        id: selected.id,
      };

      // Publish the voice change message to the server
      room.localParticipant.publishData(
        JSON.stringify(message),
        "reliable"
      );
      console.log("Sent voice change message:", message);
    }
  };

  return (
    <select onChange={handleVoiceChange}>
      {voices.map((voice) => (
        <option key={voice.id} value={voice.id}>
          {voice.name}
        </option>
      ))}
    </select>
  );
};

export default VoiceDropdown;

