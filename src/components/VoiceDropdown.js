import React from 'react';

function VoiceDropdown({ voices = [], onVoiceChange }) {
  return (
    <select onChange={(e) => onVoiceChange(e.target.value)}>
      {voices.length > 0 ? (
        voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))
      ) : (
        <option>No voices available</option>
      )}
    </select>
  );
}

export default VoiceDropdown;

