<?php

namespace App\Http\Controllers;

use App\Models\WpMessage;
use Illuminate\Http\Request;

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
        $messages = WpMessage::where('formid', $this->formId())->get();
        $clean    = $messages->map(fn($m) => $m->toCleanArray());
    
        return response()->json([
            'total'     => $clean->count(),
            'today'     => $clean->filter(fn($r) => $r['date'] === now()->toDateString())->count(),
            'confirmed' => $clean->filter(fn($r) => $r['status'] === 'Confirmed')->count(),
            'pending'   => $clean->filter(fn($r) => $r['status'] === 'Pending')->count(),
            'cancelled' => $clean->filter(fn($r) => $r['status'] === 'Cancelled')->count(),
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
    public function timeSlots()
{
    $form = \DB::table('wpjn_cpappbk_forms')
        ->where('id', auth()->user()->restaurant_form_id)
        ->first();

    if (!$form) return response()->json([]);

    $structure = json_decode($form->form_structure, true);
    $slots     = [];

    foreach ($structure[0] ?? [] as $field) {
        if (($field['ftype'] ?? '') !== 'fapp') continue;
        foreach ($field['allOH'] ?? [] as $oh) {
            foreach ($oh['openhours'] ?? [] as $hour) {
                $h1 = str_pad($hour['h1'], 2, '0', STR_PAD_LEFT);
                $m1 = str_pad($hour['m1'], 2, '0', STR_PAD_LEFT);
                $h2 = str_pad($hour['h2'], 2, '0', STR_PAD_LEFT);
                $m2 = str_pad($hour['m2'], 2, '0', STR_PAD_LEFT);
                $slots[] = [
                    'name'  => $oh['name'],
                    'open'  => "$h1:$m1",
                    'close' => "$h2:$m2",
                ];
            }
        }
        break;
    }

    return response()->json($slots);
}
}