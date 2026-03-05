<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TimeSlotController extends Controller
{
    private function formId(): ?int
    {
        auth()->shouldUse('sanctum');
        $user = auth('sanctum')->user();
        return $user
            ? $user->restaurant_form_id
            : (int) request()->query('form_id');
    }

    private function getStructure(int $formId): ?array
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $formId)->first();
        if (!$form) return null;
        return json_decode($form->form_structure, true);
    }

    public function index()
    {
        $formId = $this->formId();
        if (!$formId) return response()->json([]);

        $structure = $this->getStructure($formId);
        if (!$structure) return response()->json([]);

        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') !== 'fapp') continue;
            return response()->json([
                'allOH'         => $field['allOH']         ?? [],
                'working_dates' => $field['working_dates']  ?? [],
            ]);
        }

        return response()->json([]);
    }

    public function update(Request $request)
    {
        $formId = auth()->user()->restaurant_form_id;
        if (!$formId) return response()->json(['message' => 'Unauthorized'], 401);

        $structure = $this->getStructure($formId);
        if (!$structure) return response()->json(['message' => 'Form not found'], 404);

        foreach ($structure[0] as &$field) {
            if (($field['ftype'] ?? '') !== 'fapp') continue;
            if ($request->has('allOH'))         $field['allOH']         = $request->allOH;
            if ($request->has('working_dates')) $field['working_dates'] = $request->working_dates;
            break;
        }

        DB::table('wpjn_cpappbk_forms')
            ->where('id', $formId)
            ->update(['form_structure' => json_encode($structure)]);

        return response()->json(['message' => 'Saved successfully']);
    }
}