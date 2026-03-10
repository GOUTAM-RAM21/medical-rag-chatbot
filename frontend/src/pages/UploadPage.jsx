import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadZone } from '../components/Upload/UploadZone';
import { DocumentList } from '../components/Upload/DocumentList';
import { useUpload } from '../hooks/useUpload';

export const UploadPage = () => {
  const { uploadFile, uploading, progress, uploadedDocs, deleteDoc, error, loading } = useUpload();
  const [uploadResult, setUploadResult] = useState(null);

  const handleUpload = async (file) => {
    try {
      const result = await uploadFile(file);
      setUploadResult(result);
      setTimeout(() => setUploadResult(null), 5000);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
            Upload Your Medical Report
          </h1>
          <p className="text-lg text-slate-600">
            Upload your PDF or image file to get started with AI-powered explanations
          </p>
        </div>

        <UploadZone
          onUpload={handleUpload}
          uploading={uploading}
          progress={progress}
          error={error}
          result={uploadResult}
        />

        <DocumentList
          documents={uploadedDocs}
          onDelete={deleteDoc}
          loading={loading}
        />
      </motion.div>
    </div>
  );
};
