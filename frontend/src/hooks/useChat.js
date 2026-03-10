import { useState, useEffect } from 'react';
import { askQuestion } from '../api/client';
import toast from 'react-hot-toast';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading messages:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await askQuestion(content, activeDocument);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response.reply,
        sources: response.sources || [],
        contextFound: response.context_used || false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      toast.error(err.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        sources: [],
        contextFound: false,
        timestamp: new Date().toISOString(),
        error: true,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chat_messages');
  };

  return {
    messages,
    sendMessage,
    loading,
    clearChat,
    activeDocument,
    setActiveDocument,
  };
};
