<?php

namespace App\Http\Controllers;

use App\Models\WpForm;
use Illuminate\Http\Request;

class TableController extends Controller
{
    private function getForm()
    {
        return WpForm::findOrFail(13);
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
        $tables  = $this->getTables();
        $tables  = array_filter($tables, fn($t) => (int)$t['idx'] !== (int)$idx);
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
}