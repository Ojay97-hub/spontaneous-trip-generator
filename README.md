# Spontaneous Trip Generator

A simple full-stack web app to inspire spontaneous travel! Click a button to get a random Canadian city and a short description.

---

## Features
- **React + Vite + Tailwind CSS** frontend
- **Django REST API** backend (no database required for MVP)
- Fetches a random Canadian destination on demand

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