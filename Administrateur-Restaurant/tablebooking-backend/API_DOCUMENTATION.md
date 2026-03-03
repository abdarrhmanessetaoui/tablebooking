# Table Booking System - API Documentation

## Overview
Complete REST API for a multi-role table booking system with Laravel 12 and Sanctum authentication.

## Roles
- **super_admin**: Full system access, can manage all restaurants and reservations
- **admin**: Restaurant owner, can manage only their own restaurant and reservations
- **client**: Can make reservations at any restaurant

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require a valid Sanctum token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "client"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "created_at": "2026-03-03T12:00:00Z",
      "updated_at": "2026-03-03T12:00:00Z"
    },
    "token": "1|abcdef123456..."
  }
}
```

### Login User
**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client"
    },
    "token": "1|abcdef123456..."
  }
}
```

---

## Protected Endpoints (Require Authentication)

### Get Current User
**GET** `/auth/me`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

### Logout
**POST** `/auth/logout`

Response (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Restaurant Endpoints

### Get All Restaurants
**GET** `/restaurants`

- **Admin users**: See only their own restaurant
- **Super Admin**: See all restaurants
- **Client**: See all restaurants (read-only)

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "name": "La Bella Italia",
      "city": "Paris",
      "slug": "la-bella-italia-paris",
      "address": "123 Rue de Rivoli",
      "phone": "+33123456789",
      "email": "info@labellaItalia.com",
      "description": "Italian restaurant",
      "cuisine_type": "Italian",
      "capacity": 50,
      "opening_time": "11:00",
      "closing_time": "23:00",
      "created_at": "2026-03-03T12:00:00Z",
      "updated_at": "2026-03-03T12:00:00Z"
    }
  ]
}
```

### Create Restaurant
**POST** `/restaurants`

*Requires: super_admin role*

Request body:
```json
{
  "user_id": 2,
  "name": "La Bella Italia",
  "city": "Paris",
  "address": "123 Rue de Rivoli",
  "phone": "+33123456789",
  "email": "info@labellaItalia.com",
  "description": "Authentic Italian cuisine",
  "cuisine_type": "Italian",
  "capacity": 50,
  "opening_time": "11:00",
  "closing_time": "23:00"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    "name": "La Bella Italia",
    ...
  }
}
```

### Get Restaurant
**GET** `/restaurants/{id}`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 2,
    "name": "La Bella Italia",
    "admin": {
      "id": 2,
      "name": "Marco Rossi",
      "email": "marco@example.com"
    },
    "reservations": [
      {
        "id": 1,
        "date": "2026-03-10",
        "time": "19:00",
        "guests": 4,
        "status": "confirmed"
      }
    ],
    ...
  }
}
```

### Update Restaurant
**PUT/PATCH** `/restaurants/{id}`

*Requires: Owner (admin) or super_admin*

Request body (partial update):
```json
{
  "name": "La Bella Italia - Updated",
  "capacity": 60,
  "closing_time": "00:00"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": { ... }
}
```

### Delete Restaurant
**DELETE** `/restaurants/{id}`

*Requires: Owner (admin) or super_admin*

Response (200):
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

---

## Reservation Endpoints

### Get All Reservations for Restaurant
**GET** `/restaurants/{restaurant_id}/reservations`

*Requires: Restaurant admin or super_admin*

Query parameters:
- `status`: Filter by status (pending, confirmed, cancelled)
- `date`: Filter by date (YYYY-MM-DD)

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "restaurant_id": 1,
      "client_name": "Jean Dupont",
      "client_phone": "+33612345678",
      "date": "2026-03-10",
      "time": "19:00",
      "guests": 4,
      "status": "confirmed",
      "created_at": "2026-03-03T10:00:00Z",
      "updated_at": "2026-03-03T10:00:00Z"
    }
  ]
}
```

### Create Reservation
**POST** `/restaurants/{restaurant_id}/reservations`

*Anyone authenticated can create*

Request body:
```json
{
  "client_name": "Jean Dupont",
  "client_phone": "+33612345678",
  "date": "2026-03-10",
  "time": "19:00",
  "guests": 4,
  "status": "pending"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "client_name": "Jean Dupont",
    ...
  }
}
```

### Get Specific Reservation
**GET** `/restaurants/{restaurant_id}/reservations/{id}`

Response (200):
```json
{
  "success": true,
  "data": { ... }
}
```

### Update Reservation
**PUT/PATCH** `/restaurants/{restaurant_id}/reservations/{id}`

*Requires: Restaurant admin or super_admin*

Request body:
```json
{
  "status": "confirmed",
  "guests": 5
}
```

Response (200):
```json
{
  "success": true,
  "message": "Reservation updated successfully",
  "data": { ... }
}
```

### Delete Reservation
**DELETE** `/restaurants/{restaurant_id}/reservations/{id}`

*Requires: Restaurant admin or super_admin*

Response (200):
```json
{
  "success": true,
  "message": "Reservation deleted successfully"
}
```

---

## Dashboard Endpoints

### Get Overall Dashboard Statistics
**GET** `/dashboard/stats`

*Requires: admin or super_admin role*

Response (200):
```json
{
  "success": true,
  "data": {
    "total_restaurants": 5,
    "total_reservations": 150,
    "pending_reservations": 20,
    "confirmed_reservations": 120,
    "cancelled_reservations": 10,
    "daily_stats": [
      {
        "date": "2026-03-03",
        "total": 15,
        "confirmed": 12,
        "pending": 2,
        "cancelled": 1,
        "total_guests": 52
      }
    ],
    "reservation_by_status": {
      "confirmed": 120,
      "pending": 20,
      "cancelled": 10
    }
  }
}
```

### Get Restaurant-Specific Statistics
**GET** `/restaurants/{restaurant_id}/stats`

*Requires: Restaurant admin or super_admin*

Response (200):
```json
{
  "success": true,
  "data": {
    "restaurant_name": "La Bella Italia",
    "total_reservations": 50,
    "pending_reservations": 5,
    "confirmed_reservations": 40,
    "cancelled_reservations": 5,
    "average_guests_per_reservation": 4.2,
    "daily_stats": [
      {
        "date": "2026-03-03",
        "total": 5,
        "confirmed": 4,
        "pending": 1,
        "cancelled": 0,
        "total_guests": 18
      }
    ],
    "peak_hours": [
      {
        "time": "19:00",
        "reservations": 12,
        "total_guests": 45
      }
    ]
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login first."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to create restaurant",
  "error": "Error details..."
}
```

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Restaurants (with token)
```bash
curl -X GET http://localhost:8000/api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Reservation
```bash
curl -X POST http://localhost:8000/api/restaurants/1/reservations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Jean Dupont",
    "client_phone": "+33612345678",
    "date": "2026-03-10",
    "time": "19:00",
    "guests": 4
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
