import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bot, Mic, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Upload Any Report',
      description: 'PDF, JPG, or PNG. Blood tests, X-rays, prescriptions — all supported.',
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI Explains Simply',
      description: 'No medical jargon. Clear explanations that any patient can understand.',
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: 'Ask by Voice',
      description: 'Speak your question instead of typing. Perfect for elderly patients.',
    },
  ];

  const steps = [
    { number: 1, title: 'Upload your report', description: 'PDF or image of your medical document' },
    { number: 2, title: 'Ask your question', description: 'Type or speak what you want to know' },
    { number: 3, title: 'Get simple explanation', description: 'Clear answer with no medical jargon' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 text-teal-100 opacity-30 animate-float">
            <FileText className="w-full h-full" />
          </div>
          <div className="absolute top-40 right-20 w-16 h-16 text-teal-100 opacity-30 animate-float" style={{ animationDelay: '1s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 text-teal-100 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-bold text-slate-900 mb-6"
          >
            Understand Your Medical Reports —{' '}
            <span className="text-teal-600">Instantly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto"
          >
            Upload your blood test, X-ray, or prescription. Our AI explains it in simple language you can actually understand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/upload')}
              className="px-8 py-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Upload My Report</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="px-8 py-4 bg-white text-teal-600 border-2 border-teal-600 rounded-xl font-medium hover:bg-teal-50 transition-colors"
            >
              See How It Works
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto">
              <rect x="50" y="50" width="200" height="250" rx="10" fill="#F8FAFC" stroke="#0D9488" strokeWidth="3"/>
              <line x1="80" y1="100" x2="220" y2="100" stroke="#CBD5E1" strokeWidth="3"/>
              <line x1="80" y1="130" x2="220" y2="130" stroke="#CBD5E1" strokeWidth="3"/>
              <line x1="80" y1="160" x2="180" y2="160" stroke="#CBD5E1" strokeWidth="3"/>
              <circle cx="300" cy="150" r="50" fill="#0D9488" opacity="0.1"/>
              <path d="M 280 150 Q 300 130, 320 150 Q 300 170, 280 150" fill="#0D9488"/>
              <circle cx="330" cy="120" r="15" fill="#10B981"/>
              <path d="M 325 120 L 328 123 L 335 116" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-teal-200 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 px-4 bg-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 text-teal-900">
            <Lock className="w-6 h-6" />
            <p className="text-lg font-medium">
              Your reports stay on your device. We never share your medical data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
