# 🚗 DrivePro — Car Rental System

A full-stack car rental web application built with **React**, **Node.js**, **Express**, and **SQLite**. DrivePro offers a premium, modern interface for browsing, booking, and managing rental cars with real-time GPS tracking and secure payment integration.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration & login with **JWT** authentication
- Secure password hashing with **bcryptjs**
- Role-based access control (**Admin** / **User**)

### 🚙 Car Management
- Browse cars with category filters (**Hatchback**, **Sedan**, **SUV**)
- Detailed car pages with specifications & pricing (₹)
- Admin panel for full CRUD operations on car inventory

### 📋 Booking System
- Seamless car booking flow
- Booking history & management via user dashboard
- Admin dashboard for managing all bookings

### 💳 Payment Integration
- UPI & QR code-based payment flow
- Payment confirmation & receipt generation

### 📍 Live GPS Tracking
- Real-time car tracking simulation with animated map
- Live telemetry data (speed, distance, ETA)

### 🎨 Premium UI/UX
- Dark-themed, glassmorphic design
- Smooth animations & micro-interactions
- Fully responsive across all devices

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| **Frontend** | React 18, Vite, React Router, Lucide Icons |
| **Backend**  | Node.js, Express 5                      |
| **Database** | SQLite (better-sqlite3)                 |
| **Auth**     | JWT, bcryptjs                           |
| **Styling**  | Custom CSS with glassmorphism            |

---

## 📁 Project Structure

```
car_rental_system/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page with car listings
│   │   │   ├── CarDetails.jsx      # Car detail & booking page
│   │   │   ├── Payment.jsx         # UPI/QR payment flow
│   │   │   ├── Tracking.jsx        # Live GPS tracking
│   │   │   ├── UserDashboard.jsx   # User bookings & profile
│   │   │   ├── AdminDashboard.jsx  # Admin management panel
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Register.jsx        # Registration page
│   │   ├── index.css               # Global styles
│   │   └── App.jsx                 # Routes & app layout
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── index.js            # Express server & API routes
│   ├── db.js               # Database setup & queries
│   ├── auth.js             # JWT authentication middleware
│   ├── cars.db             # SQLite database file
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or later)
- **npm** (v9 or later)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tharun-1308/car-rental-system.git
   cd car-rental-system
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   node index.js
   ```
   Server runs on `http://localhost:3001`

2. **Start the frontend dev server**
   ```bash
   cd client
   npm run dev
   ```
   App opens at `http://localhost:5173`

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| **Home** | Browse all available cars with category filters |
| **Car Details** | View car specs, pricing, and book instantly |
| **Payment** | Complete booking with UPI/QR code payment |
| **Tracking** | Live GPS tracking with real-time telemetry |
| **User Dashboard** | View booking history and manage profile |
| **Admin Dashboard** | Manage cars, bookings, and users |

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/register` | Register new user | ❌ |
| `POST` | `/api/login` | User login | ❌ |
| `GET` | `/api/cars` | Get all cars | ❌ |
| `GET` | `/api/cars/:id` | Get car by ID | ❌ |
| `POST` | `/api/bookings` | Create a booking | ✅ |
| `GET` | `/api/bookings` | Get user bookings | ✅ |
| `POST` | `/api/cars` | Add a car (Admin) | ✅ Admin |
| `PUT` | `/api/cars/:id` | Update a car (Admin) | ✅ Admin |
| `DELETE` | `/api/cars/:id` | Delete a car (Admin) | ✅ Admin |

---

## 👤 Author

**Tharun** — [@tharun-1308](https://github.com/tharun-1308)

---

## 📄 License

This project is licensed under the ISC License.
