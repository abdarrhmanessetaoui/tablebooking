<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RestaurantReservationController;
use App\Http\Controllers\BlockedDateController;
use App\Http\Controllers\TimeSlotController;

Route::post('/login',  [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Public routes — client form reads these
Route::get('/blocked-dates', [BlockedDateController::class, 'index']);
Route::get('/time-slots',    [TimeSlotController::class,   'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::get('/stats',                                      [RestaurantReservationController::class, 'stats']);
    Route::get('/reservations/by-date',                       [RestaurantReservationController::class, 'byDate']);
    Route::get('/reports',                                    [RestaurantReservationController::class, 'reports']);
    Route::get('/restaurant/services',                           [RestaurantReservationController::class, 'services']);
    Route::get('/restaurant/info',                            [RestaurantReservationController::class, 'info']);
    Route::get('/restaurant/reservations',                    [RestaurantReservationController::class, 'index']);
    Route::get('/restaurant/reservations/{id}',               [RestaurantReservationController::class, 'show']);
    Route::post('/restaurant/reservations',                   [RestaurantReservationController::class, 'store']);
    Route::patch('/restaurant/reservations/{id}/status',      [RestaurantReservationController::class, 'updateStatus']);
    Route::delete('/restaurant/reservations/{id}',            [RestaurantReservationController::class, 'destroy']);
    Route::post('/blocked-dates',                             [BlockedDateController::class, 'store']);
    Route::delete('/blocked-dates/{blockedDate}',             [BlockedDateController::class, 'destroy']);
    Route::put('/time-slots',                                 [TimeSlotController::class,   'update']);
});