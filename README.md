![TableBooking Screenshot](https://raw.githubusercontent.com/abdarrhmanessetaoui/tablebooking/main/Administrateur-Restaurant/frontend/administrateur-restaurant/public/images/tablebooking.png)

# TableBooking - Restaurant Table Booking System

**TableBooking** is a full-stack application for managing restaurant reservations.  
It is built with **React** (frontend) and **Laravel** (backend) and includes features for administrators to handle **reservations, tables, services, reports, and more**.

---


![TableBooking Screenshot](https://raw.githubusercontent.com/abdarrhmanessetaoui/tablebooking/main/Administrateur-Restaurant/frontend/administrateur-restaurant/public/images/Capture1.PNG)



## Default Admin Login

To access the administrator dashboard, you can use the following credentials:

Email: admin@tablebooking.ma  
Password: password

After logging in, you will be able to manage reservations, tables, services, and view reports from the dashboard.



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

## 🚀 Quick Start Guide (For Beginners)

Follow these step-by-step instructions to clone and run this project on a new PC. 

### 1️⃣ Prerequisites
Before you begin, make sure you have installed:
- [Git](https://git-scm.com/downloads)
- [PHP](https://www.php.net/downloads) (v8.1 or higher) & [Composer](https://getcomposer.org/download/)
- [Node.js](https://nodejs.org/) (v16 or higher)

### 2️⃣ Clone the Repository
Open your terminal (or command prompt) and run:
```bash
git clone https://github.com/abdarrhmanessetaoui/tablebooking.git
cd tablebooking
```

### 3️⃣ Setup the Backend (Laravel)
Keep your terminal open and run the following commands one by one to start the API:

```bash
# 1. Navigate to the backend folder
cd Administrateur-Restaurant/backend/administrateur-restaurant

# 2. Install PHP dependencies
composer install

# 3. Create your environment configuration file
cp .env.example .env

# 4. Generate the application key
php artisan key:generate

# 5. Create a local SQLite database file
# (On Windows, you can just manually create an empty file named "database.sqlite" inside the "database" folder)
touch database/database.sqlite

# 6. Build the database and insert the default Admin user
php artisan migrate --seed

# 7. Start the backend server
php artisan serve
```
✅ Your backend is now running at **http://localhost:8000** (Keep this terminal open!)

### 4️⃣ Setup the Frontend (React)
Open a **NEW** terminal window, and run the following commands:

```bash
# 1. Navigate to the frontend folder
cd tablebooking/Administrateur-Restaurant/frontend/administrateur-restaurant

# 2. Install all frontend packages
npm install

# 3. Start the React frontend
npm start
```
✅ Your frontend is now running at **http://localhost:3000** (or http://localhost:5173 if using Vite).

---

## ⚙️ Configuration (Optional)

### Database Settings
By default, the steps above use **SQLite** which requires no installation. 
If you prefer to use **MySQL**, open the `.env` file in the backend folder and update:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tablebooking
DB_USERNAME=root
DB_PASSWORD=
```
*(Don't forget to run `php artisan migrate --seed` after changing your database!)*

### Email Settings
To enable password resets and email notifications, update the `.env` file in the backend with your SMTP credentials (e.g., a Gmail App Password):
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

---

## 📁 Project Structure

```text
tablebooking/
├─ Administrateur-Restaurant/
│  ├─ backend/  # Laravel PHP backend
│  │  ├─ app/           # Controllers, Models, Requests
│  │  ├─ database/      # SQLite database, Migrations, Seeders
│  │  └─ routes/        # api.php, web.php
│  └─ frontend/ # React JavaScript frontend
│     ├─ src/
│     │  ├─ components/ # Reusable UI components
│     │  ├─ pages/      # Dashboard, Reservations, Settings
│     │  └─ i18n.js     # Translations (EN, FR, AR)
└─ README.md
```

## 📝 License

Open-source, free to use and modify.
