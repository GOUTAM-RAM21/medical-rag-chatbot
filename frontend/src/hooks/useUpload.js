import { useState, useEffect } from 'react';
import { uploadReport, getDocuments, deleteDocument } from '../api/client';
import toast from 'react-hot-toast';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments();
      setUploadedDocs(docs);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const result = await uploadReport(file, setProgress);
      
      toast.success(`✓ ${result.filename} uploaded successfully!`);
      await fetchDocuments();
      
      return result;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteDoc = async (filename) => {
    try {
      await deleteDocument(filename);
      toast.success(`Deleted ${filename}`);
      await fetchDocuments();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  return {
    uploadFile,
    uploading,
    progress,
    uploadedDocs,
    deleteDoc,
    error,
    loading,
    refreshDocs: fetchDocuments,
  };
};
