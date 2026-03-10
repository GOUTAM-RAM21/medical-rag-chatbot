import React from 'react';
import { Badge } from '../UI/Badge';
import { FileText } from 'lucide-react';

export const ExplanationCard = ({ answer, sources, contextFound }) => {
  const formatContent = (content) => {
    const parts = content.split(/(\*\*.*?\*\*|HIGH|LOW|NORMAL)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-slate-900">
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
      <div className="prose prose-slate max-w-none">
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {formatContent(answer)}
        </div>
      </div>

      {sources && sources.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-3">Sources:</p>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700"
              >
                <FileText className="w-4 h-4" />
                <span>{source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!contextFound && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            ⚠️ This answer is based on general medical knowledge, not your specific report.
          </p>
        </div>
      )}
    </div>
  );
};
