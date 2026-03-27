![TableBooking Screenshot](https://raw.githubusercontent.com/abdarrhmanessetaoui/tablebooking/main/Administrateur-Restaurant/frontend/administrateur-restaurant/public/images/tablebooking.png)

# TableBooking - Restaurant Table Booking System

**TableBooking** is a full-stack application for managing restaurant reservations.  
It is built with **React** (frontend) and **Laravel** (backend) and includes features for administrators to handle **reservations, tables, services, reports, and more**.

---


![TableBooking Screenshot](https://raw.githubusercontent.com/abdarrhmanessetaoui/tablebooking/main/Administrateur-Restaurant/frontend/administrateur-restaurant/public/images/Capture.PNG)


## Features

### Frontend (React)
- **Dashboard**
  - Stats overview
  - Reservations summary
  - Charts for reports
- **Reservations Management**
  - Create, edit, cancel reservations
  - Assign tables
  - Mini calendar & time slots
- **Services & Tables Management**
  - Add, edit, delete services and tables
  - Table timeline management
- **Reports**
  - Bar charts, filters
  - Dashboard statistics
- **Blocked Dates & Calendar**
  - Manage blocked dates
  - Weekly/monthly views
- **Authentication**
  - Login / Logout
  - Email verification
  - Reset password via email
- **Multilingual Support**
  - English, French, Arabic
  - Right-to-left layout for Arabic

### Backend (Laravel)
- **REST API**
  - Supports all frontend operations
- **Authentication & Authorization**
  - Laravel Sanctum
  - Verified emails
- **Reservation Logic**
  - Create, cancel, assign tables
  - Auto-cancel expired reservations
- **Service & Table CRUD**
- **Blocked Dates Management**
- **Email Notifications**
  - Verification emails
  - Password reset
- **Database**
  - Migrations and seeders included
  - SQLite / MySQL supported
- **Queue & Session Management**
- **Testing**
  - Unit and Feature tests for auth, reservations, email

---

## Installation

### Backend
```bash
cd Administrateur-Restaurant/backend/administrateur-restaurant
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
````

### Frontend

```bash
cd Administrateur-Restaurant/frontend/administrateur-restaurant
npm install
npm run dev
```

Frontend runs at [http://localhost:5173](http://localhost:5173)
Backend runs at [http://localhost:8000](http://localhost:8000)

---

## Configuration

### Database

Update `.env` in backend with your credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=tablebooking
DB_USERNAME=root
DB_PASSWORD=
```

### Mail

Use SMTP or Mailtrap for email notifications. Example with Gmail App Password:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="youremail@gmail.com"
MAIL_FROM_NAME="Restaurant Admin"
```

### Frontend

* i18n translations in `frontend/src/i18n.js`
* Change default language or add new translations in `en`, `fr`, `ar`
* RTL layout is applied automatically for Arabic

---

## Project Structure

```text
tablebooking/
├─ Administrateur-Restaurant/
│  ├─ backend/  # Laravel backend
│  │  ├─ app/
│  │  │  ├─ Http/Controllers/       # All controllers including Auth, Reservations, Services
│  │  │  ├─ Models/                 # User, BlockedDate, WpForm, WpMessage
│  │  │  ├─ Console/Commands/       # CancelExpiredReservations
│  │  │  ├─ Requests/               # Form request validations
│  │  │  └─ Providers/              # AppServiceProvider
│  │  ├─ database/
│  │  │  ├─ migrations/             # Database schema
│  │  │  └─ seeders/                # Default data
│  │  ├─ routes/                    # api.php, web.php, auth.php
│  │  └─ config/                    # app.php, auth.php, mail.php, etc.
│  └─ frontend/                     # React frontend
│     ├─ src/
│     │  ├─ components/             # Dashboard, Calendar, Reservations, Tables, Services
│     │  ├─ hooks/                  # useReservations, useServices, useTables, useDashboard
│     │  ├─ pages/                  # Login, Dashboard, Reports, Reservations, Settings, Tables, Services
│     │  ├─ styles/                 # CSS & style tokens
│     │  ├─ i18n.js                  # Translation configuration
│     │  └─ utils/                  # Auth, PDF export, Brand utils
│     ├─ public/                     # favicon, images
│     ├─ package.json
│     └─ vite.config.js
└─ README.md
```

---

## Notes

* Fully responsive and mobile-friendly
* Multilingual with RTL for Arabic
* Backend & frontend fully integrated
* No changes to component structure or layout to maintain consistency
* Ready for deployment locally or on server

---

## License

Open-source, free to use and modify.
