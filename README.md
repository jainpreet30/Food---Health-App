# VitalHealth Platform

A premier full-stack Health, Nutrition, and Fitness management platform built using modern React and Node.js. VitalHealth provides fully dynamic daily intake tracking, custom workout management, algorithmic meal generation, and real-time biometric analytics inside a beautifully sleek, intuitive glass-morphic UI.

## 🔥 Key Features

- **Personalized Diet Generation:** Algorithmically evaluates user biometrics (height, weight, age, and activity level) to procedurally generate comprehensive 7-day diet plans perfectly aligned with specific fitness goals.
- **Dynamic Workout Engine:** An interactive exercise ledger providing estimated caloric-burn configuration mapped through highly customizable activity time sliders. 
- **Micro-Nutrition Tracking:** Delivers macro-level manipulation with robust logging support for highly granular metrics (Proteins, Carbs, Fats, and daily Calories).
- **Biometric Analytics Visualization:** Elegantly visualizes current health data including real-time BMI assessments, macro-progression ring-charts, and interactive hydration limits.
- **Flexible Custom Logging:** Grants full support for user-created recipes, preventing reliance on generic dietary APIs by allowing users to log precise, multi-macro personalized meals.
- **Automated Consistency Streaks:** Employs advanced backend aggregation spanning your MongoDB timeline to accurately isolate and visually represent daily behavioral activity streaks. 

## 🚀 The Differentiator

Unlike generic calorie counters that lock you into rigid structures, force micro-transactions for basic metrics, or demand adherence to sterile spreadsheets—VitalHealth was built **explicitly for flexible personalization integrated alongside premium design.** 

We guarantee the ability to shape heavily customized workouts and custom multi-macro meals organically, all while offering dynamic, enterprise-grade Analytics Tracking and AI Coaching recommendations. Built fundamentally upon a responsive MongoDB NoSQL architecture, the engine effortlessly adapts to the user's specific health goals rather than enforcing strict relational boundaries.

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS (Glassmorphism architecture), Recharts, Lucide-React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODMs)
- **Authentication:** JWT (JSON Web Tokens), Bcrypt Hash Security

## 💻 Quick Start

### 1. Database Configuration
Ensure `MongoDB` is installed on your machine and running actively on `localhost:27017`. 
Alternatively, create a `.env` file referencing your custom `MONGO_URI`. (Note: Your `.env` files are correctly hidden via our `.gitignore`).

### 2. Backend Initialization
```bash
cd server
npm install
npm run dev
```
The server will boot actively and secure connections to the local database.

### 3. Frontend Interface
In a separate terminal, trigger the client engine:
```bash
cd client
npm install
npm run dev
```
Navigate to your active proxy host at `http://localhost:5173` to interact natively with your application!
