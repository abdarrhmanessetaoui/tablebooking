<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ─────────────── 1. USER ───────────────
        $user = \App\Models\User::updateOrCreate(
            ['email' => 'admin@tablebooking.ma'],
            [
                'name'               => 'Dal Corso Admin',
                'password'           => 'password', // auto-hashed
                'restaurant_form_id' => 13,
                'email_verified_at'  => now(),
            ]
        );
        $userId = $user->id;

        $this->command->info("✅ User created — admin@tablebooking.ma / password");

        // ─────────────── 2. FORM STRUCTURE ───────────────
        $tables = [
            ['idx' => 1, 'number' => '1', 'capacity' => 2, 'location' => 'Intérieur', 'active' => true],
            ['idx' => 2, 'number' => '2', 'capacity' => 4, 'location' => 'Intérieur', 'active' => true],
            ['idx' => 3, 'number' => '3', 'capacity' => 4, 'location' => 'Intérieur', 'active' => true],
            ['idx' => 4, 'number' => '4', 'capacity' => 6, 'location' => 'Intérieur', 'active' => true],
            ['idx' => 5, 'number' => 'T1', 'capacity' => 2, 'location' => 'Terrasse', 'active' => true],
            ['idx' => 6, 'number' => 'T2', 'capacity' => 4, 'location' => 'Terrasse', 'active' => true],
            ['idx' => 7, 'number' => 'T3', 'capacity' => 6, 'location' => 'Terrasse', 'active' => true],
            ['idx' => 8, 'number' => 'B1', 'capacity' => 2, 'location' => 'Bar', 'active' => true],
            ['idx' => 9, 'number' => 'B2', 'capacity' => 4, 'location' => 'Bar', 'active' => true],
            ['idx' => 10, 'number' => 'VIP', 'capacity' => 10, 'location' => 'Salon privé', 'active' => true],
            ['idx' => 11, 'number' => 'VIP 2', 'capacity' => 8, 'location' => 'Salon privé', 'active' => true],
            ['idx' => 12, 'number' => 'Coin fenêtre', 'capacity' => 2, 'location' => 'Intérieur', 'active' => false],
        ];

        $locations = [
            ['id' => 1, 'name' => 'Intérieur', 'color' => '#4f6ef7'],
            ['id' => 2, 'name' => 'Terrasse', 'color' => '#16a34a'],
            ['id' => 3, 'name' => 'Bar', 'color' => '#a8834e'],
            ['id' => 4, 'name' => 'Salon privé', 'color' => '#b94040'],
        ];

        $services = [
            ['name' => 'A la Carte', 'price' => 0, 'capacity' => '15', 'duration' => '90', 'pb' => 0, 'pa' => 0, 'ohindex' => 0, 'idx' => 1, 'available_days' => [0,1,2,3,4,5,6]],
            ['name' => 'Formule Midi à 170 dh', 'price' => 170, 'capacity' => '15', 'duration' => '60', 'pb' => 0, 'pa' => 0, 'ohindex' => 1, 'idx' => 2, 'available_days' => [0,1,2,3,4,5,6]],
            ['name' => 'Menu Dégustation', 'price' => 350, 'capacity' => '8', 'duration' => '120', 'pb' => 0, 'pa' => 0, 'ohindex' => 0, 'idx' => 3, 'available_days' => [4,5,6]],
            ['name' => 'Brunch Week-end', 'price' => 220, 'capacity' => '12', 'duration' => '90', 'pb' => 0, 'pa' => 0, 'ohindex' => 0, 'idx' => 4, 'available_days' => [5,6]],
        ];

        $allOH = [
            [
                'name' => 'Default',
                'openhours' => array_map(fn($d) => ['type'=>'day','d'=>(string)$d,'h1'=>'10','m1'=>'30','h2'=>'1','m2'=>'0'], range(0,6))
            ],
            [
                'name' => 'Service Midi',
                'openhours' => array_map(fn($d) => ['type'=>'day','d'=>(string)$d,'h1'=>'12','m1'=>'0','h2'=>'15','m2'=>'0'], range(0,6))
            ],
        ];

        $fappField = [
            'form_identifier' => '',
            'name' => 'fieldname1',
            'shortlabel' => '',
            'index' => 0,
            'ftype' => 'fapp',
            'title' => 'Nos Formules',
            'services' => $services,
            'tables' => $tables,
            'locations' => $locations,
            'allOH' => $allOH,
            'dateFormat' => 'dd/mm/yy',
            'showDropdown' => true,
            'showTotalCost' => true,
            'showTotalCostFormat' => '{0} dh',
            'showQuantity' => true,
            'avoidOverlaping' => true,
            'required' => true,
            'militaryTime' => 1,
            'address' => 'Guéliz, Marrakech',
            'phone' => '+212524000000',
            'website' => 'https://tablebooking.ma',
            'capacity' => '65',
            'description' => 'Restaurant Italien à Marrakech',
        ];

        $formStructure = json_encode([
            [
                $fappField,
                ['form_identifier'=>'','name'=>'fieldname3','index'=>1,'ftype'=>'ftext','title'=>'Nom et prénom','required'=>true],
                ['form_identifier'=>'','name'=>'fieldname6','index'=>2,'ftype'=>'fnumber','title'=>'Téléphone','required'=>true],
                ['form_identifier'=>'','name'=>'email','index'=>3,'ftype'=>'femail','title'=>'Email','required'=>true],
                ['form_identifier'=>'','name'=>'fieldname8','index'=>4,'ftype'=>'ftextarea','title'=>'Demande spéciale','required'=>false,'rows'=>2],
            ],
            [
                ['title'=>'','description'=>'','formlayout'=>'top_aligned','formtemplate'=>'ahb_m3','evalequations'=>1,'autocomplete'=>0]
            ],
        ], JSON_UNESCAPED_UNICODE);

        DB::table('wpjn_cpappbk_forms')->updateOrInsert(
            ['id' => 13],
            [
                'form_name' => 'Dal Corso - Marrakech',
                'form_structure' => $formStructure,
                'defaultstatus' => 'Pending',
                'fp_from_email' => 'reservation@tablebooking.ma',
                'fp_from_name' => 'TableBooking.ma',
                'fp_destination_emails' => 'reservation@tablebooking.ma',
            ]
        );

        $this->command->info("✅ Form structure seeded — 12 tables, 4 locations, 4 services, 2 time slots");

        // ─────────────── 3. RESERVATIONS ───────────────
        $dates = [
            'yesterday' => Carbon::yesterday(),
            'today'     => Carbon::today(),
            'tomorrow'  => Carbon::tomorrow(),
            'dayAfter'  => Carbon::today()->addDays(2),
            'nextWeek'  => Carbon::today()->addWeek(),
            'nextMonth' => Carbon::today()->addMonth(),
        ];

        $reservations = [
            // [dateKey, time, name, phone, email, guests, service, status, notes, tableIdx]
            ['yesterday', '12:00', 'Youssef Benali', '+212661234501', 'youssef@gmail.com', 2, 'A la Carte', 'Confirmed', '', 1],
            ['today', '13:30', 'Rania Squalli', '+212662345612', 'rania@gmail.com', 2, 'A la Carte', 'Confirmed', '', 5],
            ['tomorrow', '14:00', 'Salma Ouazzani', '+212661100007', 'salma@gmail.com', 6, 'A la Carte', 'Confirmed', 'Anniversaire de mariage', 4],
            ['dayAfter', '20:30', 'Anouar Echchebbi', '+212661100016', 'anouar@gmail.com', 2, 'Formule Midi à 170 dh', 'Pending', '', null],
            ['nextWeek', '19:30', 'Saad El Glaoui', '+212662200006', 'saad@gmail.com', 6, 'A la Carte', 'Pending', 'Anniversaire', null],
            ['nextMonth', '12:00', 'Soukaina Alaoui', '+212662200009', 'soukaina@gmail.com', 4, 'A la Carte', 'Pending', 'Table terrasse', null],
        ];

        foreach ($reservations as $i => [$dateKey, $time, $name, $phone, $email, $guests, $service, $status, $notes, $tableIdx]) {
            $dateObj = $dates[$dateKey];
            [$h, $m] = explode(':', $time);
            $endTime = Carbon::createFromTime((int)$h, (int)$m)->addMinutes(90)->format('H:i');

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
                'time' => now()->subMinutes($i*3)->toDateTimeString(),
                'ipaddr' => '127.0.0.1',
                'posted_data' => $posted_data,
                'notifyto' => '',
                'data' => '',
                'whoadded' => '0',
                'table_idx' => $tableIdx,
            ]);
        }

        $this->call(LongReservationsSeeder::class);
        $this->command->info("✅ " . count($reservations) . " initial reservations created + LongReservationsSeeder completed");
    }
}   