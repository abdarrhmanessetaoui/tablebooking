<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    private function getFormStructure()
    {
        $row = DB::table('wpjn_cpappbk_forms')->where('id', 13)->first();
        if (!$row) return null;
        return json_decode($row->form_structure, true);
    }

    private function saveFormStructure(array $structure)
    {
        DB::table('wpjn_cpappbk_forms')->where('id', 13)->update([
            'form_structure' => json_encode($structure),
        ]);
    }

    public function index()
    {
        $structure = $this->getFormStructure();
        if (!$structure) return response()->json(['error' => 'Form not found'], 404);

        $services = $structure[0][0]['services'] ?? [];

        // Ensure every service has available_days (backfill for old records)
        $services = array_map(function ($svc) {
            if (!isset($svc['available_days'])) {
                $svc['available_days'] = [0,1,2,3,4,5,6];
            }
            return $svc;
        }, $services);

        return response()->json($services);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:100',
            'price'            => 'required|numeric|min:0',
            'capacity'         => 'required|integer|min:1',
            'duration'         => 'required|integer|min:1',
            'available_days'   => 'nullable|array',
            'available_days.*' => 'integer|min:0|max:6',
        ]);

        $structure = $this->getFormStructure();
        if (!$structure) return response()->json(['error' => 'Form not found'], 404);

        $services   = $structure[0][0]['services'] ?? [];
        $maxIdx     = collect($services)->max('idx')     ?? 0;
        $maxOhindex = collect($services)->max('ohindex') ?? 0;

        $newService = [
            'name'           => $request->name,
            'price'          => (float) $request->price,
            'capacity'       => (string) $request->capacity,
            'duration'       => (string) $request->duration,
            'pb'             => 0,
            'pa'             => 0,
            'ohindex'        => $maxOhindex + 1,
            'idx'            => $maxIdx + 1,
            'available_days' => $request->available_days ?? [0,1,2,3,4,5,6],
        ];

        $services[] = $newService;
        $structure[0][0]['services'] = $services;
        $this->saveFormStructure($structure);

        return response()->json($newService, 201);
    }

    public function update(Request $request, $idx)
    {
        $request->validate([
            'name'             => 'required|string|max:100',
            'price'            => 'required|numeric|min:0',
            'capacity'         => 'required|integer|min:1',
            'duration'         => 'required|integer|min:1',
            'available_days'   => 'nullable|array',
            'available_days.*' => 'integer|min:0|max:6',
        ]);

        $structure = $this->getFormStructure();
        if (!$structure) return response()->json(['error' => 'Form not found'], 404);

        $services = $structure[0][0]['services'] ?? [];
        $found    = false;

        foreach ($services as &$svc) {
            if ((int)$svc['idx'] === (int)$idx) {
                $svc['name']           = $request->name;
                $svc['price']          = (float) $request->price;
                $svc['capacity']       = (string) $request->capacity;
                $svc['duration']       = (string) $request->duration;
                $svc['available_days'] = $request->available_days ?? $svc['available_days'] ?? [0,1,2,3,4,5,6];
                $found = true;
                break;
            }
        }

        if (!$found) return response()->json(['error' => 'Service not found'], 404);

        $structure[0][0]['services'] = $services;
        $this->saveFormStructure($structure);

        return response()->json(['success' => true]);
    }

    public function destroy($idx)
    {
        $structure = $this->getFormStructure();
        if (!$structure) return response()->json(['error' => 'Form not found'], 404);

        $services = $structure[0][0]['services'] ?? [];
        $filtered = array_values(array_filter($services, fn($s) => (int)$s['idx'] !== (int)$idx));

        if (count($filtered) === count($services)) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $structure[0][0]['services'] = $filtered;
        $this->saveFormStructure($structure);

        return response()->json(['success' => true]);
    }
}