# Spontaneous Trip Generator

A simple full-stack web app to inspire spontaneous travel! Click a button to get a random destination for the selected country and a short description.

---

## Features
- **React + Vite + Tailwind CSS** frontend
- **Django REST API** backend (no database required for MVP)
- Fetches a random destination for the selected country
- **Dynamic hero images**: The hero section updates with a beautiful Unsplash photo relevant to the selected country
- **Country flag overlay**: The hero section displays the selected country's flag
- **Multi-country support**: Choose from a list of countries to generate spontaneous trips worldwide
- **AI-powered descriptions**: Uses Claude AI to generate engaging city descriptions and provide clickable links to top tourist attractions
- **Firebase Authentication** (Email/Password & Google OAuth) via Firebase

---

## Claude AI Integration

This app uses [Claude AI](https://www.anthropic.com/products/claude) to generate:
- Rich, vibrant travel descriptions for each destination
- 2–4 clickable links to popular local attractions (official or trusted sources)
- All descriptions and links are generated server-side and delivered via the backend API

**Environment Variables:**
- Backend requires a `CLAUDE_API_KEY` in `backend/.env` for Claude API access.
- See `.env.example` for setup.

**Frontend Experience:**
- Users see a preview of the AI description and can expand to read the full text
- Attraction links are always clickable and open in a new tab
- An "🤖 Powered by Claude AI" badge is shown on every description
- The hero image and flag update instantly when you select a new country
- Responsive and visually polished UI, with robust fallback for images

---

## Firebase Authentication Integration

This app now uses [Firebase Authentication](https://firebase.google.com/docs/auth) for secure login, signup, and Google sign-in. Users can create accounts, sign in, and manage their profile securely.

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable Authentication (Email/Password and Google sign-in).
3. In your Firebase project settings, get your web app config.
4. Copy the config to `frontend/src/firebase.js` (replace the placeholders):
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
5. Add your domain (e.g., `localhost`) to the Firebase Auth sign-in methods for development.

---

## Agile User Story

**As a** spontaneous traveler,
**I want** to click a button and instantly receive a random destination for the selected country with a brief description,
**so that** I can discover new travel destinations without having to plan in advance.

---

## Iterations (Agile Sprints)

**Iteration 1: MVP Delivery**
- Set up backend with Django REST API to serve random destinations (hardcoded list)
- Create frontend with React + Vite + Tailwind CSS
- Implement UI: button to get a destination, display city name and description
- Connect frontend to backend API
- Basic error handling and loading states

**Iteration 2: Enhancements**
- Dynamic hero image and country flag in hero section
- Support for multiple countries (not just Canada)
- Allow user to filter by province/region
- Improve UI/UX with animations and responsive design
- Add more destinations to the backend

**Iteration 3: Expansion**
- Dynamic country-based hero images and flags
- Add support for more countries/regions
- Allow users to save favorite destinations (requires backend/db changes)
- Prepare for deployment (hosting, environment variables, etc.)

---

## MVP (Minimum Viable Product)

The MVP includes:
- A working frontend where users can click a button to receive a random destination for the selected country and its description
- A Django backend that returns a random destination from a hardcoded list (no database required)
- Simple, clean UI using React and Tailwind CSS
- No authentication, user accounts, or persistent storage
- Basic error handling for failed API requests

This MVP allows users to immediately experience the core value—discovering spontaneous travel ideas—while keeping the implementation simple and focused. Future iterations can expand on features and destinations as needed.

---

## Quickstart

### Backend (Django)
1. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the server:**
   ```bash
   python manage.py runserver 8000
   ```
   The API will be available at `http://localhost:8000/api/random-destination/`

### Frontend (React + Vite)
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Configure Firebase:**
   - Follow the [Firebase Setup](#firebase-authentication-integration) instructions above.
3. **Run the dev server:**
   ```bash
   npm run dev
   ```
   The app will be available at the URL shown in your terminal (usually `http://localhost:5173`).

---

## Project Structure
```
spontaneous-trip-generator/
├── backend/         # Django project
├── frontend/        # React + Vite + Tailwind frontend
├── requirements.txt # Python dependencies
├── .gitignore
└── README.md
```

---

## Notes
- Firebase Authentication is now required for login/signup. See the section above for setup.
- To add more countries or destinations, update the backend hardcoded list in `trips/views.py`.
- For deployment, further configuration will be needed.

---

## License
Ojay 2025