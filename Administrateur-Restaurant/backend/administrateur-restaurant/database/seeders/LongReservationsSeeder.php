<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LongReservationsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clear existing reservations to avoid mess if wanted
        // DB::table('wpjn_cpappbk_messages')->truncate();

        $firstNames = ['Youssef', 'Rania', 'Salma', 'Anouar', 'Saad', 'Soukaina', 'Amine', 'Laila', 'Mehdi', 'Zineb', 'Omar', 'Kenza', 'Adnane', 'Hiba', 'Hamza', 'Nora', 'Yassine', 'Sara', 'Driss', 'Ghita', 'Khalid', 'Sofia', 'Rachid', 'Imane', 'Tarik', 'Meryem'];
        $lastNames = ['Benali', 'Squalli', 'Ouazzani', 'Echchebbi', 'El Glaoui', 'Alaoui', 'Bennani', 'Mansouri', 'Tazi', 'Filali', 'Chraibi', 'Lahlou', 'Guessous', 'Belkhayat', 'Sabri', 'Fassi', 'Amrani', 'El Fassi', 'Kabbaj', 'Zouiten'];
        
        $services = [
            'A la Carte',
            'Formule Midi à 170 dh',
            'Menu Dégustation',
            'Brunch Week-end',
            'After-Work Cocktails & Tapas'
        ];

        $statuses = ['Confirmed', 'Pending', 'Confirmed', 'Confirmed', 'Arrived', 'Cancelled', 'Confirmed']; // Weighted towards Confirmed

        $tables = range(1, 11); // Table indices 1 to 11 are active

        // Dates to seed
        $dates = [
            '2026-04-25' => 45, // Today
            '2026-04-26' => 40, // Tomorrow
            '2026-04-27' => 15,
            '2026-04-28' => 12,
            '2026-04-29' => 8,
            '2026-04-30' => 5,
        ];

        $count = 0;
        foreach ($dates as $dateStr => $dailyCount) {
            $dateObj = Carbon::parse($dateStr);
            
            for ($i = 0; $i < $dailyCount; $i++) {
                $firstName = $firstNames[array_rand($firstNames)];
                $lastName = $lastNames[array_rand($lastNames)];
                $name = $firstName . ' ' . $lastName;
                $phone = '+2126' . rand(10000000, 99999999);
                $email = strtolower($firstName . '.' . $lastName . rand(1, 99) . '@gmail.com');
                
                // Random time: either Lunch (12:00-15:00) or Dinner (19:00-23:00)
                $isLunch = rand(0, 1);
                if ($isLunch) {
                    $h = rand(12, 14);
                    $m = [0, 15, 30, 45][array_rand([0, 15, 30, 45])];
                } else {
                    $h = rand(19, 22);
                    $m = [0, 15, 30, 45][array_rand([0, 15, 30, 45])];
                }
                
                $time = sprintf('%02d:%02d', $h, $m);
                $duration = rand(60, 120);
                $endTime = Carbon::createFromTime($h, $m)->addMinutes($duration)->format('H:i');
                
                $guests = rand(2, 8);
                $service = $services[array_rand($services)];
                $status = $statuses[array_rand($statuses)];
                $notesList = [
                    'Anniversaire',
                    'Fiançailles',
                    'Réunion d\'affaires',
                    'Chaise haute bébé requise',
                    'Allergie aux fruits de mer',
                    'Table près de la fenêtre si possible',
                    'Coin tranquille',
                    'Client VIP',
                    '',
                    '',
                    ''
                ];
                $notes = $notesList[array_rand($notesList)];
                $tableIdx = rand(0, 10) > 2 ? $tables[array_rand($tables)] : null; // Some unassigned

                $posted_data = serialize([
                    'fieldname3' => $name,
                    'fieldname6' => $phone,
                    'email'      => $email,
                    'app_date_1' => $dateObj->format('d/m/Y'),
                    'app_starttime_1' => $time,
                    'app_endtime_1'   => $endTime,
                    'app_quantity_1'  => (string) $guests,
                    'app_service_1'   => $service,
                    'app_status_1'    => $status,
                    'fieldname8'      => $notes,
                ]);

                DB::table('wpjn_cpappbk_messages')->insert([
                    'formid' => 13,
                    'time' => $dateObj->copy()->subDays(rand(1, 5))->setHour(rand(9, 18))->setMinute(rand(0, 59))->toDateTimeString(),
                    'ipaddr' => '127.0.0.1',
                    'posted_data' => $posted_data,
                    'notifyto' => '',
                    'data' => '',
                    'whoadded' => '0',
                    'table_idx' => $tableIdx,
                ]);
                $count++;
            }
        }

        $this->command->info("✅ Generated {$count} long-term reservations (especially for today and tomorrow).");
    }
}
