# MedExplain — Medical Report Explainer Frontend

A beautiful, production-ready React frontend for explaining medical reports using AI. Patients can upload their medical reports (PDF or images) and ask questions in natural language or by voice.

## 🎨 Design

- **Aesthetic**: Calm, trustworthy medical app with clean whites and soft teals
- **Typography**: Plus Jakarta Sans (headings) + DM Sans (body)
- **Colors**: Teal primary (#0D9488), soft gray cards (#F8FAFC)
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first design, fully responsive

## 🚀 Features

- 📄 **Drag & Drop Upload** - Upload PDFs or images of medical reports
- 💬 **AI Chat Interface** - Ask questions about your reports
- 🎤 **Voice Input** - Speak your questions instead of typing
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🔒 **Privacy Focused** - Clear messaging about data security
- ✨ **Beautiful Animations** - Smooth, professional interactions

## 📦 Tech Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - API communication
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

## 🛠️ Setup

### Prerequisites

- Node.js 14+ and npm
- Backend API running (see healthcare-backend folder)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend URL
# REACT_APP_API_URL=http://localhost:8000

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── api/
│   └── client.js              # Axios instance + API functions
├── components/
│   ├── Layout/
│   │   ├── Navbar.jsx         # Navigation bar
│   │   └── Footer.jsx         # Footer
│   ├── Upload/
│   │   ├── UploadZone.jsx     # Drag & drop upload
│   │   └── DocumentList.jsx   # List of uploaded docs
│   ├── Chat/
│   │   ├── ChatWindow.jsx     # Message thread
│   │   ├── ChatInput.jsx      # Text input with send
│   │   ├── MessageBubble.jsx  # Single message
│   │   └── VoiceButton.jsx    # Voice recording
│   └── UI/
│       ├── LoadingSpinner.jsx # Loading indicator
│       ├── EmptyState.jsx     # Empty state component
│       └── Badge.jsx          # Badge component
├── pages/
│   ├── HomePage.jsx           # Landing page
│   ├── UploadPage.jsx         # Upload reports
│   ├── ChatPage.jsx           # Ask questions
│   └── HowItWorksPage.jsx     # Explainer page
├── hooks/
│   ├── useUpload.js           # Upload logic
│   ├── useChat.js             # Chat state management
│   └── useVoice.js            # Voice recording
├── App.jsx                    # Main app component
├── index.js                   # Entry point
└── index.css                  # Global styles
```

## 🎯 Pages

### Home Page (`/`)
- Hero section with CTA buttons
- Feature cards
- How it works steps
- Trust banner

### Upload Page (`/upload`)
- Drag & drop upload zone
- File validation (PDF, JPG, PNG, max 10MB)
- Upload progress indicator
- List of uploaded documents

### Chat Page (`/chat`)
- Sidebar with document list
- Chat interface with message history
- Text and voice input
- AI responses with source citations
- Suggested starter questions

### How It Works (`/how-it-works`)
- 4-step process explanation
- FAQ accordion
- CTA section

## 🔌 API Integration

The frontend connects to these backend endpoints:

```javascript
POST   /upload                  // Upload PDF/image
GET    /upload/documents        // List documents
DELETE /upload/documents/:name  // Delete document
POST   /chat/rag                // Ask question
POST   /voice/ask               // Voice question
GET    /health                  // Health check
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  teal: {
    600: '#0D9488',  // Primary color
    // ... other shades
  },
}
```

### Fonts

Fonts are loaded from Google Fonts in `index.css`:
- Plus Jakarta Sans (headings)
- DM Sans (body text)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `REACT_APP_API_URL` = your backend URL
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag `build/` folder to Netlify
3. Set environment variables in Netlify dashboard

## 🔧 Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_APP_NAME=MedExplain
```

## 🎭 Features in Detail

### Voice Recording
- Uses browser MediaRecorder API
- Records audio as WebM blob
- Sends to backend for transcription
- User can edit transcribed text before sending

### Chat Persistence
- Messages saved to localStorage
- Survives page refresh
- Clear chat option available

### Upload Progress
- Real-time progress bar
- File validation before upload
- Success/error states with animations

### Animations
- Page transitions: fade + slide up
- Message bubbles: spring animation
- Upload success: scale bounce
- Document list: staggered fade-in

## ⚠️ Important Notes

- This is NOT a replacement for medical advice
- Always consult a qualified healthcare professional
- The AI provides explanations, not diagnoses

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Made with ❤️ for patients who want to understand their medical reports
