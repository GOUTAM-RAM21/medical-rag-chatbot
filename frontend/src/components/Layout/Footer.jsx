import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Heart className="w-5 h-5 text-teal-600 fill-teal-600" />
            <span className="text-sm text-slate-600">
              © 2024 MedExplain. Made with care for patients.
            </span>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium">⚠️ Not a replacement for medical advice.</span>
            <span className="ml-2">Always consult your doctor.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
