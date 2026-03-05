<?php

namespace App\Http\Controllers;

use App\Models\BlockedDate;
use Illuminate\Http\Request;

class BlockedDateController extends Controller
{
    public function index()
    {
        return response()->json(BlockedDate::orderBy('date')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'   => 'required|date|unique:blocked_dates,date',
            'reason' => 'nullable|string|max:255',
        ]);

        return response()->json(BlockedDate::create($data), 201);
    }

    public function destroy(BlockedDate $blockedDate)
    {
        $blockedDate->delete();
        return response()->json(['message' => 'Date unblocked']);
    }
}