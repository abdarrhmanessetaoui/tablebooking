<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TimeSlotController extends Controller
{
    private string $path = 'restaurants/gusto/timeslots.json';

    private array $defaults = [
        '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30', '22:00', '22:30',
        '23:00', '23:30'
    ];

    public function index()
    {
        $slots = Storage::exists($this->path)
            ? json_decode(Storage::get($this->path), true)
            : $this->defaults;

        return response()->json($slots);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'slots'   => 'required|array|min:1',
            'slots.*' => 'required|date_format:H:i',
        ]);

        Storage::ensureDirectoryExists('restaurants/gusto');
        Storage::put($this->path, json_encode($data['slots']));

        return response()->json($data['slots']);
    }
}