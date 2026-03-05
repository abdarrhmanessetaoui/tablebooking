<?php

namespace App\Http\Controllers;

use App\Models\WpMessage;
use Illuminate\Http\Request;

class RestaurantReservationController extends Controller
{
    // Get formid from authenticated user
    private function formId(): int
    {
        return auth()->user()->restaurant_form_id;
    }

    public function index(Request $request)
    {
        $query = WpMessage::where('formid', $this->formId())
            ->orderByDesc('time');

        // Optional filters
        if ($request->has('date')) {
            $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(posted_data, '$.app_date_1')) = ?", [$request->date]);
        }

        $messages = $query->get();

        return response()->json(
            $messages->map(fn($m) => $m->toCleanArray())
        );
    }

    public function show(int $id)
    {
        $message = WpMessage::where('formid', $this->formId())
            ->findOrFail($id);

        return response()->json($message->toCleanArray());
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled',
        ]);

        $message = WpMessage::where('formid', $this->formId())
            ->findOrFail($id);

        $data = @unserialize($message->posted_data);
        if (is_array($data)) {
            $data['app_status_1']                = $request->status;
            $data['apps'][0]['cancelled']        = $request->status;
            $message->posted_data                = serialize($data);
            $message->save();
        }

        return response()->json($message->toCleanArray());
    }
}php