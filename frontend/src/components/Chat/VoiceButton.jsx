import React from 'react';
import { Mic, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const VoiceButton = ({ isRecording, transcribing, onStart, onStop, disabled }) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  if (transcribing) {
    return (
      <button
        disabled
        className="p-3 bg-slate-100 rounded-full"
      >
        <LoadingSpinner size="sm" />
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative p-3 rounded-full transition-all ${
        isRecording
          ? 'bg-red-600 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isRecording ? (
        <>
          <Square className="w-5 h-5" />
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-red-600 opacity-30"
          />
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </motion.button>
  );
};
