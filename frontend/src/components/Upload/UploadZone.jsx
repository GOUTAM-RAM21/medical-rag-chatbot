import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const UploadZone = ({ onUpload, uploading, progress, error, result }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  if (result) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-green-900 mb-2">
          Report Uploaded Successfully!
        </h3>
        <p className="text-green-700 mb-1">
          <span className="font-medium">{result.filename}</span>
        </p>
        <p className="text-green-600 text-sm">
          {result.chunks_stored} sections processed. You can now ask questions about it.
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
      >
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-red-900 mb-2">
          Upload Failed
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (uploading) {
    return (
      <div className="bg-white border-2 border-teal-200 rounded-2xl p-8 text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
          Reading your report...
        </h3>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-600 text-sm">{progress}% complete</p>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-teal-600 bg-teal-50'
            : 'border-slate-300 bg-white hover:border-teal-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        <Upload className="w-16 h-16 text-teal-600 mx-auto mb-4" />
        
        <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
          Drag your medical report here
        </h3>
        <p className="text-slate-600 mb-4">
          PDF, JPG, PNG supported — max 10MB
        </p>

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 mb-4 text-teal-700"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-sm text-slate-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </motion.div>
        )}
      </div>

      {selectedFile && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleUploadClick}
          className="w-full mt-4 px-6 py-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Upload & Process Report
        </motion.button>
      )}
    </div>
  );
};
