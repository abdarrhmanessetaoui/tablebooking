<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RestaurantReservationController;
use App\Http\Controllers\BlockedDateController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TableController;

Route::post('/login',  [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Public routes — client form reads these (with optional ?form_id=X)
Route::get('/blocked-dates', [BlockedDateController::class, 'index']);
Route::get('/time-slots',    [TimeSlotController::class,   'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::get('/stats',                                      [RestaurantReservationController::class, 'stats']);
    Route::get('/reservations/by-date',                       [RestaurantReservationController::class, 'byDate']);
    Route::get('/reports',                                    [RestaurantReservationController::class, 'reports']);
    Route::get('/restaurant/services',                        [RestaurantReservationController::class, 'services']);
    Route::get('/restaurant/info',                            [RestaurantReservationController::class, 'info']);
    Route::get('/restaurant/reservations',                    [RestaurantReservationController::class, 'index']);
    Route::get('/restaurant/reservations/{id}',               [RestaurantReservationController::class, 'show']);
    Route::post('/restaurant/reservations',                   [RestaurantReservationController::class, 'store']);
    Route::patch('/restaurant/reservations/{id}/status',      [RestaurantReservationController::class, 'updateStatus']);
    Route::delete('/restaurant/reservations/{id}',            [RestaurantReservationController::class, 'destroy']);
    Route::get('/admin/blocked-dates',                        [BlockedDateController::class, 'index']);
    Route::post('/blocked-dates',                             [BlockedDateController::class, 'store']);
    Route::delete('/blocked-dates/{date}',                    [BlockedDateController::class, 'destroy']);
    Route::post('/blocked-dates/bulk', [BlockedDateController::class, 'storeBulk']);
    Route::put('/time-slots',                                 [TimeSlotController::class,   'update']);
    Route::get   ('/services',         [ServiceController::class, 'index']);
    Route::post  ('/services',         [ServiceController::class, 'store']);
    Route::put   ('/services/{idx}',   [ServiceController::class, 'update']);
    Route::delete('/services/{idx}',   [ServiceController::class, 'destroy']);
    Route::get   ('/tables',              [TableController::class, 'index']);
    Route::post  ('/tables',              [TableController::class, 'store']);
    Route::put   ('/tables/{idx}',        [TableController::class, 'update']);
    Route::delete('/tables/{idx}',        [TableController::class, 'destroy']);
    Route::patch ('/tables/{idx}/toggle', [TableController::class, 'toggleActive']);
    Route::put('/restaurant/info',          [RestaurantReservationController::class, 'updateInfo']);
    Route::put('/restaurant/notifications', [RestaurantReservationController::class, 'updateNotifications']);
});