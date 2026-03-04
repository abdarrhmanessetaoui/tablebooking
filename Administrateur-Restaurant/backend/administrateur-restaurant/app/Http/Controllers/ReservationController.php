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
    public function stats()
{
    return response()->json([
        'total'     => Reservation::count(),
        'today'     => Reservation::whereDate('date', today())->count(),
        'confirmed' => Reservation::where('status', 'confirmed')->count(),
        'pending'   => Reservation::where('status', 'pending')->count(),
        'cancelled' => Reservation::where('status', 'cancelled')->count(),
    ]);
}
public function byDate(Request $request)
{
    $date = $request->query('date', today()->toDateString());
    return response()->json(
        Reservation::whereDate('date', $date)->orderBy('time')->get()
    );
}
public function reports()
{
    $byHour = Reservation::selectRaw('HOUR(time) as hour, COUNT(*) as total')
        ->groupBy('hour')
        ->orderBy('hour')
        ->get()
        ->mapWithKeys(fn($r) => [$r->hour . ':00' => $r->total]);

    $byDay = Reservation::selectRaw('DAYOFWEEK(date) as day, COUNT(*) as total')
        ->groupBy('day')
        ->orderBy('day')
        ->get()
        ->mapWithKeys(fn($r) => [$r->day => $r->total]);

    $days = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return response()->json([
        'by_hour' => $byHour,
        'by_day'  => collect(range(1, 7))->mapWithKeys(fn($d) => [$days[$d] => $byDay[$d] ?? 0]),
    ]);
}
}