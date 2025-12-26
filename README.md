# 🎉 Freshers QR System  
### Smart Entry & Food Verification System

A **QR-based Freshers Party Management System** built using **HTML, CSS, JavaScript, and Supabase** to manage **registrations, payments, entry verification, and food distribution** in a digital and secure way.

---

## 📌 Project Overview

The **Freshers QR System** is designed to replace manual registration and checking during a college freshers party.  
It provides a **complete digital flow** from registration to entry and food verification using **QR codes**.

This system helps in:
- Reducing manual work  
- Preventing duplicate entry  
- Managing food distribution properly  
- Tracking payments and attendance  
- Providing real-time statistics to organizers  

---

## 🚀 Features

### 👤 Registration
- Separate registration for **Junior** and **Senior**
- Stores participant details securely in the database
- Prevents duplicate registration using **Registration Number**

### 🎟 QR Pass Generation
- Automatic QR code generation after registration
- QR contains encoded participant details
- Downloadable digital pass

### 💳 Payment Management
- Manual payment verification using **Transaction ID**
- Updates payment status in database

### 🚪 Gate Entry Verification
- QR scanning at entry gate
- Prevents duplicate entry
- Allows only approved registrations

### 🍽 Food Distribution
- QR-based food verification
- Ensures food is issued only once per participant

### 📊 Admin Dashboard
- Total registrations
- Freshers vs Seniors count
- Payment status
- Entry confirmed count
- Food redeemed count

---

## 🛠 Technology Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla)

### Backend / Database
- Supabase (PostgreSQL)
- Supabase Authentication (Anon Key)
- Row Level Security (RLS)

### Libraries Used
- QRCode.js
- Html5-Qrcode
- Supabase JS SDK

---

## 📂 Project File Structure

frontend/
│
├── js/
│ ├── config.js # Supabase credentials (ignored by git)
│ ├── config.example.js # Example config file
│ ├── utils.js # Helper functions
│ ├── utils-supabase.js # Supabase logic
│ ├── form.js # Registration logic
│ ├── qr.js # QR generation
│ ├── dashboard.js # Admin dashboard logic
│ ├── gate-scan.js # Gate QR scanner
│ └── food-scan.js # Food QR scanner
│
├── index.html
├── junior.html
├── senior.html
├── payment.html
├── success.html
├── dashboard.html
├── gate-scanner.html
└── food-scanner.html


---

## 🗄 Database Design

### Tables Used
- `registrations`
- `payment_transactions`

### Key Fields
- `reg_no` (unique)
- `payment_status`
- `entry_scanned`
- `food_scanned`
- `transaction_id`

Row Level Security (RLS) is enabled to safely allow frontend access.

---

## 🔐 Security Measures

- Supabase Anon Key stored in `config.js`
- `config.js` ignored using `.gitignore`
- RLS enabled on all tables
- No credentials pushed to GitHub

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>

2️⃣ Setup Supabase

Create a new Supabase project

Run the provided SQL file in Supabase SQL Editor

Enable Row Level Security (RLS)

3️⃣ Configure Credentials

Create frontend/js/config.js:

window.APP_CONFIG = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-key"
};

4️⃣ Run Project

Open index.html in browser
OR

Deploy using Vercel / Netlify

🌐 Deployment

This project can be deployed on:

Vercel

Netlify

GitHub Pages (static hosting)

🎓 Use Cases

College Freshers Party

Event entry management

Food coupon system

QR-based attendance system

📈 Future Improvements

Admin authentication

Automatic payment gateway integration

Role-based access control

Analytics & charts

Backend API using Node.js or Java Spring Boot

👨‍💻 Developer

Santanu Barik
BCA Student
Aspiring Cloud & Full Stack Developer

⭐ Conclusion

The Freshers QR System is a complete, real-world project demonstrating:

Frontend + Database integration

QR-based verification

Secure cloud backend usage

This project is suitable for:

College submission

Internship portfolio

Hackathons and demos