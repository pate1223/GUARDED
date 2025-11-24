import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function VideoPlayer({ module, onComplete, onBack }) {
  const { isAuthenticated } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [volume, setVolume] = useState(1);

  // Sample captions (in real app, load from VTT file)
  const captions = [
    { start: 0, end: 5, text: "Welcome to the security awareness module." },
    { start: 5, end: 10, text: "Today we'll learn about online safety." },
    { start: 10, end: 15, text: "Phishing is one of the most common threats." },
    { start: 15, end: 20, text: "Always verify sender email addresses." },
    { start: 20, end: 25, text: "Never click suspicious links." }
  ];

  const currentCaption = captions.find(
    caption => currentTime >= caption.start && currentTime < caption.end
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      // Calculate watch percentage
      const percentage = (current / video.duration) * 100;
      setWatchedPercentage(Math.max(watchedPercentage, percentage));

      // Unlock quiz at 80%
      if (percentage >= 80 && !quizUnlocked) {
        setQuizUnlocked(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setWatchedPercentage(100);
      setQuizUnlocked(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [watchedPercentage, quizUnlocked]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Module Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Modules
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{module?.title || 'Security Awareness Module'}</h1>
          <p className="text-gray-600 mt-2">{module?.description || 'Learn about online security and best practices'}</p>
        </div>

        {/* Video Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative bg-black">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video"
              src={module?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
              onClick={togglePlay}
            />

            {/* Captions Overlay */}
            {showCaptions && currentCaption && (
              <div className="absolute bottom-20 left-0 right-0 text-center px-4">
                <div className="inline-block bg-black bg-opacity-80 text-white px-6 py-3 rounded-lg text-lg">
                  {currentCaption.text}
                </div>
              </div>
            )}

            {/* Play/Pause Overlay */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity group"
            >
              {!isPlaying && (
                <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                  <svg className="w-10 h-10 text-[#5c52ff] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / duration) * 100 || 0}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #5c52ff 0%, #5c52ff ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button onClick={togglePlay} className="hover:text-[#5c52ff] transition">
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Captions Toggle */}
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`hover:text-[#5c52ff] transition ${showCaptions ? 'text-[#5c52ff]' : ''}`}
                    title="Toggle Captions"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
                    </svg>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="hover:text-[#5c52ff] transition"
                    title="Fullscreen"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="p-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Watch Progress</h3>
                <p className="text-sm text-gray-600">You need to watch 80% to unlock the quiz</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#5c52ff]">{Math.round(watchedPercentage)}%</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="bg-[#5c52ff] h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                style={{ width: `${watchedPercentage}%` }}
              >
                {watchedPercentage >= 10 && (
                  <span className="text-xs text-white font-semibold">{Math.round(watchedPercentage)}%</span>
                )}
              </div>
            </div>

            {/* Quiz Button */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Back to Modules
              </button>
              <button
                onClick={onComplete}
                disabled={!quizUnlocked}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                  quizUnlocked
                    ? 'bg-[#5c52ff] text-white hover:bg-[#4335d1] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {quizUnlocked ? (
                  <>
                    <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Start Quiz
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    Watch {Math.ceil(80 - watchedPercentage)}% More to Unlock
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Module Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Module</h2>
          <p className="text-gray-600 mb-4">
            This module covers essential security awareness topics including phishing, password security,
            and safe browsing practices. Watch the entire video to gain a comprehensive understanding
            before taking the quiz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#5c52ff]">{Math.ceil(duration / 60)} min</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Quiz Questions</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">80%</div>
              <div className="text-sm text-gray-600">Required Watch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}