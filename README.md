Freshers Party 2025 - Event Management System 🎉
A comprehensive event management system for college freshers party with registration, QR-based entry, food management, and real-time dashboard.

🌟 Live Demo
Frontend: https://freshers2025.netlify.app (Deploy your own)

Backend API: https://nwrqnsxfzhfcjrqsfopu.supabase.co

Admin Dashboard: /dashboard.html

📋 Features
🎫 Registration System
Separate registration for Juniors (Freshers) and Seniors

Automatic QR code generation for each attendee

Email and registration number validation

Food preference selection (Vegetarian/Non-Vegetarian)

💳 Payment Integration
UPI QR code payment for seniors

Transaction ID verification

Automatic status updates

Payment confirmation emails

🚪 Smart Entry Management
QR code scanning at gate entry

Real-time attendance tracking

Duplicate entry prevention

Instant verification feedback

🍽️ Food Management
QR-based food coupon redemption

Food preference tracking

Prevent duplicate food claims

Real-time food counter updates

📊 Admin Dashboard
Real-time statistics and analytics

Registration trends visualization

Entry and food redemption monitoring

Export functionality for data

🏗️ Tech Stack
Frontend
HTML5, CSS3, JavaScript - Core web technologies

Chart.js - Data visualization

QRCode.js - QR code generation

Html5Qrcode - QR code scanning

Font Awesome - Icons

Backend & Database
Supabase - Backend as a Service

PostgreSQL - Relational database

Row Level Security - Data protection

REST API - Seamless communication

🚀 Quick Start
Prerequisites
Modern web browser (Chrome, Firefox, Edge)

Local server (VS Code Live Server, XAMPP, etc.)

Supabase account (free tier)

Installation
Clone the repository

bash
git clone https://github.com/yourusername/freshers2025.git
cd freshers2025
Set up Supabase Database

Go to Supabase and create account

Create new project: freshers2025

Go to SQL Editor and run the SQL script from setup/supabase-setup.sql

Note your Project URL and Anon Key

Configure API Keys

Edit js/utils-supabase.js:

javascript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key-here";
Run the application

Use VS Code Live Server extension

Or any local server (XAMPP, WAMP, etc.)

Open index.html in your browser

📁 Project Structure
text
freshers2025/
├── index.html              # Homepage
├── junior.html            # Junior registration
├── senior.html            # Senior registration
├── payment.html           # Payment gateway
├── success.html           # Success page
├── dashboard.html         # Admin dashboard
├── gate-scanner.html      # Entry scanner
├── food-scanner.html      # Food scanner
├── js/
│   ├── utils-supabase.js  # Supabase API functions
│   ├── qr.js              # QR code generation
│   ├── form.js            # Form handling
│   └── [other scripts]
├── assets/                # Images, icons
└── README.md              # This file
🔧 Configuration
Database Setup
Run the SQL script in Supabase SQL Editor to create:

registrations table - Attendee information

payment_transactions table - Payment records

admin_users table - Admin credentials

dashboard_stats view - Analytics view

Admin Credentials
Username: Santa

Password: santa@2414

CORS Configuration
In Supabase Dashboard → Authentication → URL Configuration, add:

http://localhost:5500 (for development)

Your deployed frontend URL (for production)

📊 API Endpoints
Registration
POST /api/register - Create new registration

GET /api/getPass/{regNo} - Get registration details

Payment
POST /api/verifyPayment - Verify payment transaction

Scanning
POST /api/verifyEntry - Verify entry QR code

POST /api/verifyFood - Verify food QR code

Dashboard
GET /api/stats - Get dashboard statistics

POST /api/adminLogin - Admin authentication

🎯 Usage Guide
For Students
Visit homepage and select registration type

Fill in details and submit

For seniors: Complete payment process

Download/print QR ticket

Present QR code at event entry

For Event Organizers
Use dashboard.html for admin login

Monitor real-time statistics

Use gate-scanner.html for entry management

Use food-scanner.html for food distribution

For Developers
javascript
// Example API call
const result = await window.freshersApp.apiPost({
    action: 'register',
    data: {
        name: 'John Doe',
        regNo: 'REG001',
        branch: 'CSE',
        section: 'A',
        type: 'Junior',
        food: 'Veg',
        email: 'john@example.com'
    }
});
🚀 Deployment
Frontend Deployment (Netlify)
Push code to GitHub repository

Connect Netlify to your repository

Configure build settings:

Build command: (leave empty for static site)

Publish directory: .

Add environment variables if needed

Frontend Deployment (Vercel)
bash
npm install -g vercel
vercel
Supabase Configuration
Enable Row Level Security

Set up proper CORS policies

Monitor usage in Supabase dashboard

🔒 Security Features
Row Level Security - Data access control

Input Validation - Client-side validation

QR Code Encryption - Secure ticket generation

Session Management - Admin session handling

Rate Limiting - API request limiting

📱 Browser Support
Chrome 60+

Firefox 55+

Safari 11+

Edge 79+

Opera 47+

🐛 Troubleshooting
Common Issues
CORS Errors

Check Supabase CORS configuration

Verify correct API URL and key

Clear browser cache

Database Connection

Verify Supabase project is active

Check internet connection

Confirm tables exist

QR Scanner Issues

Allow camera permissions

Use HTTPS in production

Test in different browsers

Payment Verification

Check transaction ID format

Verify payment status in database

Ensure registration exists

Debug Mode
Enable console logging in utils-supabase.js:

javascript
console.log('API Call:', data);
📈 Performance
Load Time: < 3 seconds

API Response: < 500ms

Database Queries: Optimized with indexes

Assets: Minified and compressed

🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Supabase for amazing backend service

Chart.js for data visualization

QRCode.js for QR generation

All contributors and testers

📞 Support
Documentation: Project Wiki

Issues: GitHub Issues

Email: support@example.com

🚧 Roadmap
Mobile app development

SMS notifications

Photo booth integration

Live streaming features

Multi-event management

Advanced analytics

Bulk registration import

Certificate generation

