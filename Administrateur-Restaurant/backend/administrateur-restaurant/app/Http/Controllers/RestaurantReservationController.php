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

    private function parseStatus(string $postedData): string
    {
        $data = @unserialize($postedData);
        return is_array($data) ? ($data['app_status_1'] ?? 'Pending') : 'Pending';
    }

    public function index(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Collection<\App\Models\WpMessage> $messages */
        $messages = WpMessage::where('formid', $this->formId())
            ->orderByDesc('time')
            ->get();

        $clean = $messages->map(fn($m) => $m->toCleanArray());

        if ($request->has('date')) {
            $clean = $clean->filter(fn($r) => $r['date'] === $request->date)->values();
        }

        return response()->json($clean);
    }

    public function show(int $id)
    {
        /** @var \App\Models\WpMessage $message */
        $message = WpMessage::where('formid', $this->formId())->findOrFail($id);
        return response()->json($message->toCleanArray());
    }

    public function byDate(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        /** @var \Illuminate\Database\Eloquent\Collection<\App\Models\WpMessage> $messages */
        $messages = WpMessage::where('formid', $this->formId())->get();

        $filtered = $messages
            ->map(fn($m) => $m->toCleanArray())
            ->filter(fn($r) => $r['date'] === $date)
            ->values();

        return response()->json($filtered);
    }

    public function stats()
    {
        /** @var \Illuminate\Database\Eloquent\Collection<\App\Models\WpMessage> $messages */
        $messages = WpMessage::where('formid', $this->formId())->get()
            ->map(fn($m) => $m->toCleanArray());
    
        $today    = now()->toDateString();
        $tomorrow = now()->addDay()->toDateString();
    
        $todayRes    = $messages->filter(fn($r) => $r['date'] === $today);
        $tomorrowRes = $messages->filter(fn($r) => $r['date'] === $tomorrow);
    
        return response()->json([
            'total'           => $messages->count(),
            'today'           => $todayRes->count(),
            'today_confirmed' => $todayRes->filter(fn($r) => $r['status'] === 'Confirmed')->count(),
            'today_pending'   => $todayRes->filter(fn($r) => $r['status'] === 'Pending')->count(),
            'today_cancelled' => $todayRes->filter(fn($r) => $r['status'] === 'Cancelled')->count(),
            'confirmed'       => $messages->filter(fn($r) => $r['status'] === 'Confirmed')->count(),
            'pending'         => $messages->filter(fn($r) => $r['status'] === 'Pending')->count(),
            'cancelled'       => $messages->filter(fn($r) => $r['status'] === 'Cancelled')->count(),
            'tomorrow'        => $tomorrowRes->count(),
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

    public function reports()
    {
        /** @var \Illuminate\Database\Eloquent\Collection<\App\Models\WpMessage> $messages */
        $messages = WpMessage::where('formid', $this->formId())->get();
        $clean    = $messages->map(fn($m) => $m->toCleanArray());

        $byHour = $clean->groupBy(fn($r) => $r['start_time'] ? substr($r['start_time'], 0, 5) : null)
            ->filter(fn($g, $k) => $k !== null)
            ->map(fn($g) => $g->count())
            ->sortKeys();

        $days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $byDay = ['Mon' => 0, 'Tue' => 0, 'Wed' => 0, 'Thu' => 0, 'Fri' => 0, 'Sat' => 0, 'Sun' => 0];

        $clean->each(function ($r) use (&$byDay, $days) {
            if (!$r['date']) return;
            try {
                $day         = $days[date('w', strtotime($r['date']))];
                $byDay[$day] = ($byDay[$day] ?? 0) + 1;
            } catch (\Exception $e) {}
        });

        return response()->json([
            'by_hour' => $byHour,
            'by_day'  => $byDay,
        ]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled',
        ]);

        /** @var \App\Models\WpMessage $message */
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
}