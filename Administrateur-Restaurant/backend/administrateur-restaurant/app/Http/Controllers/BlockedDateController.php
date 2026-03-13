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

    // ── Read dates from form_structure ──────────────────────────────
    private function getInvalidDates(): array
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return [];

        $structure = json_decode($form->form_structure, true);
        $raw = '';
        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $raw = $field['invalidDates'] ?? '';
                break;
            }
        }

        if (!$raw) return [];

        $dates = [];
        foreach (explode(',', $raw) as $part) {
            $part = trim($part);
            if (!$part) continue;
            if (str_contains($part, '-')) {
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
                $d = \DateTime::createFromFormat('m/d/Y', $part);
                if ($d) $dates[] = $d->format('Y-m-d');
            }
        }

        return array_unique($dates);
    }

    // ── Read reasons map {"2026-04-01": "Fermeture", ...} ───────────
    private function getReasons(): array
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return [];

        $structure = json_decode($form->form_structure, true);
        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $raw = $field['invalidDatesReasons'] ?? '{}';
                $decoded = json_decode($raw, true);
                return is_array($decoded) ? $decoded : [];
            }
        }
        return [];
    }

    // ── Save dates + reasons back to form_structure ──────────────────
    private function saveInvalidDates(array $dates, array $reasons = null): void
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return;

        $structure = json_decode($form->form_structure, true);

        // Keep existing reasons if not provided
        if ($reasons === null) {
            $reasons = $this->getReasons();
            // Remove reasons for dates that no longer exist
            $reasons = array_intersect_key($reasons, array_flip($dates));
        }

        $converted = array_filter(array_map(function($d) {
            $dt = \DateTime::createFromFormat('Y-m-d', $d);
            return $dt ? $dt->format('m/d/Y') : null;
        }, $dates));

        $raw = implode(',', $converted);

        foreach ($structure[0] as &$field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $field['invalidDates'] = $raw;
                $field['invalidDatesReasons'] = json_encode($reasons);
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

    // ── GET /api/admin/blocked-dates ─────────────────────────────────
    public function index(Request $request)
    {
        // Public access (booking form) — no auth
        $formId = auth('sanctum')->check()
            ? auth('sanctum')->user()->restaurant_form_id
            : $request->query('form_id');

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

        // Authenticated — return dates with reasons
        $dates   = $this->getInvalidDates();
        $reasons = $this->getReasons();

        $result = array_map(fn($d) => [
            'date'   => $d,
            'reason' => $reasons[$d] ?? null,
        ], array_values($dates));

        return response()->json($result);
    }

    // ── POST /api/blocked-dates ──────────────────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'date'   => 'required|date',
            'reason' => 'nullable|string|max:255',
        ]);

        $date    = $request->date;
        $reason  = $request->reason;
        $dates   = $this->getInvalidDates();
        $reasons = $this->getReasons();

        if (!in_array($date, $dates)) {
            $dates[] = $date;
        }

        if ($reason) {
            $reasons[$date] = $reason;
        } else {
            unset($reasons[$date]);
        }

        $this->saveInvalidDates($dates, $reasons);

        return response()->json(['date' => $date, 'reason' => $reason ?? null], 201);
    }

    // ── POST /api/blocked-dates/bulk ─────────────────────────────────
    public function storeBulk(Request $request)
    {
        $request->validate([
            'dates'   => 'required|array',
            'dates.*' => 'date',
            'reason'  => 'nullable|string|max:255',
        ]);

        $existing = $this->getInvalidDates();
        $reasons  = $this->getReasons();
        $reason   = $request->reason;

        $merged = array_values(array_unique(array_merge($existing, $request->dates)));

        // Apply reason to all new dates
        if ($reason) {
            foreach ($request->dates as $d) {
                $reasons[$d] = $reason;
            }
        }

        $this->saveInvalidDates($merged, $reasons);

        return response()->json(
            array_map(fn($d) => ['date' => $d, 'reason' => $reasons[$d] ?? null], $request->dates)
        );
    }

    // ── DELETE /api/blocked-dates/{date} ─────────────────────────────
    public function destroy($date)
    {
        $dates   = $this->getInvalidDates();
        $reasons = $this->getReasons();

        $dates = array_values(array_filter($dates, fn($d) => $d !== $date));
        unset($reasons[$date]);

        $this->saveInvalidDates($dates, $reasons);

        return response()->json(['message' => 'Date unblocked']);
    }
}