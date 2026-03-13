<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RestaurantReservationController;
use App\Http\Controllers\BlockedDateController;
use App\Http\Controllers\TimeSlotController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TableController;


// ── Auth ──────────────────────────────────────────────────────────────────────
Route::post('/login',  [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// ── Public (client booking form) ─────────────────────────────────────────────
Route::get('/blocked-dates', [BlockedDateController::class, 'index']);
Route::get('/time-slots',    [TimeSlotController::class,   'index']);

// ── Protected ─────────────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', fn(Request $request) => response()->json($request->user()));

    // ── Dashboard ─────────────────────────────────────────────
    Route::get('/stats',   [RestaurantReservationController::class, 'stats']);
    Route::get('/reports', [RestaurantReservationController::class, 'reports']);

    // ── Reservations ──────────────────────────────────────────
    Route::get   ('/reservations/by-date',               [RestaurantReservationController::class, 'byDate']);
    Route::get   ('/restaurant/reservations',             [RestaurantReservationController::class, 'index']);
    Route::get   ('/restaurant/reservations/{id}',        [RestaurantReservationController::class, 'show']);
    Route::post  ('/restaurant/reservations',             [RestaurantReservationController::class, 'store']);
    Route::patch ('/restaurant/reservations/{id}/status', [RestaurantReservationController::class, 'updateStatus']);
    Route::delete('/restaurant/reservations/{id}',        [RestaurantReservationController::class, 'destroy']);

    // ── Restaurant settings ───────────────────────────────────
    Route::get('/restaurant/info',          [RestaurantReservationController::class, 'info']);
    Route::put('/restaurant/info',          [RestaurantReservationController::class, 'updateInfo']);
    Route::put('/restaurant/notifications', [RestaurantReservationController::class, 'updateNotifications']);
    Route::get('/restaurant/services',      [RestaurantReservationController::class, 'services']);

    // ── Blocked dates ─────────────────────────────────────────
    Route::get   ('/admin/blocked-dates',  [BlockedDateController::class, 'index']);
    Route::post  ('/blocked-dates',        [BlockedDateController::class, 'store']);
    Route::post  ('/blocked-dates/bulk',   [BlockedDateController::class, 'storeBulk']);
    Route::delete('/blocked-dates/{date}', [BlockedDateController::class, 'destroy']);

    // ── Time slots ────────────────────────────────────────────
    Route::put('/time-slots', [TimeSlotController::class, 'update']);

    // ── Services ──────────────────────────────────────────────
    Route::get   ('/services',       [ServiceController::class, 'index']);
    Route::post  ('/services',       [ServiceController::class, 'store']);
    Route::put   ('/services/{idx}', [ServiceController::class, 'update']);
    Route::delete('/services/{idx}', [ServiceController::class, 'destroy']);

    // ── Tables ────────────────────────────────────────────────
    Route::get   ('/tables',              [TableController::class, 'index']);
    Route::post  ('/tables',              [TableController::class, 'store']);
    Route::put   ('/tables/{idx}',        [TableController::class, 'update']);
    Route::delete('/tables/{idx}',        [TableController::class, 'destroy']);
    Route::patch ('/tables/{idx}/toggle', [TableController::class, 'toggleActive']);

});