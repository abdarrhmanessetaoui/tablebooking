<?php

namespace App\Http\Controllers;

use App\Models\BlockedDate;
use Illuminate\Http\Request;

class BlockedDateController extends Controller
{
    private function formId(): int
    {
        return auth()->user()->restaurant_form_id ?? 0;
    }

    public function index()
    {
        $formId = request()->query('form_id') ?? $this->formId();
        return response()->json(
            BlockedDate::where('form_id', $formId)->orderBy('date')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date'   => 'required|date|unique:blocked_dates,date',
            'reason' => 'nullable|string|max:255',
        ]);

        $data['form_id'] = $this->formId();

        return response()->json(BlockedDate::create($data), 201);
    }

    public function destroy(BlockedDate $blockedDate)
    {
        $blockedDate->delete();
        return response()->json(['message' => 'Date unblocked']);
    }
}