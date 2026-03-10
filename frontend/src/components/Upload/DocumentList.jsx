import React from 'react';
import { FileText, Image, Trash2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../UI/EmptyState';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const DocumentList = ({ documents, onDelete, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner size="lg" className="py-12" />;
  }

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        icon="📄"
        title="No reports uploaded yet"
        description="Upload your first medical report above to get started with AI explanations."
      />
    );
  }

  const getFileIcon = (filename) => {
    if (filename.endsWith('.pdf')) {
      return <FileText className="w-6 h-6 text-red-600" />;
    }
    return <Image className="w-6 h-6 text-blue-600" />;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">
        Uploaded Reports
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.filename}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow border border-slate-100"
          >
            <div className="flex items-start justify-between mb-4">
              {getFileIcon(doc.filename)}
              <button
                onClick={() => onDelete(doc.filename)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-medium text-slate-900 mb-1 truncate">
              {doc.filename}
            </h3>
            <p className="text-sm text-slate-500 mb-1">
              {doc.file_size_kb} KB
            </p>
            <p className="text-xs text-slate-400 mb-4">
              {formatDate(doc.upload_time)}
            </p>

            <button
              onClick={() => navigate('/chat', { state: { document: doc.filename } })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask Questions</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
