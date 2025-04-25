# Spontaneous Trip Generator

A simple full-stack web app to inspire spontaneous travel! Click a button to get a random Canadian city and a short description.

---

## Features
- **React + Vite + Tailwind CSS** frontend
- **Django REST API** backend (no database required for MVP)
- Fetches a random Canadian destination on demand

---

## Agile User Story

**As a** spontaneous traveler,
**I want** to click a button and instantly receive a random Canadian city with a brief description,
**so that** I can discover new travel destinations without having to plan in advance.

---

## Iterations (Agile Sprints)

**Iteration 1: MVP Delivery**
- Set up backend with Django REST API to serve random Canadian destinations (hardcoded list)
- Create frontend with React + Vite + Tailwind CSS
- Implement UI: button to get a destination, display city name and description
- Connect frontend to backend API
- Basic error handling and loading states

**Iteration 2: Enhancements**
- Add images for destinations
- Allow user to filter by province/region
- Improve UI/UX with animations and responsive design
- Add more destinations to the backend

**Iteration 3: Expansion**
- Add support for more countries/regions
- Allow users to save favorite destinations (requires backend/db changes)
- Prepare for deployment (hosting, environment variables, etc.)

---

## MVP (Minimum Viable Product)

The MVP includes:
- A working frontend where users can click a button to receive a random Canadian city and its description
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
2. **Run the dev server:**
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
- No authentication or database required for MVP.
- To add more countries or destinations, update the backend hardcoded list in `trips/views.py`.
- For deployment, further configuration will be needed.

---

## License
Ojay 2025