<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $formId   = 13;
        $today    = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $reservations = [

            /* ══════════════ AUJOURD'HUI ══════════════ */
            ['date' => $today, 'time' => '12:00', 'name' => 'Youssef Benali',     'phone' => '+212661234501', 'email' => 'youssef.benali@gmail.com',   'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => $today, 'time' => '12:30', 'name' => 'Sofia El Ouafi',     'phone' => '+212662345602', 'email' => 'sofia.elouafi@gmail.com',    'guests' => 4, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => 'Table en terrasse si possible'],
            ['date' => $today, 'time' => '13:00', 'name' => 'Mehdi Tazi',         'phone' => '+212663456703', 'email' => 'mehdi.tazi@hotmail.com',     'guests' => 3, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => $today, 'time' => '13:30', 'name' => 'Nadia Chraibi',      'phone' => '+212664567804', 'email' => 'nadia.chraibi@gmail.com',    'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Anniversaire - prévoir une bougie'],
            ['date' => $today, 'time' => '14:00', 'name' => 'Karim Fassi',        'phone' => '+212665678905', 'email' => 'karim.fassi@gmail.com',      'guests' => 6, 'service' => 'A la Carte',           'status' => 'Cancelled', 'notes' => ''],
            ['date' => $today, 'time' => '19:30', 'name' => 'Laila Idrissi',      'phone' => '+212666789006', 'email' => 'laila.idrissi@gmail.com',    'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => $today, 'time' => '20:00', 'name' => 'Omar Bennani',       'phone' => '+212667890107', 'email' => 'omar.bennani@gmail.com',     'guests' => 5, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Repas d\'affaires'],
            ['date' => $today, 'time' => '20:30', 'name' => 'Fatima Zhor Alami',  'phone' => '+212668901208', 'email' => 'fz.alami@gmail.com',         'guests' => 3, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],

            /* ══════════════ DEMAIN ══════════════ */
            ['date' => $tomorrow, 'time' => '12:00', 'name' => 'Hassan Berrada',     'phone' => '+212669012309', 'email' => 'hassan.berrada@gmail.com',   'guests' => 4, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => ''],
            ['date' => $tomorrow, 'time' => '12:30', 'name' => 'Samira Kettani',     'phone' => '+212660123410', 'email' => 'samira.kettani@gmail.com',   'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => $tomorrow, 'time' => '13:00', 'name' => 'Amine Hajji',        'phone' => '+212661234511', 'email' => 'amine.hajji@gmail.com',      'guests' => 7, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Grand groupe - prévoir tables côte à côte'],
            ['date' => $tomorrow, 'time' => '13:30', 'name' => 'Rania Squalli',      'phone' => '+212662345612', 'email' => 'rania.squalli@gmail.com',    'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => $tomorrow, 'time' => '19:00', 'name' => 'Tariq Moussaoui',    'phone' => '+212663456713', 'email' => 'tariq.moussaoui@gmail.com',  'guests' => 3, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Allergie aux fruits de mer'],
            ['date' => $tomorrow, 'time' => '19:30', 'name' => 'Zineb El Mansouri',  'phone' => '+212664567814', 'email' => 'zineb.elmansouri@gmail.com', 'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => $tomorrow, 'time' => '20:00', 'name' => 'Khalid Benhaddou',   'phone' => '+212665678915', 'email' => 'khalid.benhaddou@gmail.com', 'guests' => 4, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Table dans le coin calme'],
            ['date' => $tomorrow, 'time' => '20:30', 'name' => 'Houda Ziani',        'phone' => '+212666789016', 'email' => 'houda.ziani@gmail.com',      'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],

            /* ══════════════ FÉVRIER 2026 ══════════════ */
            ['date' => Carbon::parse('2026-02-03'), 'time' => '12:00', 'name' => 'Imane Boucetta',     'phone' => '+212661100001', 'email' => 'imane.boucetta@gmail.com',    'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-03'), 'time' => '13:30', 'name' => 'Yassine Mokhtar',   'phone' => '+212661100002', 'email' => 'yassine.mokhtar@gmail.com',   'guests' => 4, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Table vue jardin'],
            ['date' => Carbon::parse('2026-02-07'), 'time' => '12:30', 'name' => 'Sanae Benjelloun',  'phone' => '+212661100003', 'email' => 'sanae.benjelloun@gmail.com',  'guests' => 3, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-02-07'), 'time' => '19:00', 'name' => 'Rachid Amrani',     'phone' => '+212661100004', 'email' => 'rachid.amrani@gmail.com',     'guests' => 5, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Repas d\'affaires'],
            ['date' => Carbon::parse('2026-02-10'), 'time' => '13:00', 'name' => 'Hajar El Fassi',    'phone' => '+212661100005', 'email' => 'hajar.elfassi@gmail.com',     'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Saint-Valentin'],
            ['date' => Carbon::parse('2026-02-10'), 'time' => '20:00', 'name' => 'Adil Cherkaoui',    'phone' => '+212661100006', 'email' => 'adil.cherkaoui@gmail.com',    'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Saint-Valentin - bougie svp'],
            ['date' => Carbon::parse('2026-02-14'), 'time' => '19:30', 'name' => 'Salma Ouazzani',    'phone' => '+212661100007', 'email' => 'salma.ouazzani@gmail.com',    'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Anniversaire de mariage'],
            ['date' => Carbon::parse('2026-02-14'), 'time' => '20:30', 'name' => 'Badr Tahiri',       'phone' => '+212661100008', 'email' => 'badr.tahiri@gmail.com',       'guests' => 6, 'service' => 'A la Carte',           'status' => 'Cancelled', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-18'), 'time' => '12:00', 'name' => 'Nora Sebbahi',      'phone' => '+212661100009', 'email' => 'nora.sebbahi@gmail.com',      'guests' => 3, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-18'), 'time' => '13:30', 'name' => 'Hamza Laghrari',    'phone' => '+212661100010', 'email' => 'hamza.laghrari@gmail.com',    'guests' => 4, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-21'), 'time' => '19:00', 'name' => 'Widad El Khoukhi',  'phone' => '+212661100011', 'email' => 'widad.elkhoukhi@gmail.com',   'guests' => 2, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-02-21'), 'time' => '20:00', 'name' => 'Othmane Berroho',   'phone' => '+212661100012', 'email' => 'othmane.berroho@gmail.com',   'guests' => 8, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Groupe - prévoir grande table'],
            ['date' => Carbon::parse('2026-02-25'), 'time' => '12:30', 'name' => 'Ghita Zouiten',     'phone' => '+212661100013', 'email' => 'ghita.zouiten@gmail.com',     'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-25'), 'time' => '13:00', 'name' => 'Ismail Bennasser',  'phone' => '+212661100014', 'email' => 'ismail.bennasser@gmail.com',  'guests' => 3, 'service' => 'A la Carte',           'status' => 'Cancelled', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-28'), 'time' => '19:30', 'name' => 'Loubna Rifai',      'phone' => '+212661100015', 'email' => 'loubna.rifai@gmail.com',      'guests' => 4, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-02-28'), 'time' => '20:30', 'name' => 'Anouar Echchebbi',  'phone' => '+212661100016', 'email' => 'anouar.echchebbi@gmail.com',  'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],

            /* ══════════════ AVRIL 2026 (mois prochain) ══════════════ */
            ['date' => Carbon::parse('2026-04-02'), 'time' => '12:00', 'name' => 'Meriem Lahlou',      'phone' => '+212662200001', 'email' => 'meriem.lahlou@gmail.com',     'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-04-02'), 'time' => '13:30', 'name' => 'Kamal Tlemcani',     'phone' => '+212662200002', 'email' => 'kamal.tlemcani@gmail.com',    'guests' => 5, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Réunion d\'équipe'],
            ['date' => Carbon::parse('2026-04-05'), 'time' => '12:30', 'name' => 'Zineb Sabri',        'phone' => '+212662200003', 'email' => 'zineb.sabri@gmail.com',       'guests' => 3, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-04-05'), 'time' => '19:00', 'name' => 'Ayoub Hamdaoui',     'phone' => '+212662200004', 'email' => 'ayoub.hamdaoui@gmail.com',    'guests' => 4, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Allergie gluten'],
            ['date' => Carbon::parse('2026-04-08'), 'time' => '13:00', 'name' => 'Hind Benkirane',     'phone' => '+212662200005', 'email' => 'hind.benkirane@gmail.com',    'guests' => 2, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-04-08'), 'time' => '20:00', 'name' => 'Saad El Glaoui',     'phone' => '+212662200006', 'email' => 'saad.elglaoui@gmail.com',     'guests' => 6, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Anniversaire'],
            ['date' => Carbon::parse('2026-04-11'), 'time' => '12:00', 'name' => 'Amal Benhima',       'phone' => '+212662200007', 'email' => 'amal.benhima@gmail.com',      'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-04-11'), 'time' => '19:30', 'name' => 'Ilyas Zemmouri',     'phone' => '+212662200008', 'email' => 'ilyas.zemmouri@gmail.com',    'guests' => 3, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-04-15'), 'time' => '12:30', 'name' => 'Soukaina Alaoui',    'phone' => '+212662200009', 'email' => 'soukaina.alaoui@gmail.com',   'guests' => 4, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Table terrasse'],
            ['date' => Carbon::parse('2026-04-15'), 'time' => '20:30', 'name' => 'Mouad Filali',       'phone' => '+212662200010', 'email' => 'mouad.filali@gmail.com',      'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-04-18'), 'time' => '13:00', 'name' => 'Dounia Rhazali',     'phone' => '+212662200011', 'email' => 'dounia.rhazali@gmail.com',    'guests' => 5, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-04-18'), 'time' => '19:00', 'name' => 'Khalil Benatmane',   'phone' => '+212662200012', 'email' => 'khalil.benatmane@gmail.com',  'guests' => 2, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-04-22'), 'time' => '12:00', 'name' => 'Yasmine Essaidi',    'phone' => '+212662200013', 'email' => 'yasmine.essaidi@gmail.com',   'guests' => 3, 'service' => 'Formule Midi à 170 dh', 'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-04-22'), 'time' => '20:00', 'name' => 'Tarik El Idrissi',   'phone' => '+212662200014', 'email' => 'tarik.elidrissi@gmail.com',   'guests' => 4, 'service' => 'A la Carte',           'status' => 'Confirmed', 'notes' => 'Repas d\'affaires'],
            ['date' => Carbon::parse('2026-04-26'), 'time' => '13:30', 'name' => 'Meryem Chafai',      'phone' => '+212662200015', 'email' => 'meryem.chafai@gmail.com',     'guests' => 2, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => ''],
            ['date' => Carbon::parse('2026-04-26'), 'time' => '19:30', 'name' => 'Younes Benchekroun', 'phone' => '+212662200016', 'email' => 'younes.benchekroun@gmail.com','guests' => 6, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => 'Grand groupe'],
            ['date' => Carbon::parse('2026-04-29'), 'time' => '12:00', 'name' => 'Laila Mansouri',     'phone' => '+212662200017', 'email' => 'laila.mansouri@gmail.com',    'guests' => 2, 'service' => 'Formule Midi à 170 dh', 'status' => 'Confirmed', 'notes' => ''],
            ['date' => Carbon::parse('2026-04-29'), 'time' => '20:30', 'name' => 'Anas Belkadi',       'phone' => '+212662200018', 'email' => 'anas.belkadi@gmail.com',      'guests' => 3, 'service' => 'A la Carte',           'status' => 'Pending',   'notes' => ''],
        ];

        foreach ($reservations as $r) {
            $date    = $r['date'];
            $dateStr = $date->format('d/m/Y');
            $dateISO = $date->format('Y-m-d');

            $start = Carbon::createFromFormat('H:i', $r['time']);
            $end   = $start->copy()->addMinutes(60)->format('H:i');

            $posted_data = serialize([
                'fieldname3'      => $r['name'],
                'fieldname6'      => $r['phone'],
                'email'           => $r['email'],
                'app_date_1'      => $dateStr,
                'app_starttime_1' => $r['time'],
                'app_endtime_1'   => $end,
                'app_quantity_1'  => (string) $r['guests'],
                'app_service_1'   => $r['service'],
                'app_status_1'    => $r['status'],
                'apps'            => [[
                    'id'        => 1,
                    'cancelled' => $r['status'],
                    'service'   => $r['service'],
                    'date'      => $dateISO,
                    'slot'      => $r['time'] . '/' . $end,
                    'quant'     => (string) $r['guests'],
                ]],
                'fieldname8'      => $r['notes'],
                'fieldname12'     => $date->locale('fr')->isoFormat('dddd D MMMM YYYY'),
                'fieldname13'     => $date->locale('en')->isoFormat('dddd, MMMM D, YYYY'),
            ]);

            DB::table('wpjn_cpappbk_messages')->insert([
                'formid'      => $formId,
                'time'        => now()->toDateTimeString(),
                'ipaddr'      => '127.0.0.1',
                'posted_data' => $posted_data,
                'notifyto'    => '',
                'data'        => '',
                'whoadded'    => '0',
            ]);
        }

        $this->command->info('✅ ' . count($reservations) . ' réservations créées — Aujourd\'hui + Demain + Février + Avril 2026');
    }
}