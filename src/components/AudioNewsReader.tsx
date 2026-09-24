"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
} from "lucide-react";

interface AudioNewsReaderProps {
  title: string;
  excerpt: string;
  content: string;
}

export default function AudioNewsReader({
  title,
  excerpt,
  content,
}: AudioNewsReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const fullText = `${title}. ${excerpt}. ${content.replace(/[#*`_]/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!supported || typeof window === "undefined") return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "hi-IN";
    utterance.rate = speed;

    // Pick Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang.includes("hi") || v.lang.includes("HI") || v.name.includes("Hindi")
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Simulated progress estimation
    const totalChars = fullText.length;
    let charIndex = 0;
    utterance.onboundary = (e) => {
      if (e.charIndex) {
        charIndex = e.charIndex;
        setProgress(Math.min(100, Math.round((charIndex / totalChars) * 100)));
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!supported || typeof window === "undefined") return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!supported || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  };

  const handleSpeedChange = () => {
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1;
    setSpeed(nextSpeed);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!supported) return null;

  return (
    <div className="my-5 p-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                ऑडियो बुलेटिन (Listen News)
              </span>
              <span className="text-[10px] text-slate-400">हिंदी AI वाक्</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold line-clamp-1 mt-0.5">
              यह पूरी खबर सुनें — ऑन द गो ऑडियो सुविधा
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Speed Toggle */}
          <button
            onClick={handleSpeedChange}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-300 transition-colors"
            title="बोलने की गति बदलें"
          >
            {speed}x
          </button>

          {/* Reset / Stop */}
          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="रीसेट करें"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Play / Pause Toggle */}
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>रोकें (Pause)</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-900/40 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>{isPaused ? "जारी रखें" : "खबर सुनें"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Animated Equalizer */}
      {(isPlaying || isPaused || progress > 0) && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400">{progress}%</span>
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-full bg-red-500 animate-pulse"></span>
              <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-75"></span>
              <span className="w-0.5 h-3 bg-red-400 animate-pulse delay-150"></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
