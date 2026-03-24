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
        // ══════════════════════════════════════════════════════════════
        // 1. USER
        // ══════════════════════════════════════════════════════════════
        $userId = DB::table('users')->insertGetId([
            'name'                => 'Dal Corso Admin',
            'email'               => 'admin@tablebooking.ma',
            'password'            => 'password',
            'restaurant_form_id'  => 13,
            'email_verified_at'   => now(),
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        $this->command->info("✅ User created — admin@tablebooking.ma / password");

        // ══════════════════════════════════════════════════════════════
        // 2. FORM STRUCTURE (tables, locations, services, time slots)
        // ══════════════════════════════════════════════════════════════

        $tables = [
            ['idx' => 1, 'number' => '1',            'capacity' => 2,  'location' => 'Intérieur',   'active' => true],
            ['idx' => 2, 'number' => '2',            'capacity' => 4,  'location' => 'Intérieur',   'active' => true],
            ['idx' => 3, 'number' => '3',            'capacity' => 4,  'location' => 'Intérieur',   'active' => true],
            ['idx' => 4, 'number' => '4',            'capacity' => 6,  'location' => 'Intérieur',   'active' => true],
            ['idx' => 5, 'number' => 'T1',           'capacity' => 2,  'location' => 'Terrasse',    'active' => true],
            ['idx' => 6, 'number' => 'T2',           'capacity' => 4,  'location' => 'Terrasse',    'active' => true],
            ['idx' => 7, 'number' => 'T3',           'capacity' => 6,  'location' => 'Terrasse',    'active' => true],
            ['idx' => 8, 'number' => 'B1',           'capacity' => 2,  'location' => 'Bar',         'active' => true],
            ['idx' => 9, 'number' => 'B2',           'capacity' => 4,  'location' => 'Bar',         'active' => true],
            ['idx' => 10,'number' => 'VIP',          'capacity' => 10, 'location' => 'Salon privé', 'active' => true],
            ['idx' => 11,'number' => 'VIP 2',        'capacity' => 8,  'location' => 'Salon privé', 'active' => true],
            ['idx' => 12,'number' => 'Coin fenêtre', 'capacity' => 2,  'location' => 'Intérieur',   'active' => false],
        ];

        $locations = [
            ['id' => 1, 'name' => 'Intérieur',   'color' => '#4f6ef7'],
            ['id' => 2, 'name' => 'Terrasse',    'color' => '#16a34a'],
            ['id' => 3, 'name' => 'Bar',         'color' => '#a8834e'],
            ['id' => 4, 'name' => 'Salon privé', 'color' => '#b94040'],
        ];

        $services = [
            ['name' => 'A la Carte',           'price' => 0,   'capacity' => '15', 'duration' => '90', 'pb' => 0, 'pa' => 0, 'ohindex' => 0, 'idx' => 1, 'available_days' => [0,1,2,3,4,5,6]],
            ['name' => 'Formule Midi à 170 dh','price' => 170, 'capacity' => '15', 'duration' => '60', 'pb' => 0, 'pa' => 0, 'ohindex' => 1, 'idx' => 2, 'available_days' => [0,1,2,3,4,5,6]],
            ['name' => 'Menu Dégustation',     'price' => 350, 'capacity' => '8',  'duration' => '120','pb' => 0, 'pa' => 0, 'ohindex' => 0, 'idx' => 3, 'available_days' => [4,5,6]],
            ['name' => 'Brunch Week-end',      'price' => 220, 'capacity' => '12', 'duration' => '90', 'pb' => 0, 'pa' => 0, 'ohindex' => 0, 'idx' => 4, 'available_days' => [5,6]],
        ];

        $allOH = [
            [
                'name' => 'Default',
                'openhours' => array_map(fn($d) => ['type' => 'day', 'd' => (string)$d, 'h1' => '10', 'm1' => '30', 'h2' => '1', 'm2' => '0'], range(0, 6)),
            ],
            [
                'name' => 'Service Midi',
                'openhours' => array_map(fn($d) => ['type' => 'day', 'd' => (string)$d, 'h1' => '12', 'm1' => '0', 'h2' => '15', 'm2' => '0'], range(0, 6)),
            ],
        ];

        $fappField = [
            'form_identifier' => '',
            'name'            => 'fieldname1',
            'shortlabel'      => '',
            'index'           => 0,
            'ftype'           => 'fapp',
            'userhelp'        => '',
            'userhelpTooltip' => false,
            'csslayout'       => 'service_with_dropdown_dependent',
            'title'           => 'Nos Formules',
            'services'        => $services,
            'openhours'       => [],
            'allOH'           => $allOH,
            'tables'          => $tables,
            'locations'       => $locations,
            'dateFormat'      => 'dd/mm/yy',
            'showDropdown'    => true,
            'showTotalCost'   => true,
            'showTotalCostFormat' => '{0} dh',
            'showEndTime'     => false,
            'showQuantity'    => true,
            'usedSlotsCheckbox' => true,
            'avoidOverlaping' => true,
            'emptySelectCheckbox' => false,
            'emptySelect'     => 'Nos Formules',
            'dropdownRange'   => '0:+1',
            'working_dates'   => [true, true, true, true, true, true, true],
            'numberOfMonths'  => 1,
            'maxNumberOfApp'  => '1',
            'firstDay'        => '1',
            'minDate'         => '0',
            'maxDate'         => '',
            'defaultDate'     => '',
            'invalidDates'    => '',
            'invalidDatesReasons' => '{}',
            'tmpinvalidDates' => [],
            'tmpinvalidDatestime' => [],
            'required'        => true,
            'militaryTime'    => 1,
            'fBuild'          => [],
            'address'         => 'Guéliz, Marrakech',
            'phone'           => '+212524000000',
            'website'         => 'https://tablebooking.ma',
            'google_maps_link'=> '',
            'capacity'        => '65',
            'description'     => 'Restaurant Italien à Marrakech',
        ];

        $formStructure = json_encode([
            [
                $fappField,
                ['form_identifier' => '', 'name' => 'fieldname3', 'shortlabel' => '', 'index' => 1, 'ftype' => 'ftext',     'title' => 'Nom et prénom',    'required' => true,  'size' => 'large', 'fBuild' => []],
                ['form_identifier' => '', 'name' => 'fieldname6', 'shortlabel' => '', 'index' => 2, 'ftype' => 'fnumber',   'title' => 'Téléphone',        'required' => true,  'size' => 'large', 'fBuild' => []],
                ['form_identifier' => '', 'name' => 'email',      'shortlabel' => '', 'index' => 3, 'ftype' => 'femail',    'title' => 'Email',            'required' => true,  'size' => 'large', 'fBuild' => []],
                ['form_identifier' => '', 'name' => 'fieldname8', 'shortlabel' => '', 'index' => 4, 'ftype' => 'ftextarea', 'title' => 'Demande spéciale', 'required' => false, 'size' => 'large', 'rows' => '2', 'fBuild' => []],
            ],
            [
                ['title' => '', 'description' => '', 'formlayout' => 'top_aligned', 'formtemplate' => 'ahb_m3', 'evalequations' => 1, 'autocomplete' => 0, 'autofocus' => false],
            ],
        ], JSON_UNESCAPED_UNICODE);

        // Upsert form row
        $existingForm = DB::table('wpjn_cpappbk_forms')->where('id', 13)->first();
        if ($existingForm) {
            DB::table('wpjn_cpappbk_forms')->where('id', 13)->update([
                'form_name'              => 'Dal Corso - Marrakech',
                'form_structure'         => $formStructure,
                'defaultstatus'          => 'Pending',
                'fp_from_email'          => 'reservation@tablebooking.ma',
                'fp_from_name'           => 'TableBooking.ma',
                'fp_destination_emails'  => 'reservation@tablebooking.ma',
            ]);
        } else {
            DB::table('wpjn_cpappbk_forms')->insert([
                'id'                     => 13,
                'form_name'              => 'Dal Corso - Marrakech',
                'form_structure'         => $formStructure,
                'defaultstatus'          => 'Pending',
                'fp_from_email'          => 'reservation@tablebooking.ma',
                'fp_from_name'           => 'TableBooking.ma',
                'fp_destination_emails'  => 'reservation@tablebooking.ma',
            ]);
        }

        $this->command->info("✅ Form structure seeded — 12 tables, 4 locations, 4 services, 2 time slots");

        // ══════════════════════════════════════════════════════════════
        // 3. RESERVATIONS
        // ══════════════════════════════════════════════════════════════

        $yesterday  = Carbon::yesterday();
        $today      = Carbon::today();
        $tomorrow   = Carbon::tomorrow();
        $dayAfter   = Carbon::today()->addDays(2);
        $nextWeek   = Carbon::today()->addWeek();
        $nextMonth  = Carbon::today()->addMonth();

        // [date, time, name, phone, email, guests, service, status, notes, table_idx]
        $reservations = [

            // ── Hier ──────────────────────────────────────────────────
            [$yesterday, '12:00', 'Youssef Benali',    '+212661234501', 'youssef@gmail.com',   2, 'A la Carte',            'Confirmed', '',                              1],
            [$yesterday, '12:30', 'Sofia El Ouafi',    '+212662345602', 'sofia@gmail.com',     4, 'Formule Midi à 170 dh', 'Confirmed', 'Table en terrasse',             6],
            [$yesterday, '13:00', 'Mehdi Tazi',        '+212663456703', 'mehdi@hotmail.com',   3, 'Formule Midi à 170 dh', 'Confirmed', '',                              2],
            [$yesterday, '13:30', 'Nadia Chraibi',     '+212664567804', 'nadia@gmail.com',     2, 'A la Carte',            'Confirmed', 'Anniversaire',                  5],
            [$yesterday, '19:30', 'Laila Idrissi',     '+212666789006', 'laila@gmail.com',     2, 'A la Carte',            'Confirmed', '',                              1],
            [$yesterday, '20:00', 'Omar Bennani',      '+212667890107', 'omar@gmail.com',      5, 'A la Carte',            'Cancelled', 'Repas d\'affaires',             null],
            [$yesterday, '20:30', 'Fatima Alami',      '+212668901208', 'fatima@gmail.com',    3, 'A la Carte',            'Confirmed', '',                              4],
            [$yesterday, '14:00', 'Karim Fassi',       '+212665678905', 'karim@gmail.com',     6, 'A la Carte',            'Cancelled', '',                              null],

            // ── Aujourd'hui ───────────────────────────────────────────
            [$today, '12:00', 'Hassan Berrada',        '+212669012309', 'hassan@gmail.com',    4, 'Formule Midi à 170 dh', 'Confirmed', '',                              3],
            [$today, '12:30', 'Samira Kettani',        '+212660123410', 'samira@gmail.com',    2, 'Formule Midi à 170 dh', 'Pending',   '',                              null],
            [$today, '13:00', 'Amine Hajji',           '+212661234511', 'amine@gmail.com',     7, 'A la Carte',            'Confirmed', 'Grand groupe',                  10],
            [$today, '13:30', 'Rania Squalli',         '+212662345612', 'rania@gmail.com',     2, 'A la Carte',            'Confirmed', '',                              5],
            [$today, '14:00', 'Tariq Moussaoui',       '+212663456713', 'tariq@gmail.com',     3, 'A la Carte',            'Pending',   'Allergie fruits de mer',        null],
            [$today, '19:00', 'Zineb El Mansouri',     '+212664567814', 'zineb@gmail.com',     2, 'A la Carte',            'Confirmed', '',                              1],
            [$today, '19:30', 'Khalid Benhaddou',      '+212665678915', 'khalid@gmail.com',    4, 'A la Carte',            'Confirmed', 'Coin calme',                    2],
            [$today, '20:00', 'Houda Ziani',           '+212666789016', 'houda@gmail.com',     2, 'Formule Midi à 170 dh', 'Pending',   '',                              null],
            [$today, '20:30', 'Imane Boucetta',        '+212661100001', 'imane@gmail.com',     2, 'A la Carte',            'Confirmed', '',                              6],
            [$today, '21:00', 'Yassine Mokhtar',       '+212661100002', 'yassine@gmail.com',   4, 'Menu Dégustation',      'Confirmed', 'Menu spécial',                  11],

            // ── Demain ────────────────────────────────────────────────
            [$tomorrow, '12:00', 'Sanae Benjelloun',   '+212661100003', 'sanae@gmail.com',     3, 'Formule Midi à 170 dh', 'Pending',   '',                              null],
            [$tomorrow, '12:30', 'Rachid Amrani',      '+212661100004', 'rachid@gmail.com',    5, 'A la Carte',            'Confirmed', 'Repas d\'affaires',             10],
            [$tomorrow, '13:00', 'Hajar El Fassi',     '+212661100005', 'hajar@gmail.com',     2, 'Brunch Week-end',       'Confirmed', '',                              5],
            [$tomorrow, '13:30', 'Adil Cherkaoui',     '+212661100006', 'adil@gmail.com',      2, 'A la Carte',            'Pending',   '',                              null],
            [$tomorrow, '14:00', 'Salma Ouazzani',     '+212661100007', 'salma@gmail.com',     6, 'A la Carte',            'Confirmed', 'Anniversaire de mariage',       4],
            [$tomorrow, '19:00', 'Badr Tahiri',        '+212661100008', 'badr@gmail.com',      4, 'A la Carte',            'Pending',   '',                              null],
            [$tomorrow, '19:30', 'Nora Sebbahi',       '+212661100009', 'nora@gmail.com',      3, 'Menu Dégustation',      'Confirmed', '',                              11],
            [$tomorrow, '20:00', 'Hamza Laghrari',     '+212661100010', 'hamza@gmail.com',     4, 'A la Carte',            'Confirmed', '',                              3],
            [$tomorrow, '20:30', 'Widad El Khoukhi',   '+212661100011', 'widad@gmail.com',     2, 'A la Carte',            'Pending',   '',                              null],
            [$tomorrow, '21:00', 'Othmane Berroho',    '+212661100012', 'othmane@gmail.com',   8, 'A la Carte',            'Confirmed', 'Grande table',                  10],

            // ── Après-demain ──────────────────────────────────────────
            [$dayAfter, '12:00', 'Ghita Zouiten',      '+212661100013', 'ghita@gmail.com',     2, 'Formule Midi à 170 dh', 'Pending',   '',                              null],
            [$dayAfter, '13:00', 'Ismail Bennasser',   '+212661100014', 'ismail@gmail.com',    3, 'A la Carte',            'Pending',   '',                              null],
            [$dayAfter, '19:30', 'Loubna Rifai',       '+212661100015', 'loubna@gmail.com',    4, 'A la Carte',            'Pending',   '',                              null],
            [$dayAfter, '20:30', 'Anouar Echchebbi',   '+212661100016', 'anouar@gmail.com',    2, 'Formule Midi à 170 dh', 'Pending',   '',                              null],

            // ── Semaine prochaine ─────────────────────────────────────
            [$nextWeek, '12:00', 'Meriem Lahlou',      '+212662200001', 'meriem@gmail.com',    2, 'Formule Midi à 170 dh', 'Pending',   '',                              null],
            [$nextWeek, '13:30', 'Kamal Tlemcani',     '+212662200002', 'kamal@gmail.com',     5, 'A la Carte',            'Pending',   'Réunion d\'équipe',             null],
            [$nextWeek, '19:00', 'Zineb Sabri',        '+212662200003', 'zsabri@gmail.com',    3, 'Menu Dégustation',      'Confirmed', '',                              11],
            [$nextWeek, '20:00', 'Ayoub Hamdaoui',     '+212662200004', 'ayoub@gmail.com',     4, 'A la Carte',            'Pending',   'Allergie gluten',               null],
            [$nextWeek->copy()->addDay(), '12:30', 'Hind Benkirane', '+212662200005', 'hind@gmail.com', 2, 'Brunch Week-end', 'Confirmed', '',                           5],
            [$nextWeek->copy()->addDay(), '19:30', 'Saad El Glaoui', '+212662200006', 'saad@gmail.com', 6, 'A la Carte',    'Pending',   'Anniversaire',                 null],
            [$nextWeek->copy()->addDays(2), '13:00', 'Amal Benhima','+212662200007', 'amal@gmail.com',  2, 'Formule Midi à 170 dh', 'Pending', '',                      null],
            [$nextWeek->copy()->addDays(2), '20:30', 'Ilyas Zemmouri','+212662200008','ilyas@gmail.com', 3, 'A la Carte',  'Confirmed', '',                              2],

            // ── Mois prochain ─────────────────────────────────────────
            [$nextMonth, '12:00', 'Soukaina Alaoui',   '+212662200009', 'soukaina@gmail.com',  4, 'A la Carte',            'Pending',   'Table terrasse',                null],
            [$nextMonth, '13:30', 'Mouad Filali',      '+212662200010', 'mouad@gmail.com',     2, 'Formule Midi à 170 dh', 'Pending',   '',                              null],
            [$nextMonth, '19:00', 'Dounia Rhazali',    '+212662200011', 'dounia@gmail.com',    5, 'A la Carte',            'Confirmed', '',                              4],
            [$nextMonth, '20:00', 'Khalil Benatmane',  '+212662200012', 'khalil@gmail.com',    2, 'Menu Dégustation',      'Pending',   '',                              null],
            [$nextMonth->copy()->addDays(3), '12:30', 'Yasmine Essaidi','+212662200013','yasmine@gmail.com', 3, 'Formule Midi à 170 dh', 'Pending', '',                  null],
            [$nextMonth->copy()->addDays(3), '19:30', 'Tarik El Idrissi','+212662200014','tarik@gmail.com',  4, 'A la Carte', 'Confirmed', 'Repas d\'affaires',          3],
            [$nextMonth->copy()->addDays(7), '13:00', 'Meryem Chafai','+212662200015','meryem@gmail.com',   2, 'A la Carte', 'Pending',   '',                           null],
            [$nextMonth->copy()->addDays(7), '20:00', 'Younes Benchekroun','+212662200016','younes@gmail.com', 6, 'A la Carte', 'Pending', 'Grand groupe',              null],
        ];

        $count = 0;
        foreach ($reservations as [$date, $time, $name, $phone, $email, $guests, $service, $status, $notes, $tableIdx]) {
            $dateObj = $date instanceof Carbon ? $date : Carbon::parse($date);
            $dateStr = $dateObj->format('d/m/Y');
            $dateISO = $dateObj->format('Y-m-d');

            [$h, $m]  = explode(':', $time);
            $endTime  = Carbon::createFromTime((int)$h, (int)$m)->addMinutes(90)->format('H:i');

            $posted_data = serialize([
                'fieldname3'      => $name,
                'fieldname6'      => $phone,
                'email'           => $email,
                'app_date_1'      => $dateStr,
                'app_starttime_1' => $time,
                'app_endtime_1'   => $endTime,
                'app_quantity_1'  => (string) $guests,
                'app_service_1'   => $service,
                'app_status_1'    => $status,
                'apps'            => [[
                    'id'        => 1,
                    'cancelled' => $status,
                    'service'   => $service,
                    'date'      => $dateISO,
                    'slot'      => $time . '/' . $endTime,
                    'quant'     => (string) $guests,
                ]],
                'fieldname8'      => $notes,
                'fieldname12'     => $dateObj->locale('fr')->isoFormat('dddd D MMMM YYYY'),
                'fieldname13'     => $dateObj->locale('en')->isoFormat('dddd, MMMM D, YYYY'),
            ]);

            $msgId = DB::table('wpjn_cpappbk_messages')->insertGetId([
                'formid'      => 13,
                'time'        => now()->subMinutes($count * 3)->toDateTimeString(),
                'ipaddr'      => '127.0.0.1',
                'posted_data' => $posted_data,
                'notifyto'    => '',
                'data'        => '',
                'whoadded'    => '0',
                'table_idx'   => $tableIdx,
            ]);

            $count++;
        }

        $this->command->info("✅ {$count} réservations créées — Hier + Aujourd'hui + Demain + Après-demain + Semaine prochaine + Mois prochain");
        $this->command->newLine();
        $this->command->line('  Login : <fg=yellow>admin@tablebooking.ma</> / <fg=yellow>password</>');
        $this->command->line('  Form  : <fg=yellow>ID 13 — Dal Corso Marrakech</>');
        $this->command->line('  Tables: <fg=yellow>12 tables (4 zones)</>');
        $this->command->line('  Résa  : <fg=yellow>' . $count . ' réservations</>');
    }
}