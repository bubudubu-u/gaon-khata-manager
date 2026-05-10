🌾 Gaon Khata Manager - गाँव खाता मैनेजर

<div align="center">

https://img.shields.io/badge/version-1.0.0-green.svg
https://img.shields.io/badge/license-MIT-blue.svg
https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg
https://img.shields.io/badge/react-18.2.0-61dafb.svg
https://img.shields.io/badge/mongodb-atlas-47A248.svg
https://img.shields.io/badge/PRs-welcome-brightgreen.svg

Complete Village Land Record Management System for Indian Farmers

Features • Installation • Usage • API • Deployment • Screenshots • Support

</div>

---

📖 About The Project

Gaon Khata Manager is a comprehensive digital solution designed to replace traditional paper diaries for managing village land records (ज़मीन हिसाब). It helps farmers and landowners maintain Charha, Batai, Patta, and Bakaya records digitally with permanent cloud storage.

🎯 Problem Solved

· ❌ No more lost paper diaries
· ❌ No more calculation errors in Bakaya (बकाया)
· ❌ No more data loss when changing phones
· ❌ No more manual searching through pages
· ✅ Everything saved permanently in MongoDB cloud
· ✅ Instant search and filter
· ✅ Auto payment tracking
· ✅ Export reports anytime

---

✨ Features

🔐 Authentication & Security

· JWT-based secure login/signup system
· Role-based access (Admin, User, Sarpanch)
· Password encryption with bcrypt
· Session management
· Activity logging

👥 People Management

· Add/Edit/Delete people records
· Store Name, Father's Name, Village, Mobile, Aadhar
· Photo upload support
· Document attachments
· Quick search functionality
· Village-wise filtering

💰 Land Khata Records

· Charha (चरहा) - Land lease records
· Batai (बटाई) - Crop sharing records
· Patta (पट्टा) - Land agreement records
· Bakaya (बकाया) - Pending dues tracking
· Auto calculation of remaining amounts
· Land size with different units (Bigha, Acre, Hectare)
· Rate management
· Payment history tracking
· Receipt generation

📊 Dashboard & Analytics

· Total People count
· Total Pending amount
· Total Paid amount
· Active Records count
· Monthly statistics charts
· Village-wise breakdown
· Year-wise filtering
· Recent payments list

🔍 Search & Filter

· Instant search by name, village, mobile
· Filter by year, entry type, status
· Date range filtering
· Village-wise sorting
· Export filtered data

📤 Export & Backup

· Export to PDF with proper formatting
· Export to Excel (.xlsx) for analysis
· Backup entire database
· Restore from backup
· Print-friendly reports

🎤 Advanced Features

· Voice note recording for entries
· Document/photo upload per entry
· Multi-user support
· Admin dashboard
· Activity logs tracking
· Confirmation dialogs for delete
· Toast notifications

🎨 UI/UX Design

· Modern dark green agriculture theme
· Glassmorphism card design
· Smooth animations with Framer Motion
· Large readable buttons for elderly users
· Fully responsive (mobile-first)
· Hindi language support
· Loading animations
· Mobile app-like experience

---

🛠️ Tech Stack

Frontend

Technology Version Purpose
React.js 18.2.0 UI Framework
React Router 6.20.0 Navigation
Axios 1.6.2 API Calls
Framer Motion 10.16.4 Animations
React Icons 4.12.0 Icons
React Hot Toast 2.4.1 Notifications
React Spinners 0.13.8 Loading States
Date-fns 2.30.0 Date Formatting

Backend

Technology Version Purpose
Node.js 16+ Runtime
Express.js 4.18.2 Web Framework
MongoDB Atlas Database
Mongoose 8.0.3 ODM
JWT 9.0.2 Authentication
bcryptjs 2.4.3 Password Hashing
Multer 1.4.5 File Upload
PDFKit 0.13.0 PDF Generation
XLSX 0.18.5 Excel Export

---

📁 Project Structure

```
gaon-khata-manager/
│
├── server/                          # Backend Node.js/Express
│   ├── models/                      # MongoDB Models
│   │   ├── User.js                  # User schema
│   │   ├── Person.js                # Person/Farmer schema
│   │   ├── Khata.js                 # Khata entry schema
│   │   └── ActivityLog.js           # Activity tracking schema
│   │
│   ├── routes/                      # API Routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── person.js                # Person CRUD routes
│   │   ├── khata.js                 # Khata entry routes
│   │   ├── dashboard.js             # Dashboard stats routes
│   │   └── backup.js                # Backup/restore routes
│   │
│   ├── controllers/                 # Route Controllers
│   │   ├── authController.js        # Auth logic
│   │   ├── personController.js      # Person logic
│   │   └── khataController.js       # Khata logic
│   │
│   ├── middleware/                  # Custom Middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── upload.js                # File upload handling
│   │   └── validation.js            # Input validation
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── pdfGenerator.js          # PDF creation
│   │   ├── excelGenerator.js        # Excel creation
│   │   └── helpers.js               # Helper functions
│   │
│   ├── uploads/                     # Uploaded Files
│   │   ├── photos/                  # Profile photos
│   │   ├── documents/               # Attachments
│   │   └── voice/                   # Voice notes
│   │
│   ├── .env                         # Environment variables
│   ├── index.js                     # Main server file
│   ├── seed.js                      # Database seeder
│   └── package.json                 # Dependencies
│
├── client/                          # Frontend React.js
│   ├── public/
│   │   ├── index.html               # HTML template
│   │   ├── favicon.ico              # Favicon
│   │   └── manifest.json            # PWA manifest
│   │
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   │   ├── common/              # Shared components
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── ConfirmDialog.js
│   │   │   │   ├── Pagination.js
│   │   │   │   ├── EmptyState.js
│   │   │   │   └── Toast.js
│   │   │   │
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   │   ├── DashboardCard.js
│   │   │   │   ├── MonthlyChart.js
│   │   │   │   ├── VillageWiseChart.js
│   │   │   │   └── RecentPayments.js
│   │   │   │
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── MainLayout.js
│   │   │   │   ├── AuthLayout.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   └── Header.js
│   │   │   │
│   │   │   ├── persons/             # Person components
│   │   │   │   ├── PersonCard.js
│   │   │   │   ├── PersonForm.js
│   │   │   │   └── PersonSearch.js
│   │   │   │
│   │   │   ├── khata/               # Khata components
│   │   │   │   ├── KhataTable.js
│   │   │   │   ├── KhataForm.js
│   │   │   │   └── PaymentForm.js
│   │   │   │
│   │   │   └── forms/               # Form components
│   │   │       ├── InputField.js
│   │   │       ├── SelectField.js
│   │   │       └── FileUpload.js
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── PersonsList.js       # People list
│   │   │   ├── PersonForm.js        # Add/Edit person
│   │   │   ├── PersonDetail.js      # Person details
│   │   │   ├── KhataEntries.js      # Khata list
│   │   │   ├── KhataForm.js         # Add/Edit khata
│   │   │   ├── KhataDetail.js       # Khata details
│   │   │   ├── Reports.js           # Reports page
│   │   │   ├── Settings.js          # App settings
│   │   │   └── Profile.js           # User profile
│   │   │
│   │   ├── context/                 # React Context
│   │   │   └── AuthContext.js       # Auth state management
│   │   │
│   │   ├── utils/                   # Utility Functions
│   │   │   ├── axiosConfig.js       # API configuration
│   │   │   ├── formatters.js        # Data formatters
│   │   │   └── validators.js        # Form validators
│   │   │
│   │   ├── styles/                  # CSS Files
│   │   │   └── global.css           # Global styles
│   │   │
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   │
│   ├── .env                         # Environment variables
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json                 # Dependencies
│
├── .gitignore                       # Git ignore file
├── README.md                        # Documentation
└── LICENSE                          # MIT License
```

---

🚀 Installation

Prerequisites

Before you begin, ensure you have the following installed:

· Node.js (v16.0.0 or higher) - Download Node.js
· npm (v8.0.0 or higher) - Comes with Node.js
· MongoDB Atlas Account - Create Free Account
· Git (optional) - Download Git

📥 Step 1: Clone or Download Project

```bash
# Clone the repository
git clone https://github.com/yourusername/gaon-khata-manager.git

# Navigate to project folder
cd gaon-khata-manager
```

⚙️ Step 2: Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit server/.env with your details:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5000000
```

📌 Get MongoDB URI:

1. Go to MongoDB Atlas
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace <password> with your database password

Start backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on: http://localhost:5000

🎨 Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit client/.env:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

Start frontend server:

```bash
npm start
```

Frontend will start on: http://localhost:3000

🌱 Step 4: Seed Sample Data (Optional)

```bash
cd server
npm run seed
```

This will create:

· Admin Account:
  · Email: admin@gaonkhata.com
  · Password: admin123
· 5 Sample Persons with different villages
· 5 Sample Khata Entries with various types

---

📱 Usage Guide

First Time Setup

1. Register/Login:
   · Open http://localhost:3000
   · Click "रजिस्टर करें" to create account
   · Or use default admin credentials
2. Add People:
   · Go to "लोग" section
   · Click "नया व्यक्ति जोड़ें"
   · Fill Name, Father's Name, Village, Mobile
   · Save
3. Create Khata Entry:
   · Go to "हिसाब" section
   · Click "नई प्रविष्टि"
   · Select person and entry type
   · Enter amount and land details
   · Save
4. Track Payments:
   · Click on any entry
   · Use "भुगतान जोड़ें" button
   · Enter amount and payment mode
   · System auto-calculates remaining

Entry Types Explained

Type Hindi Description
Charha चरहा Land given on lease/rent
Batai बटाई Crop sharing arrangement
Patta पट्टा Land agreement/lease document
Bakaya बकाया Pending dues from previous years
Payment भुगतान Payment received entry

Dashboard Cards

Card Description
कुल लोग Total registered persons
कुल प्रविष्टियाँ Total khata entries
कुल बकाया Total pending amount
कुल भुगतान Total paid amount

---

🔌 API Documentation

Base URL

```
http://localhost:5000/api
```

Authentication Endpoints

Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "राम सिंह",
  "email": "ram@example.com",
  "password": "password123",
  "village": "रामपुर",
  "phone": "9876543210"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "राम सिंह",
    "email": "ram@example.com",
    "role": "user",
    "village": "रामपुर"
  }
}
```

Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gaonkhata.com",
  "password": "admin123"
}
```

Person Endpoints

Get All Persons

```http
GET /api/persons?search=राम&village=रामपुर&page=1&limit=20
Authorization: Bearer <token>
```

Create Person

```http
POST /api/persons
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "मोहन लाल",
  "fatherName": "गोपाल लाल",
  "village": "रामपुर",
  "mobile": "9876543212",
  "notes": "अच्छे किसान"
}
```

Get Single Person

```http
GET /api/persons/:id
Authorization: Bearer <token>
```

Update Person

```http
PUT /api/persons/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "mobile": "9999999999",
  "notes": "Updated notes"
}
```

Delete Person

```http
DELETE /api/persons/:id
Authorization: Bearer <token>
```

Khata Endpoints

Get All Entries

```http
GET /api/khata?year=2024&entryType=charha&status=pending&page=1
Authorization: Bearer <token>
```

Create Entry

```http
POST /api/khata
Authorization: Bearer <token>
Content-Type: application/json

{
  "person": "507f1f77bcf86cd799439011",
  "entryType": "charha",
  "date": "2024-01-15",
  "year": 2024,
  "landDetails": {
    "size": 2,
    "unit": "bigha",
    "khasraNumber": "KH-123",
    "landType": "sinchit"
  },
  "financials": {
    "rate": 50000,
    "rateUnit": "per_bigha",
    "totalAmount": 100000,
    "paidAmount": 75000,
    "paymentMode": "cash"
  },
  "description": "गेहूं की फसल"
}
```

Record Payment

```http
POST /api/khata/:id/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 25000,
  "paymentMode": "cash",
  "date": "2024-03-15",
  "notes": "Final payment"
}
```

Export PDF

```http
GET /api/khata/export/pdf?year=2024&personId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

Export Excel

```http
GET /api/khata/export/excel?year=2024&entryType=charha
Authorization: Bearer <token>
```

Dashboard Stats

```http
GET /api/khata/dashboard?year=2024
Authorization: Bearer <token>
```

Response Format

Success Response:

```json
{
  "success": true,
  "data": { ... },
  "count": 100,
  "page": 1,
  "totalPages": 5
}
```

Error Response:

```json
{
  "success": false,
  "error": "Error message in Hindi"
}
```

---

🚢 Deployment

Backend Deployment on Render

1. Push code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/gaon-khata-manager.git
git push -u origin main
```

1. Deploy on Render:
   · Go to Render.com
   · Click "New +" → "Web Service"
   · Connect your GitHub repository
   · Configure:
     · Name: gaon-khata-api
     · Root Directory: server
     · Runtime: Node
     · Build Command: npm install
     · Start Command: node index.js
   · Add Environment Variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=https://your-frontend.vercel.app
     ```
   · Click "Create Web Service"
2. Your API will be live at: https://gaon-khata-api.onrender.com

Frontend Deployment on Vercel

1. Go to Vercel.com
2. Import your GitHub repository
3. Configure project:
   · Framework Preset: Create React App
   · Root Directory: client
   · Build Command: npm run build
   · Output Directory: build
4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://gaon-khata-api.onrender.com/api
   REACT_APP_UPLOAD_URL=https://gaon-khata-api.onrender.com/uploads
   ```
5. Click "Deploy"
6. Your app will be live at: https://gaon-khata.vercel.app

Alternative: Deploy on GitHub Pages

1. Install gh-pages:

```bash
cd client
npm install --save-dev gh-pages
```

1. Add to client/package.json:

```json
{
  "homepage": "https://yourusername.github.io/gaon-khata-manager",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

1. Deploy:

```bash
npm run deploy
```

---

🗄️ MongoDB Setup Guide

Creating MongoDB Atlas Account (Free)

1. Go to MongoDB Atlas
2. Sign up with Google or email
3. Create Cluster:
   · Choose "FREE" shared cluster
   · Select cloud provider (AWS/GCP/Azure)
   · Choose region closest to you (Mumbai for India)
   · Click "Create Cluster" (takes 1-3 minutes)
4. Setup Database Access:
   · Go to "Database Access" in sidebar
   · Click "Add New Database User"
   · Username: admin
   · Password: your_secure_password
   · Select "Read and write to any database"
   · Click "Add User"
5. Network Access:
   · Go to "Network Access"
   · Click "Add IP Address"
   · Click "Allow Access from Anywhere"
   · Or add your IP for security
   · Click "Confirm"
6. Get Connection String:
   · Go to "Databases" → Click "Connect"
   · Choose "Connect your application"
   · Copy the connection string
   · Replace <password> with your database user password
   · It looks like: mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
7. Add database name:
   · After .mongodb.net/ add your database name
   · Full URI: mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/gaon-khata-manager?retryWrites=true&w=majority

---

🔧 Troubleshooting

Common Issues & Solutions

1. MongoDB Connection Error

```
Error: MongooseServerSelectionError
```

Solution:

· Check if MongoDB Atlas IP whitelist includes your IP
· Verify connection string in .env
· Ensure network access allows connections

2. CORS Error

```
Access to fetch blocked by CORS policy
```

Solution:

· Check CORS_ORIGIN in backend .env
· Make sure it matches your frontend URL
· For development, use CORS_ORIGIN=http://localhost:3000

3. JWT Token Expired

```
Error: jwt expired
```

Solution:

· Logout and login again
· Increase JWT_EXPIRE in .env (e.g., 90d)
· Check system time is correct

4. File Upload Too Large

```
Error: File too large
```

Solution:

· Increase MAX_FILE_SIZE in .env
· Check multer limits in middleware/upload.js
· Maximum recommended: 15MB for voice notes

5. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

Solution:

```bash
# Find process using port
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>

# Or change port in .env
PORT=5001
```

6. npm install fails

```
Error: EACCES: permission denied
```

Solution:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Install again
npm install

# If permission issue on Mac/Linux
sudo npm install
```

Performance Optimization

```bash
# For better performance with large datasets:

# 1. Add MongoDB indexes (already in models)
db.khataentries.createIndex({ user: 1, year: -1 })
db.khataentries.createIndex({ person: 1, date: -1 })

# 2. Enable compression
# In server/index.js add:
app.use(compression());

# 3. Use production build for React
cd client
npm run build
```

---

📊 Database Schema

User Collection

```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email
  password: String,       // Hashed password
  role: String,           // 'user' | 'admin' | 'sarpanch'
  village: String,        // User's village
  phone: String,          // Mobile number
  avatar: String,         // Profile photo URL
  isActive: Boolean,      // Account status
  lastLogin: Date,        // Last login timestamp
  createdAt: Date         // Registration date
}
```

Person Collection

```javascript
{
  user: ObjectId,         // Reference to User
  name: String,           // Person's name
  fatherName: String,     // Father's name
  village: String,        // Village name
  mobile: String,         // 10-digit mobile
  aadharNumber: String,   // Optional Aadhar
  address: String,        // Full address
  notes: String,          // Additional notes
  photo: String,          // Photo URL
  totalLand: Number,      // Total land in bigha
  documents: [{           // Attached documents
    title: String,
    fileUrl: String,
    uploadDate: Date
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

KhataEntry Collection

```javascript
{
  user: ObjectId,         // Reference to User
  person: ObjectId,       // Reference to Person
  entryType: String,      // 'charha'|'batai'|'patta'|'bakaya'
  date: Date,             // Entry date
  year: Number,           // Financial year
  season: String,         // 'rabi'|'kharif'|'zaid'
  landDetails: {
    size: Number,         // Land size
    unit: String,         // 'bigha'|'acre'|'hectare'
    khasraNumber: String, // Survey number
    landType: String      // 'sinchit'|'asinchit'
  },
  financials: {
    rate: Number,         // Rate per unit
    rateUnit: String,     // 'per_bigha'|'per_acre'
    totalAmount: Number,  // Total amount
    paidAmount: Number,   // Amount paid
    remainingAmount: Number, // Auto-calculated
    discount: Number,     // Any discount
    paymentMode: String   // 'cash'|'bank_transfer'|'upi'
  },
  description: String,    // Notes
  status: String,         // 'pending'|'partial'|'completed'
  receiptNumber: String,  // Auto-generated
  attachments: [{         // Files
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  voiceNotes: [{          // Voice recordings
    fileName: String,
    fileUrl: String,
    duration: Number
  }],
  isDeleted: Boolean,     // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

ActivityLog Collection

```javascript
{
  user: ObjectId,         // Who performed action
  action: String,         // 'CREATE'|'UPDATE'|'DELETE'|'LOGIN'
  entity: String,         // 'Person'|'KhataEntry'|'User'
  entityId: ObjectId,     // Affected document ID
  description: String,    // What happened
  metadata: Mixed,        // Additional data
  ipAddress: String,      // User's IP
  userAgent: String,      // Browser info
  createdAt: Date         // When happened
}
```

---

🎨 UI Screenshots

Dashboard

```
┌─────────────────────────────────────────┐
│  🌾 Gaon Khata Manager     [Profile] 👤 │
├─────────────────────────────────────────┤
│  डैशबोर्ड                    Year: 2024 │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 150  │ │ 450  │ │₹2.5L │ │₹5.8L │  │
│  │ लोग  │ │प्रविष्टि│ │बकाया │ │भुगतान│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  📊 Monthly Chart    🏘️ Village Wise   │
│  ┌─────────────────┐ ┌────────────────┐│
│  │    Chart Area   │ │   Pie Chart    ││
│  │                 │ │                ││
│  └─────────────────┘ └────────────────┘│
│                                         │
│  Recent Payments    Quick Actions       │
│  - Ram Singh ₹5000  [+ Add Person]     │
│  - Mohan Lal ₹3000  [₹ Add Khata]     │
│  - Sita Devi ₹2000  [📊 Reports]       │
└─────────────────────────────────────────┘
```

Person List

```
┌─────────────────────────────────────────┐
│  🔍 Search...              [+ New Person]│
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ 👤 राम सिंह                        │ │
│  │   पिता: श्याम सिंह | गाँव: रामपुर  │ │
│  │   📱 9876543211 | बकाया: ₹25,000   │ │
│  │   [View] [Edit] [Delete]          │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ 👤 मोहन लाल                        │ │
│  │   पिता: गोपाल | गाँव: रामपुर       │ │
│  │   📱 9876543212 | बकाया: ₹140,000  │ │
│  │   [View] [Edit] [Delete]          │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

🔒 Security Features

· Password Hashing: bcrypt with 10 salt rounds
· JWT Tokens: Signed with secret key, expires in 30 days
· Protected Routes: All API routes require authentication
· Input Validation: Server-side validation for all inputs
· Rate Limiting: Prevents brute force attacks
· CORS Protection: Whitelisted origins only
· File Upload Validation: Type and size restrictions
· SQL Injection Safe: Uses MongoDB/Mongoose (NoSQL)
· XSS Protection: Input sanitization
· Soft Delete: Data is never permanently lost

---

🌐 Browser Support

Browser Support
Chrome ✅ Latest 2 versions
Firefox ✅ Latest 2 versions
Safari ✅ Latest 2 versions
Edge ✅ Latest 2 versions
Opera ✅ Latest version
Chrome Android ✅ Fully supported
Safari iOS ✅ Fully supported
Samsung Internet ✅ Latest version

---

📱 Mobile App (PWA)

The application is a Progressive Web App (PWA):

Install on Android:

1. Open in Chrome
2. Tap menu (⋮) → "Add to Home Screen"
3. Name it "Gaon Khata"
4. Install

Install on iPhone:

1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Name it "Gaon Khata"
5. Add

---

🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

Code Style

· Use ESLint and Prettier
· Write comments in Hindi/English
· Follow React best practices
· Test before submitting

---

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2024 Gaon Khata Manager

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

👨‍💻 Author & Credits

Developed by: Your Name

· GitHub: @yourusername
· Email: your.email@example.com

Special Thanks:

· All Indian farmers who inspired this project
· MongoDB Atlas for free database hosting
· Vercel & Render for free deployment

---

📞 Support & Contact

Need help? Contact us:

· 📧 Email: support@gaonkhata.com
· 💬 WhatsApp: +91-XXXXXXXXXX
· 🐛 Bug Report: GitHub Issues
· 💡 Feature Request: GitHub Discussions

---

🙏 Acknowledgments

· React.js
· Node.js
· MongoDB
· Express.js
· Vercel
· Render
· Framer Motion
· React Icons

---

🚀 Roadmap

v1.0.0 (Current) ✅

· Basic CRUD operations
· Authentication system
· Dashboard with stats
· PDF/Excel export
· Search and filters

v1.1.0 (Upcoming) 🚧

· SMS notifications for payments
· WhatsApp sharing of receipts
· Offline mode support
· Multi-language support (10+ languages)
· Advanced charts and analytics

v2.0.0 (Future) 🔮

· Mobile app (React Native)
· Blockchain-based land records
· AI-powered crop predictions
· Government API integration
· Payment gateway integration

---

<div align="center">

🌾 Made with ❤️ for Indian Farmers 🌾

"डिजिटल इंडिया की ओर एक कदम"

---

⬆ Back to Top

</div>
```

---

This is the complete README.md file with full documentation. You can:

1. Copy the entire content above
2. Save it as README.md in your project root folder
3. Replace placeholder values like:
   · yourusername with your GitHub username
   · your.email@example.com with your email
   · Phone numbers if needed

The README includes:

· 📖 Complete project documentation
· 🚀 Installation guide
· 📱 Usage instructions
· 🔌 Full API documentation
· 🚢 Deployment guide
· 🗄️ MongoDB setup
· 🔧 Troubleshooting
· 📊 Database schemas
· 🎨 UI previews
· 🔒 Security features
· 📝 Contributing guide

Would you like me to provide any other specific files?
