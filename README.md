# Agri-Tech — Smart Farming Dashboard

This project is a full-stack Agri-Tech management platform built with the MERN stack, focused on smallholder and scale farm operations.

## Features

- Farmer and admin authentication with JWT in HTTP-only cookies
- Farm, crop, and soil health management
- Dashboard with real metrics from database records
- Weather forecast and soil recommendations
- Resource marketplace and dashboard insights
- English and Hindi UI support
- React + Bootstrap UI, Recharts dashboard charts

## Quick start

1. Copy `.env.example` to `.env` and fill in the required values.
2. Install dependencies:
   - `npm install`
   - `cd server && npm install`
   - `cd client && npm install`
3. Start the app:
   - `npm run dev`
4. The backend will run on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## Default admin credentials

- Email: `admin@agritech.com`
- Password: `Admin@123`

## Default farmer credentials

- Email: `farmer@agritech.com`
- Password: `Farmer@123`

## Notes

- The app uses MongoDB if a `MONGODB_URI` is provided; otherwise it falls back to an in-memory MongoDB instance for local testing.
- OpenWeather API integration is optional and works when `OPENWEATHER_API_KEY` is available.
