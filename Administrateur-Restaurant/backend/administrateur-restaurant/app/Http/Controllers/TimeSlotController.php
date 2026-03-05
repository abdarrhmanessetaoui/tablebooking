<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class TimeSlotController extends Controller
{
    private function path(): string
    {
        return storage_path('app/private/restaurants/gusto/timeslots.json');
    }

    private array $defaults = [
        '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30', '22:00', '22:30',
        '23:00', '23:30'
    ];

    public function index()
    {
        $path = $this->path();

        $slots = File::exists($path)
            ? json_decode(File::get($path), true)
            : $this->defaults;

        return response()->json($slots);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'slots'   => 'required|array|min:1',
            'slots.*' => 'required|date_format:H:i',
        ]);

        $path = $this->path();

        File::ensureDirectoryExists(dirname($path));
        File::put($path, json_encode($data['slots']));

        return response()->json($data['slots']);
    }
}