import React, { useState } from 'react';
import { Upload, FileSearch, MessageSquare, CheckCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      icon: <Upload className="w-12 h-12" />,
      title: 'Upload Your Report',
      description: 'Upload a PDF or photo of your medical report. We support blood tests, X-rays, prescriptions, and more.',
    },
    {
      icon: <FileSearch className="w-12 h-12" />,
      title: 'AI Reads It',
      description: 'Our AI extracts all text from your document and breaks it into understandable sections.',
    },
    {
      icon: <MessageSquare className="w-12 h-12" />,
      title: 'Ask Your Question',
      description: 'Type or speak your question. Ask about specific values, what they mean, or what to do next.',
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: 'Get Simple Answer',
      description: 'Receive a clear explanation with no medical jargon. We highlight important values and provide context.',
    },
  ];

  const faqs = [
    {
      question: 'Is my data private?',
      answer: 'Yes! Your medical reports are processed securely and never shared with third parties. We use encryption and follow strict privacy standards.',
    },
    {
      question: 'What types of reports work?',
      answer: 'We support blood tests, X-ray reports, MRI reports, prescriptions, lab results, and most medical documents in PDF or image format (JPG, PNG).',
    },
    {
      question: 'What languages are supported?',
      answer: 'Currently, we support English and Simple English (for easier understanding). More languages coming soon!',
    },
    {
      question: 'Is this a replacement for a doctor?',
      answer: 'No. MedExplain helps you understand your reports, but it is NOT medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.',
    },
    {
      question: 'How accurate is the AI?',
      answer: 'Our AI is trained on medical literature and provides accurate explanations. However, it may not catch every nuance. Always verify important information with your doctor.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
            How It Works
          </h1>
          <p className="text-lg text-slate-600">
            Understanding your medical reports in 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-lg transition-shadow h-full">
                <div className="w-20 h-20 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6 mx-auto">
                  {step.icon}
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-heading font-semibold text-slate-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-center">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-teal-200" />
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-heading font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-slate-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-teal-50 rounded-2xl p-12">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">
              Ready to understand your reports?
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Upload your first medical report and start asking questions
            </p>
            <button
              onClick={() => window.location.href = '/upload'}
              className="px-8 py-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
