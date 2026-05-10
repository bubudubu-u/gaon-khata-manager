# 🌾 Gaon Khata Manager

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248.svg)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

### 🚜 Smart Village Land Record Management System for Indian Farmers

**Paper diary से digital khata तक — सुरक्षित, तेज और हमेशा उपलब्ध।**

[Features](#-features) •
[Installation](#-installation) •
[API](#-api-documentation) •
[Deployment](#-deployment) •
[Database](#-database-schema) •
[Support](#-support)

</div>

---

# 📖 About The Project

**Gaon Khata Manager** एक modern web application है जो गाँव के ज़मीन हिसाब (खाता) को digital तरीके से manage करने के लिए बनाया गया है।

अब Charha, Batai, Patta और Bakaya जैसे सभी records diary में लिखने की जरूरत नहीं। पूरा data securely cloud में save रहेगा।

---

# 🎯 Problems Solved

### ❌ Traditional Problems

- Diary खो जाने का डर
- पुराना हिसाब ढूंढने में समय लगना
- गलत जोड़-घटाव
- Phone बदलने पर data loss
- Bakaya tracking मुश्किल होना

### ✅ Digital Solution

- MongoDB cloud backup
- Fast search system
- Automatic balance calculation
- Payment history tracking
- PDF/Excel export
- Multi-device access
- Secure login system

---

# ✨ Features

## 🔐 Authentication & Security

- JWT Authentication
- bcrypt password hashing
- Protected API routes
- Role-based access system
- Activity logging
- Session management

---

## 👥 People Management

- Add / Edit / Delete people
- Mobile & Aadhar storage
- Village-wise filtering
- Photo upload support
- Document attachments
- Fast search system

---

## 💰 Khata Record Management

### Supported Entry Types

| Type | Hindi | Description |
|---|---|---|
| Charha | चरहा | Land lease/rent |
| Batai | बटाई | Crop sharing |
| Patta | पट्टा | Land agreement |
| Bakaya | बकाया | Pending dues |

### Features

- Auto pending amount calculation
- Payment history tracking
- Land size management
- Rate calculation system
- Receipt generation
- Financial year support

---

## 📊 Dashboard & Analytics

- Total people count
- Total pending amount
- Total paid amount
- Active entries count
- Village-wise analytics
- Monthly charts
- Recent payment activity

---

## 🔍 Search & Filters

- Search by:
  - Name
  - Village
  - Mobile number
  - Entry type
- Date filters
- Year filters
- Status filters

---

## 📤 Export & Backup

- PDF export
- Excel export
- Database backup
- Restore backup
- Printable reports

---

## 🎤 Advanced Features

- Voice notes
- Photo uploads
- Multi-user system
- Admin dashboard
- Delete confirmation
- Toast notifications

---

# 🎨 UI/UX Highlights

- Agriculture green theme
- Glassmorphism cards
- Mobile-first responsive design
- Hindi language support
- Large buttons for elderly users
- Smooth animations
- PWA support

---

# 🛠️ Tech Stack

## Frontend

| Technology | Version |
|---|---|
| React.js | 18.2.0 |
| React Router | 6.20.0 |
| Axios | 1.6.2 |
| Framer Motion | 10.16.4 |
| React Hot Toast | 2.4.1 |

---

## Backend

| Technology | Version |
|---|---|
| Node.js | 18+ |
| Express.js | 4.18.2 |
| MongoDB Atlas | Latest |
| Mongoose | 8.0.3 |
| JWT | 9.0.2 |
| Multer | 1.4.5 |

---

# 📁 Project Structure

```bash
gaon-khata-manager/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   └── index.js
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
│
├── README.md
└── LICENSE
```

---

# 🚀 Installation

## 📌 Prerequisites

Install these first:

- Node.js (18+)
- npm
- MongoDB Atlas account
- Git (optional)

---

## ⚙️ Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Start backend:

```bash
npm run dev
```

Backend running on:

```bash
http://localhost:5000
```

---

## 🎨 Frontend Setup

```bash
cd client
npm install
```

Create `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm start
```

Frontend running on:

```bash
http://localhost:3000
```

---

# 🌱 Seed Sample Data

```bash
cd server
npm run seed
```

### Default Admin

```txt
Email: admin@gaonkhata.com
Password: admin123
```

---

# 📱 Usage Guide

## 1️⃣ Register/Login

- Open app
- Create account
- Login securely

---

## 2️⃣ Add Person

Go to:

```txt
लोग → नया व्यक्ति जोड़ें
```

Add:

- Name
- Father Name
- Village
- Mobile

---

## 3️⃣ Add Khata Entry

Go to:

```txt
हिसाब → नई प्रविष्टि
```

Fill:

- Entry type
- Land details
- Amount
- Payment

---

## 4️⃣ Track Payments

- Open entry
- Click "भुगतान जोड़ें"
- System auto-calculates balance

---

# 🔌 API Documentation

## Base URL

```bash
/api
```

---

## Register User

```http
POST /api/auth/register
```

### Request

```json
{
  "name": "राम सिंह",
  "email": "ram@example.com",
  "password": "password123"
}
```

---

## Login

```http
POST /api/auth/login
```

---

## Create Person

```http
POST /api/persons
```

---

## Get All Persons

```http
GET /api/persons
```

---

## Create Khata Entry

```http
POST /api/khata
```

---

## Record Payment

```http
POST /api/khata/:id/payment
```

---

## Export PDF

```http
GET /api/khata/export/pdf
```

---

# 🚢 Deployment

## Backend → Render

### Build Command

```bash
npm install
```

### Start Command

```bash
node index.js
```

---

## Frontend → Vercel

### Build Command

```bash
npm run build
```

### Output Directory

```bash
build
```

---

# 🗄️ MongoDB Setup

## Steps

1. Create MongoDB Atlas account
2. Create free cluster
3. Add database user
4. Allow IP access
5. Copy connection string
6. Add URI in `.env`

Example URI:

```bash
mongodb+srv://admin:password@cluster.mongodb.net/gaon-khata-manager
```

---

# 🔧 Troubleshooting

## MongoDB Error

```txt
MongooseServerSelectionError
```

### Fix

- Check IP whitelist
- Verify URI
- Check internet connection

---

## CORS Error

```txt
Blocked by CORS policy
```

### Fix

Check:

```env
CORS_ORIGIN=http://localhost:3000
```

---

## JWT Expired

### Fix

Login again or increase:

```env
JWT_EXPIRE=90d
```

---

# 📊 Database Schema

## User

```javascript
{
  name,
  email,
  password,
  role,
  village,
  phone
}
```

---

## Person

```javascript
{
  name,
  fatherName,
  village,
  mobile,
  notes
}
```

---

## Khata Entry

```javascript
{
  entryType,
  year,
  landDetails,
  financials,
  status
}
```

---

# 🔒 Security Features

- bcrypt hashing
- JWT authentication
- Input validation
- Protected routes
- File validation
- Soft delete support
- XSS protection

---

# 📱 PWA Support

Install app on mobile directly from browser.

### Android

Chrome → Add to Home Screen

### iPhone

Safari → Share → Add to Home Screen

---

# 🚀 Future Roadmap

## v1.1

- WhatsApp receipt sharing
- SMS reminders
- Offline support
- Multi-language support

---

## v2.0

- Mobile app
- Government API integration
- AI crop prediction
- Online payment gateway

---

# 🤝 Contributing

```bash
git checkout -b feature/new-feature
git commit -m "Added new feature"
git push origin main
```

---

# 📝 License

MIT License © 2026

---

# 👨‍💻 Author

### Developed By

```txt
Your Name
```

GitHub: `@yourusername`

---

# 📞 Support

- Email: support@gaonkhata.com
- WhatsApp: +91-XXXXXXXXXX

---

<div align="center">

# 🌾 Made for Indian Farmers 🇮🇳

### “डिजिटल गाँव की ओर एक कदम”

</div>
