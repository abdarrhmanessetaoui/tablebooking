<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\BlockedDateController;
use App\Http\Controllers\TimeSlotController;

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::get('/blocked-dates', [BlockedDateController::class, 'index']);
Route::get('/time-slots', [TimeSlotController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn(Request $request) => response()->json($request->user()));
    Route::get('/stats', [ReservationController::class, 'stats']);
    Route::get('/reservations/by-date', [ReservationController::class, 'byDate']);
    Route::apiResource('reservations', ReservationController::class);
    Route::post('/blocked-dates', [BlockedDateController::class, 'store']);
    Route::delete('/blocked-dates/{blockedDate}', [BlockedDateController::class, 'destroy']);
    Route::put('/time-slots', [TimeSlotController::class, 'update']);
});