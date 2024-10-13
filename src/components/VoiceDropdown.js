import React from 'react';

function VoiceDropdown({ voices, onVoiceChange }) {
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
