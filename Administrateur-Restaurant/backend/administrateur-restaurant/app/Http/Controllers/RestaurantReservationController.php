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
    $rows = DB::table('wpjn_cpappbk_messages')
        ->where('formid', 13)
        ->whereNull('deleted_at') // remove if no soft deletes
        ->get();

    $by_hour    = [];
    $by_day     = [];
    $by_week    = [];
    $by_month   = [];
    $by_year    = [];
    $by_guests  = [];
    $by_service = [];   // ← NEW

    $total = $confirmed = $pending = $cancelled = $guests_sum = 0;

    $daysFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    $monthsFr = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin',
                 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    foreach ($rows as $row) {
        // Parse posted_data (PHP serialized)
        $d = @unserialize($row->posted_data);
        if (!$d) continue;

        $apps    = $d['apps'] ?? [];
        $app     = $apps[0] ?? null;
        if (!$app) continue;

        $status  = $app['cancelled'] ?? 'Pending';
        $date    = isset($app['date']) ? Carbon::parse($app['date']) : null;
        $guests  = (int)($d['app_quantity_1'] ?? 1);
        $service = $d['app_service_1'] ?? null;

        $total++;
        if ($status === 'Confirmed') $confirmed++;
        elseif ($status === 'Cancelled') $cancelled++;
        else $pending++;
        $guests_sum += $guests;

        // by_guests
        $gKey = (string)$guests;
        $by_guests[$gKey] = ($by_guests[$gKey] ?? 0) + 1;

        // by_service  ← NEW
        if ($service) {
            $by_service[$service] = ($by_service[$service] ?? 0) + 1;
        }

        if (!$date) continue;

        // by_hour
        $slot = $app['slot'] ?? null;
        if ($slot) {
            $hKey = explode('/', $slot)[0];
            $by_hour[$hKey] = ($by_hour[$hKey] ?? 0) + 1;
        }

        // by_day (Lun–Dim)
        $dKey = $daysFr[$date->dayOfWeek];
        $by_day[$dKey] = ($by_day[$dKey] ?? 0) + 1;

        // by_week
        $wKey = $date->format('Y') . '-W' . str_pad($date->weekOfYear, 2, '0', STR_PAD_LEFT);
        $by_week[$wKey] = ($by_week[$wKey] ?? 0) + 1;

        // by_month
        $mKey = $monthsFr[$date->month - 1] . ' ' . $date->format('Y');
        $by_month[$mKey] = ($by_month[$mKey] ?? 0) + 1;

        // by_year
        $yKey = $date->format('Y');
        $by_year[$yKey] = ($by_year[$yKey] ?? 0) + 1;
    }

    // Sort by_day in week order
    $dayOrder = array_flip(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']);
    uksort($by_day, fn($a, $b) => ($dayOrder[$a] ?? 9) <=> ($dayOrder[$b] ?? 9));

    // Sort by_guests numerically
    ksort($by_guests, SORT_NUMERIC);

    // Sort by_service by count descending
    arsort($by_service);

    return response()->json([
        'by_hour'    => $by_hour,
        'by_day'     => $by_day,
        'by_week'    => $by_week,
        'by_month'   => $by_month,
        'by_year'    => $by_year,
        'by_guests'  => $by_guests,
        'by_service' => $by_service,   // ← NEW
        'summary'    => [
            'total'      => $total,
            'confirmed'  => $confirmed,
            'pending'    => $pending,
            'cancelled'  => $cancelled,
            'avg_guests' => $total > 0 ? round($guests_sum / $total, 1) : 0,
        ],
    ]);
}
    public function info()
    {
        $form = DB::table('wpjn_cpappbk_forms')
            ->where('id', $this->formId())
            ->first();

        if (!$form) return response()->json([]);

        $parts    = explode(' - ', $form->form_name);
        $name     = trim($parts[0] ?? $form->form_name);
        $location = trim($parts[1] ?? '');

        return response()->json([
            'name'           => $name,
            'location'       => $location,
            'form_name'      => $form->form_name,
            'email'          => $form->fp_from_email,
            'contact_name'   => $form->fp_from_name,
            'dest_emails'    => $form->fp_destination_emails,
            'language'       => $form->calendar_language,
            'default_status' => $form->defaultstatus,
        ]);
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
                        'name'     => $svc['name'],
                        'price'    => $svc['price'],
                        'duration' => $svc['duration'],
                        'capacity' => $svc['capacity'],
                    ];
                }
            }
        }

        return response()->json($services);
    }
}