<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(
            Reservation::orderBy('date', 'desc')->orderBy('time', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'nullable|email|max:255',
            'phone'  => 'nullable|string|max:20',
            'date'   => 'required|date',
            'time'   => 'required',
            'guests' => 'required|integer|min:1',
            'status' => 'in:pending,confirmed,cancelled',
            'notes'  => 'nullable|string',
        ]);

        $reservation = Reservation::create($data);

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'email'  => 'nullable|email|max:255',
            'phone'  => 'nullable|string|max:20',
            'date'   => 'sometimes|date',
            'time'   => 'sometimes',
            'guests' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled',
            'notes'  => 'nullable|string',
        ]);

        $reservation->update($data);

        return response()->json($reservation);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();

        return response()->json(['message' => 'Reservation deleted']);
    }
}