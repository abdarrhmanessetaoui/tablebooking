<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeSlotController extends Controller
{
    private function getForm()
    {
        return DB::table('wpjn_cpappbk_forms')
            ->where('id', auth()->user()->restaurant_form_id)
            ->first();
    }

    public function index()
    {
        $form      = $this->getForm();
        if (!$form) return response()->json([]);

        $structure = json_decode($form->form_structure, true);
        $fields    = $structure[0] ?? [];

        foreach ($fields as $field) {
            if (($field['ftype'] ?? '') !== 'fapp') continue;

            return response()->json([
                'allOH'         => $field['allOH'] ?? [],
                'working_dates' => $field['working_dates'] ?? [],
            ]);
        }

        return response()->json([]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'allOH'           => 'required|array',
            'working_dates'   => 'required|array',
        ]);

        $form = $this->getForm();
        if (!$form) return response()->json(['message' => 'Form not found'], 404);

        $structure = json_decode($form->form_structure, true);

        foreach ($structure[0] as &$field) {
            if (($field['ftype'] ?? '') !== 'fapp') continue;
            $field['allOH']         = $request->allOH;
            $field['working_dates'] = $request->working_dates;
            break;
        }

        DB::table('wpjn_cpappbk_forms')
            ->where('id', auth()->user()->restaurant_form_id)
            ->update(['form_structure' => json_encode($structure)]);

        return response()->json(['message' => 'Saved successfully']);
    }
}