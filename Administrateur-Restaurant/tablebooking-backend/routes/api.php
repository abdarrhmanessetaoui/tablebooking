<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\DashboardController;

// Public authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes (authenticated users only)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard routes (for admins)
    Route::middleware('role:admin,super_admin')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/restaurants/{restaurant}/stats', [DashboardController::class, 'restaurantStats']);
    });

    // Restaurant routes
    Route::apiResource('restaurants', RestaurantController::class);

    // Reservation routes
    Route::prefix('restaurants/{restaurant}')->group(function () {
        Route::apiResource('reservations', ReservationController::class);
    });
});