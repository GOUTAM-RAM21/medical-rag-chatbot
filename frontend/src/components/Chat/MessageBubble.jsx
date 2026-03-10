import React from 'react';
import { Bot, User, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../UI/Badge';

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  const formatContent = (content) => {
    const parts = content.split(/(\*\*.*?\*\*|HIGH|LOW|NORMAL)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      if (part === 'HIGH') {
        return <Badge key={index} variant="danger" className="mx-1">HIGH</Badge>;
      }
      if (part === 'LOW') {
        return <Badge key={index} variant="warning" className="mx-1">LOW</Badge>;
      }
      if (part === 'NORMAL') {
        return <Badge key={index} variant="success" className="mx-1">NORMAL</Badge>;
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-teal-600' : 'bg-slate-200'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-slate-600" />
          )}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-teal-600 text-white'
                : message.error
                ? 'bg-red-50 text-red-900 border border-red-200'
                : 'bg-white text-slate-900 shadow-soft border border-slate-100'
            }`}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {formatContent(message.content)}
            </div>

            {!isUser && message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                {message.sources.map((source, index) => (
                  <Badge key={index} variant="info" className="text-xs">
                    📄 {source}
                  </Badge>
                ))}
              </div>
            )}

            {!isUser && message.contextFound === false && (
              <div className="mt-3 pt-3 border-t border-orange-200 flex items-center space-x-2 text-orange-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">No report context found — answering from general knowledge</span>
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 mt-1 px-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
