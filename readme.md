Tikli AI — Career Counsellor Chat App

A full-stack AI-powered career counselling application. Users sign up, verify their email via OTP, log in securely with JWT authentication, and chat with an AI career counsellor that asks about their interests and goals before suggesting relevant career paths.

Features
 Secure authentication — JWT-based login with access & refresh tokens (httpOnly cookies)
 Email verification — OTP sent via Gmail SMTP, required before login
 AI career counsellor — conversational AI (via Groq) scoped strictly to career guidance
 Chat interface — real-time messaging UI with persistent history
 Chat history — past conversations saved to MongoDB and retrievable per user
 Responsive UI — built with React and Tailwind CSS
Tech Stack

Backend

Node.js + Express 5
MongoDB + Mongoose
JWT (jsonwebtoken) for authentication
bcrypt for password hashing
Nodemailer for OTP emails
OpenAI SDK (connected to Groq's OpenAI-compatible endpoint) for AI responses

Frontend

React
React Router for navigation
Tailwind CSS for styling
Vite as the build tool