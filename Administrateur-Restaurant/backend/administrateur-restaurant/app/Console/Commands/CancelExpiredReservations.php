<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WpMessage;

class CancelExpiredReservations extends Command
{
    protected $signature   = 'reservations:cancel-expired';
    protected $description = 'Annule les réservations en attente dont la date est dépassée';

    public function handle()
    {
        $today    = now()->toDateString();
        $messages = WpMessage::all(); // ou ajoute ->where('formid', X) si besoin

        $cancelled = 0;

        foreach ($messages as $message) {
            $clean = $message->toCleanArray();

            // Seulement les "Pending" dont la date est passée
            if ($clean['status'] !== 'Pending') continue;
            if (!$clean['date'] || $clean['date'] >= $today) continue;

            // Désérialiser posted_data, changer app_status_1, re-sérialiser
            $data = @unserialize($message->posted_data);
            if (!is_array($data)) continue;

            $data['app_status_1'] = 'Cancelled';

            $message->posted_data = serialize($data);
            $message->save();

            $cancelled++;
        }

        $this->info("✅ {$cancelled} réservation(s) annulée(s) automatiquement.");
    }
}