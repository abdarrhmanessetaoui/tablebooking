<?php

namespace App\Http\Controllers\Api;

use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RestaurantController
{
    /**
     * Get all restaurants (admin sees only their own).
     */
    public function index(Request $request): JsonResponse
    {
        try {
            if ($request->user()->role === 'super_admin') {
                $restaurants = Restaurant::with('admin')->get();
            } else {
                $restaurants = Restaurant::where('user_id', $request->user()->id)
                    ->with('admin')
                    ->get();
            }

            return response()->json([
                'success' => true,
                'data' => $restaurants,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve restaurants',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new restaurant (super_admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email',
            'description' => 'nullable|string',
            'cuisine_type' => 'nullable|string|max:100',
            'capacity' => 'required|integer|min:1',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $restaurant = Restaurant::create([
                'user_id' => $request->user_id,
                'name' => $request->name,
                'city' => $request->city,
                'slug' => Str::slug($request->name . '-' . $request->city),
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
                'description' => $request->description,
                'cuisine_type' => $request->cuisine_type,
                'capacity' => $request->capacity,
                'opening_time' => $request->opening_time,
                'closing_time' => $request->closing_time,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Restaurant created successfully',
                'data' => $restaurant,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create restaurant',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific restaurant.
     */
    public function show(Request $request, Restaurant $restaurant): JsonResponse
    {
        try {
            // Check authorization
            if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied',
                ], 403);
            }

            $restaurant->load(['admin', 'reservations']);

            return response()->json([
                'success' => true,
                'data' => $restaurant,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve restaurant',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a restaurant.
     */
    public function update(Request $request, Restaurant $restaurant): JsonResponse
    {
        // Check authorization
        if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email',
            'description' => 'nullable|string',
            'cuisine_type' => 'nullable|string|max:100',
            'capacity' => 'sometimes|integer|min:1',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $restaurant->update($request->only([
                'name', 'city', 'address', 'phone', 'email', 'description',
                'cuisine_type', 'capacity', 'opening_time', 'closing_time'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Restaurant updated successfully',
                'data' => $restaurant,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update restaurant',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a restaurant.
     */
    public function destroy(Request $request, Restaurant $restaurant): JsonResponse
    {
        // Check authorization
        if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied',
            ], 403);
        }

        try {
            $restaurant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Restaurant deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete restaurant',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
