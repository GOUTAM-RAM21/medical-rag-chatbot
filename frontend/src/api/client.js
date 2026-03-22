import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 120000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const uploadReport = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress?.(progress);
    },
  });
  
  return response.data;
};

export const getDocuments = async () => {
  const response = await API.get('/upload/documents');
  return response.data;
};

export const deleteDocument = async (filename) => {
  const response = await API.delete(`/upload/documents/${filename}`);
  return response.data;
};

export const askQuestion = async (question, filename = null, language = 'english') => {
  const response = await API.post('/chat/rag', {
    message: question,
  });
  return response.data;
};

export const askByVoice = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  
  const response = await API.post('/voice/ask', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data;
};

export const checkHealth = async () => {
  const response = await API.get('/health');
  return response.data;
};

export default API;
