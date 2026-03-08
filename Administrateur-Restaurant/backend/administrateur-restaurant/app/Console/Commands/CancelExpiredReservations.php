<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WpMessage;

class CancelExpiredReservations extends Command
{
    protected $signature   = 'reservations:cancel-expired';
    protected $description = 'Annule automatiquement les réservations en attente dont la date est dépassée';

    public function handle()
    {
        $today    = now()->toDateString();
        $messages = WpMessage::where('formid', config('restaurant.form_id'))->get();

        $cancelled = 0;

        foreach ($messages as $message) {
            $data = $message->toCleanArray();

            if ($data['status'] === 'Pending' && $data['date'] < $today) {
                // Update however your model saves status — adjust to match your implementation
                $message->update(['status' => 'Cancelled']);
                $cancelled++;
            }
        }

        $this->info("✅ {$cancelled} réservation(s) annulée(s) automatiquement.");
    }
}