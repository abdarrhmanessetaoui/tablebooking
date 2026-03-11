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
                $dow        = date('w', strtotime($r['date']));
                $byDay[$dayMap[$dow]]++;
            });

        $byWeek = $clean
            ->filter(fn($r) => !empty($r['date']))
            ->groupBy(fn($r) => date('Y-\WW', strtotime($r['date'])))
            ->map(fn($g) => $g->count())
            ->sortKeys();

        $monthNames = [
            '01' => 'Jan', '02' => 'Fév', '03' => 'Mar', '04' => 'Avr',
            '05' => 'Mai', '06' => 'Juin', '07' => 'Juil', '08' => 'Août',
            '09' => 'Sep', '10' => 'Oct', '11' => 'Nov', '12' => 'Déc',
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
            'by_hour'   => $byHour,
            'by_day'    => $byDay,
            'by_week'   => $byWeek,
            'by_month'  => $byMonth,
            'by_year'   => $byYear,
            'by_guests' => $byGuests,
            'summary'   => [
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