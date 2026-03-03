<?php

namespace App\Http\Controllers\Api;

use App\Models\Reservation;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController
{
    /**
     * Get all reservations for a restaurant (admin only).
     */
    public function index(Request $request, Restaurant $restaurant): JsonResponse
    {
        try {
            // Check authorization
            if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied',
                ], 403);
            }

            $reservations = Reservation::where('restaurant_id', $restaurant->id)
                ->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reservations,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve reservations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new reservation (clients and admins).
     */
    public function store(Request $request, Restaurant $restaurant): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guests' => 'required|integer|min:1|max:' . $restaurant->capacity,
            'status' => 'sometimes|in:pending,confirmed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $reservation = Reservation::create([
                'restaurant_id' => $restaurant->id,
                'client_name' => $request->client_name,
                'client_phone' => $request->client_phone,
                'date' => $request->date,
                'time' => $request->time,
                'guests' => $request->guests,
                'status' => $request->status ?? 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'data' => $reservation,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific reservation.
     */
    public function show(Request $request, Restaurant $restaurant, Reservation $reservation): JsonResponse
    {
        try {
            // Check authorization
            if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied',
                ], 403);
            }

            if ($reservation->restaurant_id !== $restaurant->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $reservation,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve reservation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a reservation.
     */
    public function update(Request $request, Restaurant $restaurant, Reservation $reservation): JsonResponse
    {
        // Check authorization
        if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
            ], 403);
        }

        if ($reservation->restaurant_id !== $restaurant->id) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'client_name' => 'sometimes|string|max:255',
            'client_phone' => 'sometimes|string|max:20',
            'date' => 'sometimes|date',
            'time' => 'sometimes|date_format:H:i',
            'guests' => 'sometimes|integer|min:1|max:' . $restaurant->capacity,
            'status' => 'sometimes|in:pending,confirmed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $reservation->update($request->only([
                'client_name', 'client_phone', 'date', 'time', 'guests', 'status'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Reservation updated successfully',
                'data' => $reservation,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update reservation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a reservation.
     */
    public function destroy(Request $request, Restaurant $restaurant, Reservation $reservation): JsonResponse
    {
        // Check authorization
        if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
            ], 403);
        }

        if ($reservation->restaurant_id !== $restaurant->id) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found',
            ], 404);
        }

        try {
            $reservation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Reservation deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete reservation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
