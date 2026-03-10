import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWindow } from '../components/Chat/ChatWindow';
import { ChatInput } from '../components/Chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useUpload } from '../hooks/useUpload';

export const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, sendMessage, loading, clearChat, activeDocument, setActiveDocument } = useChat();
  const { uploadedDocs } = useUpload();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.document) {
      setActiveDocument(location.state.document);
    }
  }, [location.state, setActiveDocument]);

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <div className="h-screen pt-16 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 p-3 bg-teal-600 text-white rounded-full shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:relative inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 pt-16 md:pt-0 flex flex-col"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">
                My Reports
              </h2>

              <button
                onClick={() => setActiveDocument(null)}
                className={`w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-colors mb-2 ${
                  !activeDocument
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Reports
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uploadedDocs.map((doc) => (
                  <button
                    key={doc.filename}
                    onClick={() => setActiveDocument(doc.filename)}
                    className={`w-full px-4 py-2 rounded-lg text-left text-sm transition-colors flex items-center space-x-2 ${
                      activeDocument === doc.filename
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{doc.filename}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 mt-auto border-t border-slate-200">
              <button
                onClick={clearChat}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <h1 className="text-xl font-heading font-semibold text-slate-900">
            {activeDocument ? `Chatting about: ${activeDocument}` : 'Medical AI Assistant'}
          </h1>
          <p className="text-sm text-slate-600">
            Ask questions about your medical reports
          </p>
        </div>

        <ChatWindow
          messages={messages}
          loading={loading}
          onSuggestedQuestion={handleSuggestedQuestion}
        />

        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
};
