# Job Application Tracker

A full-stack web application that allows users to track their job applications.  
Users can sign up, log in, and manage applications with status updates.

## Live Demo

⚠️ Note: Backend is hosted on Render free tier and may take ~30–60 seconds to wake up after inactivity.
- Frontend: https://job-tracker-alpha-three.vercel.app/login
- Backend API: https://job-tracker-m2pb.onrender.com

## Features
- User authentication (JWT)
- Secure password hashing
- Create, update, and delete job applications
- Track application status (Applied, Interview, Offer, Rejected)
- Protected routes
- Responsive UI

## Tech Stack

### Backend
- Python
- Flask
- Flask-JWT-Extended
- SQLAlchemy
- SQLite
- Gunicorn

### Frontend
- React
- Vite
- Tailwind CSS

## Project Structure

```text
job_tracker/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models.py
│   │   └── extensions.py
│   ├── run.py
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── auth/
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
├── screenshots/
│   ├── login.png
│   ├── signup.png
│   └── dashboard.png
├── .gitignore
└── README.md
```

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Signup Page
![Signup Page](screenshots/signup.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)


## Setup (Local Development)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py 
```

### Frontend
```bash
cd frontend
npm install
npm run dev
Future Improvements
Search and filters
```
