import React from 'react';

function VoiceDropdown({ onVoiceChange }) {
  const voices = [
    { id: 'voice-id-1', name: 'Voice 1' },
    { id: 'voice-id-2', name: 'Voice 2' },
    { id: 'voice-id-3', name: 'Voice 3' },
  ];

  return (
    <select onChange={(e) => onVoiceChange(e.target.value)}>
      {voices.map((voice) => (
        <option key={voice.id} value={voice.id}>
          {voice.name}
        </option>
      ))}
    </select>
  );
}

export default VoiceDropdown;
