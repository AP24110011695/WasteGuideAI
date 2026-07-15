# WasteGuide AI

A Sustainable Waste Management Assistant powered by Generative AI.

## 🎥 Project Demonstration

Project demonstration video:

https://drive.google.com/file/d/1CoMK0CaV7F17CWF4WGkf1A0tUy-x43uY/view?usp=drive_link

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Chart.js
- React Leaflet

### Backend

- Flask
- Flask-CORS
- Firebase Firestore
- Firebase Authentication
- Groq SDK (llama-3.3-70b-versatile)

## Project Structure

```
InternshipMe/
├── backend/
│   ├── config/          # Configuration files
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic services
│   ├── models/          # Data models
│   ├── utils/           # Utility functions
│   └── app.py           # Flask application entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── layouts/     # Layout wrappers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── context/     # React context providers
│   │   ├── services/    # API service modules
│   │   ├── assets/      # Static assets
│   │   └── styles/      # CSS / Tailwind styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Firebase project with Firestore and Authentication enabled
- Groq API key

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r ../requirements.txt
cp ../.env.example .env      # Edit .env with your credentials
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

Copy `.env.example` to `backend/.env` and fill in:

| Variable                | Description                          |
| ----------------------- | ------------------------------------ |
| `FLASK_SECRET_KEY`      | Secret key for Flask sessions        |
| `GROQ_API_KEY`          | Groq API key for AI model access     |
| `FIREBASE_PROJECT_ID`   | Firebase project ID                  |
| `FIREBASE_PRIVATE_KEY`  | Firebase service account private key |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email       |

## License

MIT
