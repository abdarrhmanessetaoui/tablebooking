<?php

namespace App\Http\Controllers;

use App\Models\WpMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestaurantReservationController extends Controller
{
    private function formId(): int
    {
        return auth()->user()->restaurant_form_id;
    }

    private function cancelExpiredPending(): void
    {
        $today    = now()->toDateString();
        $messages = WpMessage::where('formid', $this->formId())->get();

        foreach ($messages as $message) {
            $clean = $message->toCleanArray();
            if ($clean['status'] !== 'Pending') continue;
            if (!$clean['date'] || $clean['date'] >= $today) continue;
            $data = @unserialize($message->posted_data);
            if (!is_array($data)) continue;
            $data['app_status_1'] = 'Cancelled';
            $message->posted_data = serialize($data);
            $message->save();
        }
    }

    private function getFapp(): array
    {
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return [];
        $structure = json_decode($form->form_structure, true);
        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') return $field;
        }
        return [];
    }

    public function index(Request $request)
    {
        $messages = WpMessage::where('formid', $this->formId())
            ->orderByDesc('time')
            ->get();

        $clean = $messages->map(fn($m) => $m->toCleanArray());

        if ($request->has('date')) {
            $clean = $clean->filter(fn($r) => $r['date'] === $request->date)->values();
        }

        return response()->json($clean);
    }

    public function byDate(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $messages = WpMessage::where('formid', $this->formId())->get();

        $filtered = $messages
            ->map(fn($m) => $m->toCleanArray())
            ->filter(fn($r) => $r['date'] === $date)
            ->values();

        return response()->json($filtered);
    }

    public function stats()
    {
        $this->cancelExpiredPending();

        $messages = WpMessage::where('formid', $this->formId())->get();
        $clean    = $messages->map(fn($m) => $m->toCleanArray());
        $today    = now()->toDateString();
        $tomorrow = now()->addDay()->toDateString();
        $month    = now()->format('Y-m');

        $todayRes = $clean->filter(fn($r) => $r['date'] === $today);
        $monthRes = $clean->filter(fn($r) => str_starts_with($r['date'] ?? '', $month));

        return response()->json([
            'today'              => $todayRes->count(),
            'today_confirmed'    => $todayRes->filter(fn($r) => $r['status'] === 'Confirmed')->count(),
            'today_pending'      => $todayRes->filter(fn($r) => $r['status'] === 'Pending')->count(),
            'today_cancelled'    => $todayRes->filter(fn($r) => $r['status'] === 'Cancelled')->count(),
            'tomorrow'           => $clean->filter(fn($r) => $r['date'] === $tomorrow)->count(),
            'tomorrow_confirmed' => $clean->filter(fn($r) => $r['date'] === $tomorrow && $r['status'] === 'Confirmed')->count(),
            'tomorrow_pending'   => $clean->filter(fn($r) => $r['date'] === $tomorrow && $r['status'] === 'Pending')->count(),
            'tomorrow_cancelled' => $clean->filter(fn($r) => $r['date'] === $tomorrow && $r['status'] === 'Cancelled')->count(),
            'total'              => $monthRes->count(),
            'confirmed'          => $monthRes->filter(fn($r) => $r['status'] === 'Confirmed')->count(),
            'pending'            => $monthRes->filter(fn($r) => $r['status'] === 'Pending')->count(),
            'cancelled'          => $monthRes->filter(fn($r) => $r['status'] === 'Cancelled')->count(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string',
            'date'       => 'required|date|after_or_equal:today',
            'start_time' => 'required|string',
            'guests'     => 'required|integer|min:1',
            'status'     => 'in:Pending,Confirmed,Cancelled',
        ]);

        $date = \DateTime::createFromFormat('Y-m-d', $request->date);

        $posted_data = serialize([
            'fieldname3'      => $request->name,
            'fieldname6'      => $request->phone      ?? '',
            'email'           => $request->email      ?? '',
            'app_date_1'      => $date ? $date->format('d/m/Y') : $request->date,
            'app_starttime_1' => $request->start_time,
            'app_endtime_1'   => '',
            'app_quantity_1'  => $request->guests,
            'app_service_1'   => $request->service    ?? '',
            'app_status_1'    => $request->status     ?? 'Pending',
            'fieldname8'      => $request->notes      ?? '',
        ]);

        $message = WpMessage::create([
            'formid'      => $this->formId(),
            'time'        => now()->toDateTimeString(),
            'ipaddr'      => $request->ip(),
            'posted_data' => $posted_data,
        ]);

        return response()->json($message->toCleanArray(), 201);
    }

    public function destroy(int $id)
    {
        $message = WpMessage::where('formid', $this->formId())->findOrFail($id);
        $message->delete();
        return response()->json(['deleted' => true]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled',
        ]);

        $message = WpMessage::where('formid', $this->formId())->findOrFail($id);

        $data = @unserialize($message->posted_data);
        if (is_array($data)) {
            $data['app_status_1']         = $request->status;
            $data['apps'][0]['cancelled'] = $request->status;
            $message->posted_data         = serialize($data);
            $message->save();
        }

        return response()->json($message->toCleanArray());
    }

    public function show(int $id)
    {
        $message = WpMessage::where('formid', $this->formId())->findOrFail($id);
        return response()->json($message->toCleanArray());
    }

    public function reports()
    {
        $messages = WpMessage::where('formid', $this->formId())->get();
        $clean    = $messages->map(fn($m) => $m->toCleanArray());

        $byHour = $clean
            ->filter(fn($r) => !empty($r['start_time']))
            ->groupBy(fn($r) => substr($r['start_time'], 0, 5))
            ->map(fn($g) => $g->count())
            ->sortKeys();

        $dayMap = [0 => 'Dim', 1 => 'Lun', 2 => 'Mar', 3 => 'Mer', 4 => 'Jeu', 5 => 'Ven', 6 => 'Sam'];
        $byDay  = ['Lun' => 0, 'Mar' => 0, 'Mer' => 0, 'Jeu' => 0, 'Ven' => 0, 'Sam' => 0, 'Dim' => 0];

        $clean
            ->filter(fn($r) => !empty($r['date']))
            ->each(function ($r) use (&$byDay, $dayMap) {
                $dow = date('w', strtotime($r['date']));
                $byDay[$dayMap[$dow]]++;
            });

        $byWeek = $clean
            ->filter(fn($r) => !empty($r['date']))
            ->groupBy(fn($r) => date('Y-\WW', strtotime($r['date'])))
            ->map(fn($g) => $g->count())
            ->sortKeys();

        $monthNames = [
            '01' => 'Janv', '02' => 'Févr', '03' => 'Mars', '04' => 'Avr',
            '05' => 'Mai',  '06' => 'Juin', '07' => 'Juil', '08' => 'Août',
            '09' => 'Sept', '10' => 'Oct',  '11' => 'Nov',  '12' => 'Déc',
        ];

        $byMonth = $clean
            ->filter(fn($r) => !empty($r['date']))
            ->groupBy(fn($r) => substr($r['date'], 0, 7))
            ->map(fn($g) => $g->count())
            ->sortKeys()
            ->mapWithKeys(function ($count, $ym) use ($monthNames) {
                [$y, $m] = explode('-', $ym);
                return [($monthNames[$m] ?? $m) . ' ' . $y => $count];
            });

        $byYear = $clean
            ->filter(fn($r) => !empty($r['date']))
            ->groupBy(fn($r) => substr($r['date'], 0, 4))
            ->map(fn($g) => $g->count())
            ->sortKeys();

        $byGuests = $clean
            ->filter(fn($r) => !empty($r['guests']))
            ->groupBy(fn($r) => (string) intval($r['guests']))
            ->map(fn($g) => $g->count())
            ->sortKeys()
            ->mapWithKeys(fn($count, $n) => [$n . ' pers.' => $count]);

        $byService = $clean
            ->filter(fn($r) => !empty($r['service']))
            ->groupBy(fn($r) => $r['service'])
            ->map(fn($g) => $g->count())
            ->sortDesc();

        $total     = $clean->count();
        $confirmed = $clean->filter(fn($r) => $r['status'] === 'Confirmed')->count();
        $pending   = $clean->filter(fn($r) => $r['status'] === 'Pending')->count();
        $cancelled = $clean->filter(fn($r) => $r['status'] === 'Cancelled')->count();

        $guestValues = $clean
            ->filter(fn($r) => !empty($r['guests']))
            ->pluck('guests')
            ->map(fn($g) => intval($g));

        $avgGuests = $guestValues->count() > 0
            ? round($guestValues->sum() / $guestValues->count(), 1)
            : 0;

        return response()->json([
            'by_hour'    => $byHour,
            'by_day'     => $byDay,
            'by_week'    => $byWeek,
            'by_month'   => $byMonth,
            'by_year'    => $byYear,
            'by_guests'  => $byGuests,
            'by_service' => $byService,
            'summary'    => [
                'total'      => $total,
                'confirmed'  => $confirmed,
                'pending'    => $pending,
                'cancelled'  => $cancelled,
                'avg_guests' => $avgGuests,
            ],
        ]);
    }

    public function info()
    {
        $form = DB::table('wpjn_cpappbk_forms')
            ->where('id', $this->formId())
            ->first();

        if (!$form) return response()->json([]);

        $fapp = $this->getFapp();

        return response()->json([
            'form_name'        => $form->form_name,
            'contact_email'    => $form->fp_from_email,
            'contact_name'     => $form->fp_from_name,
            'dest_emails'      => $form->fp_destination_emails,
            'default_status'   => $form->defaultstatus,
            'address'          => $fapp['address']          ?? '',
            'phone'            => $fapp['phone']            ?? '',
            'website'          => $fapp['website']          ?? '',
            'google_maps_link' => $fapp['google_maps_link'] ?? '',
            'capacity'         => $fapp['capacity']         ?? '',
            'description'      => $fapp['description']      ?? '',
        ]);
    }

    public function updateInfo(Request $request)
    {
        $formId = $this->formId();

        $form = DB::table('wpjn_cpappbk_forms')->where('id', $formId)->first();
        if (!$form) return response()->json(['message' => 'Not found'], 404);

        $colUpdates = array_filter([
            'form_name'     => $request->form_name,
            'fp_from_email' => $request->contact_email,
        ], fn($v) => !is_null($v));

        $structure = json_decode($form->form_structure, true);
        foreach ($structure[0] as &$field) {
            if (($field['ftype'] ?? '') !== 'fapp') continue;
            foreach (['address','phone','website','google_maps_link','capacity','description'] as $key) {
                if ($request->has($key)) $field[$key] = $request->$key;
            }
            break;
        }
        $colUpdates['form_structure'] = json_encode($structure);

        DB::table('wpjn_cpappbk_forms')->where('id', $formId)->update($colUpdates);

        return response()->json(['message' => 'Saved']);
    }

    public function updateNotifications(Request $request)
    {
        $formId = $this->formId();

        DB::table('wpjn_cpappbk_forms')
            ->where('id', $formId)
            ->update(array_filter([
                'fp_from_name'          => $request->fp_from_name,
                'fp_from_email'         => $request->fp_from_email,
                'fp_destination_emails' => $request->fp_destination_emails,
                'defaultstatus'         => $request->defaultstatus,
            ], fn($v) => !is_null($v)));

        return response()->json(['message' => 'Saved']);
    }

    public function services()
    {
        $form = DB::table('wpjn_cpappbk_forms')
            ->where('id', $this->formId())
            ->first();

        if (!$form) return response()->json([]);

        $structure = json_decode($form->form_structure, true);
        $services  = [];

        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                foreach ($field['services'] ?? [] as $svc) {
                    $services[] = [
                        'name'           => $svc['name'],
                        'price'          => $svc['price'],
                        'duration'       => $svc['duration'],
                        'capacity'       => $svc['capacity'],
                        'idx'            => $svc['idx']            ?? null,
                        'ohindex'        => $svc['ohindex']        ?? null,
                        'available_days' => $svc['available_days'] ?? [0,1,2,3,4,5,6],
                    ];
                }
                break;
            }
        }

        return response()->json($services);
    }

    // =========================================================================
    // NEW METHOD #1 — Assign a table to a reservation
    // PATCH /api/restaurant/reservations/{id}/assign-table
    // Body: { "table_idx": 3 }  — send null to unassign
    // =========================================================================
    public function assignTable(Request $request, int $id)
    {
        $request->validate([
            'table_idx' => 'nullable|integer',
        ]);
    
        $message  = WpMessage::where('formid', $this->formId())->findOrFail($id);
        $tableIdx = $request->input('table_idx');
    
        if (!is_null($tableIdx)) {
    
            // ── Validate table exists and is active ───────────────────
            $form      = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();;
            $structure = json_decode($form->form_structure, true);
            $tables    = [];
    
            foreach ($structure[0] ?? [] as $field) {
                if (($field['ftype'] ?? '') === 'fapp') {
                    $tables = $field['tables'] ?? [];
                    break;
                }
            }
    
            $table = collect($tables)->firstWhere('idx', (int) $tableIdx);
    
            if (!$table) {
                return response()->json(['message' => 'Table introuvable.'], 404);
            }
    
            if (!($table['active'] ?? true)) {
                return response()->json(['message' => 'Cette table est inactive.'], 422);
            }
    
            // ── Get current reservation details ───────────────────────
            $current     = $message->toCleanArray();
            $currentDate = $current['date']       ?? null;
            $startTime   = $current['start_time'] ?? null;
            $endTime     = $current['end_time']   ?? null;
    
            // ── Check for time conflicts on the same table ────────────
            if ($currentDate && $startTime) {
    
                // Load all reservations for same date with same table
                $conflicts = WpMessage::where('formid', $this->formId())
                    ->where('id', '!=', $id)           // exclude self
                    ->where('table_idx', $tableIdx)
                    ->get()
                    ->map(fn($m) => $m->toCleanArray())
                    ->filter(function ($r) use ($currentDate, $startTime, $endTime) {
    
                        // Must be same date
                        if (($r['date'] ?? '') !== $currentDate) return false;
    
                        // Skip cancelled reservations
                        if ($r['status'] === 'Cancelled') return false;
    
                        $rStart = $r['start_time'] ?? null;
                        $rEnd   = $r['end_time']   ?? null;
    
                        if (!$rStart) return false;
    
                        // Convert to comparable decimal hours
                        $toDecimal = function (string $t): float {
                            [$h, $m] = explode(':', $t);
                            return (int)$h + (int)$m / 60;
                        };
    
                        $aStart = $toDecimal($startTime);
                        // Default slot = 2h if no end_time
                        $aEnd   = $endTime ? $toDecimal($endTime) : $aStart + 2;
    
                        $bStart = $toDecimal($rStart);
                        $bEnd   = $rEnd ? $toDecimal($rEnd) : $bStart + 2;
    
                        // Overlap: A starts before B ends AND A ends after B starts
                        return $aStart < $bEnd && $aEnd > $bStart;
                    });
    
                if ($conflicts->isNotEmpty()) {
                    $conflict    = $conflicts->first();
                    $conflictTime = $conflict['start_time'] ?? '?';
                    $conflictName = $conflict['name']       ?? 'un client';
    
                    return response()->json([
                        'message' => "Conflit : cette table est déjà assignée à {$conflictName} à {$conflictTime} le {$currentDate}.",
                    ], 422);
                }
            }
        }

        
    
        // ── All good — assign ─────────────────────────────────────────
        $message->table_idx = $tableIdx;
        $message->save();
    
        return response()->json($message->toCleanArray());
    }

    /**
 * GET /api/tables/busy?date=YYYY-MM-DD&start_time=HH:MM&end_time=HH:MM&exclude_id=123
 * Returns array of table_idx values that are already taken at that time.
 */
public function busyTables(Request $request)
{
    $date      = $request->query('date');
    $startTime = $request->query('start_time');
    $endTime   = $request->query('end_time');
    $excludeId = (int) $request->query('exclude_id', 0);

    if (!$date || !$startTime) {
        return response()->json([]);
    }

    $toDecimal = function (string $t): float {
        [$h, $m] = explode(':', $t);
        return (int)$h + (int)$m / 60;
    };

    $aStart = $toDecimal($startTime);
    $aEnd   = $endTime ? $toDecimal($endTime) : $aStart + 2;

    $busy = WpMessage::where('formid', $this->formId())
        ->whereNotNull('table_idx')
        ->where('id', '!=', $excludeId)
        ->get()
        ->map(fn($m) => $m->toCleanArray())
        ->filter(function ($r) use ($date, $aStart, $aEnd, $toDecimal) {
            if (($r['date'] ?? '') !== $date) return false;
            if ($r['status'] === 'Cancelled') return false;
            $rStart = $r['start_time'] ?? null;
            if (!$rStart) return false;
            $bStart = $toDecimal($rStart);
            $bEnd   = isset($r['end_time']) && $r['end_time']
                ? $toDecimal($r['end_time'])
                : $bStart + 2;
            return $aStart < $bEnd && $aEnd > $bStart;
        })
        ->pluck('table_idx')
        ->unique()
        ->values();

    return response()->json($busy);
}

    // =========================================================================
    // NEW METHOD #2 — Table occupancy timeline for a given date
    // GET /api/tables/timeline?date=YYYY-MM-DD
    // =========================================================================
    public function timeline(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            $date = now()->toDateString();
        }

        // Load tables from form_structure JSON
        $form = DB::table('wpjn_cpappbk_forms')->where('id', $this->formId())->first();
        if (!$form) return response()->json([]);

        $structure = json_decode($form->form_structure, true);
        $tables    = [];

        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $tables = $field['tables'] ?? [];
                break;
            }
        }

        // Only active tables
        $tables = collect($tables)->filter(fn($t) => $t['active'] ?? true)->values();

        // Load reservations for this date that have a table assigned
        $messages = WpMessage::where('formid', $this->formId())
            ->whereNotNull('table_idx')
            ->get()
            ->map(fn($m) => $m->toCleanArray())
            ->filter(fn($r) => $r['date'] === $date && in_array($r['status'], ['Confirmed', 'Pending']))
            ->groupBy('table_idx');

        $timeline = $tables->map(function ($table) use ($messages) {
            $tableReservations = $messages->get($table['idx'], collect());

            return [
                'table_id'     => $table['idx'],
                'table_name'   => 'Table ' . $table['number'],
                'capacity'     => (int) $table['capacity'],
                'location'     => $table['location'],
                'reservations' => collect($tableReservations)->map(fn($r) => [
                    'id'            => $r['id'],
                    'start_time'    => $r['start_time'],
                    'end_time'      => $r['end_time'],
                    'customer_name' => $r['name'],
                    'guests'        => (int) $r['guests'],
                    'status'        => $r['status'],
                ])->values(),
            ];
        });

        return response()->json($timeline->values());
    }
}