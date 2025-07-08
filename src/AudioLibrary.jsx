// src/AudioLibrary.jsx
import React, { useRef, useState } from 'react';

function AudioLibrary() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
      <h2 className="text-xl font-semibold mb-4">🔊 Audio Simulation</h2>
      <audio
        ref={audioRef}
        src="./assets/mixkit-classic-alarm-995.wav"
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={toggleAudio}
        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        {isPlaying ? '⏸ Pause' : '▶️ Play'}
      </button>
    </div>
  );
}

export default AudioLibrary;
