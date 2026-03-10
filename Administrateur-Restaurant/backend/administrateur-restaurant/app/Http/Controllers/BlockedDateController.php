<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlockedDateController extends Controller
{
    private function formId(): int
    {
        return auth()->user()->restaurant_form_id ?? 0;
    }

    // Lit invalidDates depuis form_structure et retourne array de Y-m-d
    private function getInvalidDates(): array
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return [];

        $structure = json_decode($form->form_structure, true);
        $raw = null;
        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $raw = $field['invalidDates'] ?? '';
                break;
            }
        }

        if (!$raw) return [];

        // Parse "01/27/2025-01/31/2025,01/17/2025" → array of Y-m-d
        $dates = [];
        foreach (explode(',', $raw) as $part) {
            $part = trim($part);
            if (!$part) continue;

            if (str_contains($part, '-')) {
                // Range: 01/27/2025-01/31/2025
                [$start, $end] = explode('-', $part, 2);
                $s = \DateTime::createFromFormat('m/d/Y', trim($start));
                $e = \DateTime::createFromFormat('m/d/Y', trim($end));
                if ($s && $e) {
                    $cur = clone $s;
                    while ($cur <= $e) {
                        $dates[] = $cur->format('Y-m-d');
                        $cur->modify('+1 day');
                    }
                }
            } else {
                // Single: 01/17/2025
                $d = \DateTime::createFromFormat('m/d/Y', $part);
                if ($d) $dates[] = $d->format('Y-m-d');
            }
        }

        return array_unique($dates);
    }

    // Sauvegarde array de Y-m-d → invalidDates dans form_structure
    private function saveInvalidDates(array $dates): void
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return;

        $structure = json_decode($form->form_structure, true);

        // Convertir Y-m-d → mm/dd/yyyy (format WordPress)
        $converted = array_map(function($d) {
            $dt = \DateTime::createFromFormat('Y-m-d', $d);
            return $dt ? $dt->format('m/d/Y') : null;
        }, $dates);
        $converted = array_filter($converted);

        $raw = implode(',', $converted);

        // Update invalidDates dans tous les champs fapp
        foreach ($structure[0] as &$field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $field['invalidDates'] = $raw;
                // Update aussi tmpinvalidDatestime pour WordPress
                $field['tmpinvalidDatestime'] = array_map(
                    fn($d) => (new \DateTime($d))->getTimestamp() * 1000,
                    array_values(array_filter($dates))
                );
            }
        }

        DB::table('wpjn_cpappbk_forms')
            ->where('id', $this->formId())
            ->update(['form_structure' => json_encode($structure)]);
    }

    // GET /api/blocked-dates → retourne [{date: 'Y-m-d'}, ...]
    public function index(Request $request)
    {
        $formId = auth('sanctum')->check()
            ? auth('sanctum')->user()->restaurant_form_id
            : $request->query('form_id');

        // Override formId for public access
        if (!auth('sanctum')->check() && $formId) {
            $form = DB::table('wpjn_cpappbk_forms')->where('id', $formId)->first();
            if (!$form) return response()->json([]);

            $structure = json_decode($form->form_structure, true);
            $raw = '';
            foreach ($structure[0] ?? [] as $field) {
                if (($field['ftype'] ?? '') === 'fapp') {
                    $raw = $field['invalidDates'] ?? '';
                    break;
                }
            }

            $dates = [];
            foreach (explode(',', $raw) as $part) {
                $part = trim($part);
                if (!$part) continue;
                if (str_contains($part, '-')) {
                    [$s, $e] = explode('-', $part, 2);
                    $start = \DateTime::createFromFormat('m/d/Y', trim($s));
                    $end   = \DateTime::createFromFormat('m/d/Y', trim($e));
                    if ($start && $end) {
                        $cur = clone $start;
                        while ($cur <= $end) {
                            $dates[] = ['date' => $cur->format('Y-m-d')];
                            $cur->modify('+1 day');
                        }
                    }
                } else {
                    $d = \DateTime::createFromFormat('m/d/Y', $part);
                    if ($d) $dates[] = ['date' => $d->format('Y-m-d')];
                }
            }

            return response()->json($dates);
        }

        $dates = $this->getInvalidDates();
        return response()->json(array_map(fn($d) => ['date' => $d], $dates));
    }

    // POST /api/blocked-dates  body: {date: 'Y-m-d'}
    public function store(Request $request)
    {
        $request->validate(['date' => 'required|date']);

        $date   = $request->date; // Y-m-d
        $dates  = $this->getInvalidDates();

        if (!in_array($date, $dates)) {
            $dates[] = $date;
            $this->saveInvalidDates($dates);
        }

        return response()->json(['date' => $date], 201);
    }

    public function storeBulk(Request $request)
{
    $request->validate(['dates' => 'required|array', 'dates.*' => 'date']);
    $created = [];
    foreach ($request->dates as $date) {
        $blocked = BlockedDate::firstOrCreate(['date' => $date]);
        $created[] = $blocked;
    }
    return response()->json($created);
}

    // DELETE /api/blocked-dates/{date}  (date = Y-m-d)
    public function destroy($date)
    {
        $dates  = $this->getInvalidDates();
        $dates  = array_values(array_filter($dates, fn($d) => $d !== $date));
        $this->saveInvalidDates($dates);

        return response()->json(['message' => 'Date unblocked']);
    }
}