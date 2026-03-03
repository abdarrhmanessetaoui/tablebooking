<?php

namespace App\Http\Controllers\Api;

use App\Models\Reservation;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController
{
    /**
     * Get admin dashboard statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Get admin's restaurants
            if ($user->role === 'super_admin') {
                $restaurants = Restaurant::all();
            } else {
                $restaurants = Restaurant::where('user_id', $user->id)->get();
            }

            $restaurantIds = $restaurants->pluck('id')->toArray();

            if (empty($restaurantIds)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'total_restaurants' => 0,
                        'total_reservations' => 0,
                        'pending_reservations' => 0,
                        'confirmed_reservations' => 0,
                        'cancelled_reservations' => 0,
                        'daily_stats' => [],
                        'reservation_by_status' => [],
                    ],
                ], 200);
            }

            // Total stats
            $totalReservations = Reservation::whereIn('restaurant_id', $restaurantIds)->count();
            $pendingReservations = Reservation::whereIn('restaurant_id', $restaurantIds)
                ->where('status', 'pending')
                ->count();
            $confirmedReservations = Reservation::whereIn('restaurant_id', $restaurantIds)
                ->where('status', 'confirmed')
                ->count();
            $cancelledReservations = Reservation::whereIn('restaurant_id', $restaurantIds)
                ->where('status', 'cancelled')
                ->count();

            // Daily statistics for the last 30 days
            $dailyStats = Reservation::whereIn('restaurant_id', $restaurantIds)
                ->where('date', '>=', now()->subDays(30)->toDateString())
                ->select('date', DB::raw('COUNT(*) as total'), 
                    DB::raw("SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed"),
                    DB::raw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending"),
                    DB::raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled"),
                    DB::raw('SUM(guests) as total_guests'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->get();

            // Reservation by status
            $reservationByStatus = Reservation::whereIn('restaurant_id', $restaurantIds)
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get()
                ->keyBy('status')
                ->map->count;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_restaurants' => count($restaurants),
                    'total_reservations' => $totalReservations,
                    'pending_reservations' => $pendingReservations,
                    'confirmed_reservations' => $confirmedReservations,
                    'cancelled_reservations' => $cancelledReservations,
                    'daily_stats' => $dailyStats,
                    'reservation_by_status' => $reservationByStatus,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics for a specific restaurant.
     */
    public function restaurantStats(Request $request, Restaurant $restaurant): JsonResponse
    {
        try {
            // Check authorization
            if ($request->user()->role === 'admin' && $restaurant->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied',
                ], 403);
            }

            // Total stats for this restaurant
            $totalReservations = Reservation::where('restaurant_id', $restaurant->id)->count();
            $pendingReservations = Reservation::where('restaurant_id', $restaurant->id)
                ->where('status', 'pending')
                ->count();
            $confirmedReservations = Reservation::where('restaurant_id', $restaurant->id)
                ->where('status', 'confirmed')
                ->count();
            $cancelledReservations = Reservation::where('restaurant_id', $restaurant->id)
                ->where('status', 'cancelled')
                ->count();

            // Daily statistics
            $dailyStats = Reservation::where('restaurant_id', $restaurant->id)
                ->where('date', '>=', now()->subDays(30)->toDateString())
                ->select('date', DB::raw('COUNT(*) as total'),
                    DB::raw("SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed"),
                    DB::raw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending"),
                    DB::raw("SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled"),
                    DB::raw('SUM(guests) as total_guests'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->get();

            // Peak hours
            $peakHours = Reservation::where('restaurant_id', $restaurant->id)
                ->select('time', DB::raw('COUNT(*) as reservations'), DB::raw('SUM(guests) as total_guests'))
                ->groupBy('time')
                ->orderBy('reservations', 'desc')
                ->limit(5)
                ->get();

            // Average guests per reservation
            $avgGuests = Reservation::where('restaurant_id', $restaurant->id)
                ->avg('guests');

            return response()->json([
                'success' => true,
                'data' => [
                    'restaurant_name' => $restaurant->name,
                    'total_reservations' => $totalReservations,
                    'pending_reservations' => $pendingReservations,
                    'confirmed_reservations' => $confirmedReservations,
                    'cancelled_reservations' => $cancelledReservations,
                    'average_guests_per_reservation' => round($avgGuests, 2),
                    'daily_stats' => $dailyStats,
                    'peak_hours' => $peakHours,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve restaurant statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
