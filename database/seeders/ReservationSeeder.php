<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\Restaurant;
use Illuminate\Support\Facades\File;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('data/reservations.json'));
        $reservations = json_decode($json);
    
        foreach ($reservations as $reservation) {
            Reservation::create([
                'restaurant_id' => $reservation->restaurant_id,
                'client_name' => $reservation->client_name,
                'client_phone' => $reservation->client_phone,
                'date' => $reservation->date,
                'time' => $reservation->time,
                'guests' => $reservation->guests,
                'status' => $reservation->status ?? 'pending',
            ]);
        }
    }
}
