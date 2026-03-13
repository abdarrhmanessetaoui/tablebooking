<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeSlotController extends Controller
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

    private function normalizeDaySlots(array $oh): array
    {
        if (isset($oh['openhours']) && count($oh['openhours']) === 7) {
            return $oh;
        }
        $base = $oh['openhours'][0] ?? ['type' => 'all', 'h1' => '12', 'm1' => '0', 'h2' => '23', 'm2' => '0'];
        $oh['openhours'] = array_map(fn($d) => array_merge($base, ['type' => 'day', 'd' => (string)$d]), range(0, 6));
        return $oh;
    }

    public function index()
    {
        $structure = $this->getFormStructure();
        if (!$structure) return response()->json([]);

        $fapp = null;
        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') { $fapp = $field; break; }
        }
        if (!$fapp) return response()->json([]);

        $allOH         = array_map([$this, 'normalizeDaySlots'], $fapp['allOH'] ?? []);
        $working_dates = $fapp['working_dates'] ?? [false,true,true,true,true,true,true];

        return response()->json([
            'allOH'         => $allOH,
            'working_dates' => $working_dates,
        ]);
    }

    public function update(Request $request)
    {
        $structure = $this->getFormStructure();
        if (!$structure) return response()->json(['error' => 'Not found'], 404);

        foreach ($structure[0] as &$field) {
            if (($field['ftype'] ?? '') !== 'fapp') continue;

            if ($request->has('allOH')) {
                $field['allOH'] = $request->allOH;
            }
            if ($request->has('working_dates')) {
                $field['working_dates'] = $request->working_dates;
            }
            break;
        }

        $this->saveFormStructure($structure);
        return response()->json(['success' => true]);
    }
}