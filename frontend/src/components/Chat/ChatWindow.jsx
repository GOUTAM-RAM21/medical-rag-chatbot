import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { motion } from 'framer-motion';

export const ChatWindow = ({ messages, loading, onSuggestedQuestion }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestedQuestions = [
    'What does my blood test show?',
    'Are any of my values abnormal?',
    'What should I do about these results?',
  ];

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">
            Hello! I'm your Medical AI Assistant
          </h2>
          <p className="text-slate-600 mb-6">
            Upload your medical report and ask me anything. I'll explain it in simple language.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Try asking:
            </p>
            {suggestedQuestions.map((question, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSuggestedQuestion(question)}
                className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-left text-sm text-slate-700 hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-4 md:p-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {loading && (
        <div className="flex justify-start mb-4">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-soft border border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 bg-teal-600 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-teal-600 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-teal-600 rounded-full"
                />
              </div>
              <span className="text-sm text-slate-600">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
