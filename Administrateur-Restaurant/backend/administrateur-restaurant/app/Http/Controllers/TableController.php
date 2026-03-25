<?php

namespace App\Http\Controllers;

use App\Models\WpForm;
use Illuminate\Http\Request;

class TableController extends Controller
{
    private function getForm()
    {
        return WpForm::findOrFail(auth()->user()->restaurant_form_id);
    }

    private function getTables(): array
    {
        $form      = $this->getForm();
        $structure = json_decode($form->form_structure, true);
        return $structure[0][0]['tables'] ?? [];
    }

    private function saveTables(array $tables): void
    {
        $form      = $this->getForm();
        $structure = json_decode($form->form_structure, true);
        $structure[0][0]['tables'] = array_values($tables);
        $form->form_structure = json_encode($structure, JSON_UNESCAPED_UNICODE);
        $form->save();
    }

    // ── Locations helpers ─────────────────────────────────────────

    private function getLocations(): array
    {
        $form      = $this->getForm();
        $structure = json_decode($form->form_structure, true);
        $locations = $structure[0][0]['locations'] ?? null;

        // Auto-seed defaults if never set before
        if (is_null($locations)) {
            return [
                ['id' => 1, 'name' => 'Intérieur',   'color' => '#4f6ef7'],
                ['id' => 2, 'name' => 'Terrasse',    'color' => '#16a34a'],
                ['id' => 3, 'name' => 'Bar',         'color' => '#a8834e'],
                ['id' => 4, 'name' => 'Salon privé', 'color' => '#b94040'],
            ];
        }

        return $locations;
    }

    private function saveLocations(array $locations): void
    {
        $form      = $this->getForm();
        $structure = json_decode($form->form_structure, true);
        $structure[0][0]['locations'] = array_values($locations);
        $form->form_structure = json_encode($structure, JSON_UNESCAPED_UNICODE);
        $form->save();
    }

    private function nextLocationId(array $locations): int
    {
        if (empty($locations)) return 1;
        return max(array_column($locations, 'id')) + 1;
    }

    // ── Tables CRUD ───────────────────────────────────────────────

    public function index()
    {
        return response()->json(array_values($this->getTables()));
    }

    public function store(Request $request)
    {
        $request->validate([
            'number'   => 'required|string',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string',
            'active'   => 'boolean',
        ]);

        $tables = $this->getTables();

        $idx = count($tables) > 0
            ? max(array_column($tables, 'idx')) + 1
            : 1;

        $table = [
            'idx'      => $idx,
            'number'   => $request->number,
            'capacity' => $request->capacity,
            'location' => $request->location,
            'active'   => $request->boolean('active', true),
        ];

        $tables[] = $table;
        $this->saveTables($tables);

        return response()->json($table, 201);
    }

    public function update(Request $request, $idx)
    {
        $request->validate([
            'number'   => 'required|string',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string',
            'active'   => 'boolean',
        ]);

        $tables = $this->getTables();
        $found  = false;

        foreach ($tables as &$t) {
            if ((int)$t['idx'] === (int)$idx) {
                $t['number']   = $request->number;
                $t['capacity'] = $request->capacity;
                $t['location'] = $request->location;
                $t['active']   = $request->boolean('active', $t['active']);
                $found = true;
                break;
            }
        }

        if (!$found) return response()->json(['error' => 'Table not found'], 404);

        $this->saveTables($tables);
        return response()->json(['success' => true]);
    }

    public function destroy($idx)
    {
        $tables = $this->getTables();
        $tables = array_filter($tables, fn($t) => (int)$t['idx'] !== (int)$idx);
        $this->saveTables($tables);
        return response()->json(['success' => true]);
    }

    public function toggleActive($idx)
    {
        $tables = $this->getTables();
        $found  = false;

        foreach ($tables as &$t) {
            if ((int)$t['idx'] === (int)$idx) {
                $t['active'] = !($t['active'] ?? true);
                $found = true;
                break;
            }
        }

        if (!$found) return response()->json(['error' => 'Table not found'], 404);

        $this->saveTables($tables);
        return response()->json(['success' => true]);
    }

    // ── Locations CRUD ────────────────────────────────────────────

    public function indexLocations()
    {
        return response()->json(array_values($this->getLocations()));
    }

    public function storeLocation(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:60',
            'color' => 'nullable|string|max:7',
        ]);

        $locations = $this->getLocations();

        // Check duplicate name
        $exists = collect($locations)->contains(fn($l) => strtolower($l['name']) === strtolower(trim($request->name)));
        if ($exists) {
            return response()->json(['message' => 'Cet emplacement existe déjà.'], 422);
        }

        $location = [
            'id'    => $this->nextLocationId($locations),
            'name'  => trim($request->name),
            'color' => $request->color ?? '#6b7280',
        ];

        $locations[] = $location;
        $this->saveLocations($locations);

        return response()->json($location, 201);
    }

    public function updateLocation(Request $request, int $id)
    {
        $request->validate([
            'name'  => 'sometimes|string|max:60',
            'color' => 'sometimes|string|max:7',
        ]);

        $locations = $this->getLocations();
        $found     = false;
        $updated   = null;

        foreach ($locations as &$l) {
            if ((int)$l['id'] === $id) {
                if ($request->has('name'))  $l['name']  = trim($request->name);
                if ($request->has('color')) $l['color'] = $request->color;
                $found   = true;
                $updated = $l;
                break;
            }
        }

        if (!$found) return response()->json(['error' => 'Emplacement introuvable'], 404);

        $this->saveLocations($locations);
        return response()->json($updated);
    }

    public function destroyLocation(int $id)
    {
        $locations = $this->getLocations();
        $locations = array_filter($locations, fn($l) => (int)$l['id'] !== $id);
        $this->saveLocations(array_values($locations));
        return response()->json(['deleted' => true]);
    }
}