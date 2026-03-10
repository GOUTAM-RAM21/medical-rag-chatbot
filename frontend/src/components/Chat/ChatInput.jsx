import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { useVoice } from '../../hooks/useVoice';
import toast from 'react-hot-toast';

export const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const { isRecording, transcribing, startRecording, stopRecording } = useVoice();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceStart = async () => {
    try {
      await startRecording();
    } catch (err) {
      console.error('Voice recording error:', err);
    }
  };

  const handleVoiceStop = async () => {
    try {
      const result = await stopRecording();
      if (result.transcribed_text) {
        setMessage(result.transcribed_text);
        toast.success('Voice transcribed! Edit if needed, then send.');
      }
    } catch (err) {
      console.error('Voice transcription error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your report..."
            disabled={disabled || isRecording || transcribing}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        <VoiceButton
          isRecording={isRecording}
          transcribing={transcribing}
          onStart={handleVoiceStart}
          onStop={handleVoiceStop}
          disabled={disabled}
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
