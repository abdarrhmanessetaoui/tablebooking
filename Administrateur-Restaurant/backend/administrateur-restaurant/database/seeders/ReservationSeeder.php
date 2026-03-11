<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $formId  = 13;
        $today   = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $reservations = [

            /* ══════════════ AUJOURD'HUI ══════════════ */
            [
                'date'    => $today,
                'time'    => '12:00',
                'name'    => 'Youssef Benali',
                'phone'   => '+212661234501',
                'email'   => 'youssef.benali@gmail.com',
                'guests'  => 2,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => '',
            ],
            [
                'date'    => $today,
                'time'    => '12:30',
                'name'    => 'Sofia El Ouafi',
                'phone'   => '+212662345602',
                'email'   => 'sofia.elouafi@gmail.com',
                'guests'  => 4,
                'service' => 'Formule Midi à 170 dh',
                'status'  => 'Confirmed',
                'notes'   => 'Table en terrasse si possible',
            ],
            [
                'date'    => $today,
                'time'    => '13:00',
                'name'    => 'Mehdi Tazi',
                'phone'   => '+212663456703',
                'email'   => 'mehdi.tazi@hotmail.com',
                'guests'  => 3,
                'service' => 'Formule Midi à 170 dh',
                'status'  => 'Pending',
                'notes'   => '',
            ],
            [
                'date'    => $today,
                'time'    => '13:30',
                'name'    => 'Nadia Chraibi',
                'phone'   => '+212664567804',
                'email'   => 'nadia.chraibi@gmail.com',
                'guests'  => 2,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => 'Anniversaire - prévoir une bougie',
            ],
            [
                'date'    => $today,
                'time'    => '14:00',
                'name'    => 'Karim Fassi',
                'phone'   => '+212665678905',
                'email'   => 'karim.fassi@gmail.com',
                'guests'  => 6,
                'service' => 'A la Carte',
                'status'  => 'Cancelled',
                'notes'   => '',
            ],
            [
                'date'    => $today,
                'time'    => '19:30',
                'name'    => 'Laila Idrissi',
                'phone'   => '+212666789006',
                'email'   => 'laila.idrissi@gmail.com',
                'guests'  => 2,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => '',
            ],
            [
                'date'    => $today,
                'time'    => '20:00',
                'name'    => 'Omar Bennani',
                'phone'   => '+212667890107',
                'email'   => 'omar.bennani@gmail.com',
                'guests'  => 5,
                'service' => 'A la Carte',
                'status'  => 'Pending',
                'notes'   => 'Repas d\'affaires',
            ],
            [
                'date'    => $today,
                'time'    => '20:30',
                'name'    => 'Fatima Zhor Alami',
                'phone'   => '+212668901208',
                'email'   => 'fz.alami@gmail.com',
                'guests'  => 3,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => '',
            ],

            /* ══════════════ DEMAIN ══════════════ */
            [
                'date'    => $tomorrow,
                'time'    => '12:00',
                'name'    => 'Hassan Berrada',
                'phone'   => '+212669012309',
                'email'   => 'hassan.berrada@gmail.com',
                'guests'  => 4,
                'service' => 'Formule Midi à 170 dh',
                'status'  => 'Confirmed',
                'notes'   => '',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '12:30',
                'name'    => 'Samira Kettani',
                'phone'   => '+212660123410',
                'email'   => 'samira.kettani@gmail.com',
                'guests'  => 2,
                'service' => 'Formule Midi à 170 dh',
                'status'  => 'Pending',
                'notes'   => '',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '13:00',
                'name'    => 'Amine Hajji',
                'phone'   => '+212661234511',
                'email'   => 'amine.hajji@gmail.com',
                'guests'  => 7,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => 'Grand groupe - prévoir tables côte à côte',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '13:30',
                'name'    => 'Rania Squalli',
                'phone'   => '+212662345612',
                'email'   => 'rania.squalli@gmail.com',
                'guests'  => 2,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => '',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '19:00',
                'name'    => 'Tariq Moussaoui',
                'phone'   => '+212663456713',
                'email'   => 'tariq.moussaoui@gmail.com',
                'guests'  => 3,
                'service' => 'A la Carte',
                'status'  => 'Pending',
                'notes'   => 'Allergie aux fruits de mer',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '19:30',
                'name'    => 'Zineb El Mansouri',
                'phone'   => '+212664567814',
                'email'   => 'zineb.elmansouri@gmail.com',
                'guests'  => 2,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => '',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '20:00',
                'name'    => 'Khalid Benhaddou',
                'phone'   => '+212665678915',
                'email'   => 'khalid.benhaddou@gmail.com',
                'guests'  => 4,
                'service' => 'A la Carte',
                'status'  => 'Confirmed',
                'notes'   => 'Table dans le coin calme',
            ],
            [
                'date'    => $tomorrow,
                'time'    => '20:30',
                'name'    => 'Houda Ziani',
                'phone'   => '+212666789016',
                'email'   => 'houda.ziani@gmail.com',
                'guests'  => 2,
                'service' => 'Formule Midi à 170 dh',
                'status'  => 'Pending',
                'notes'   => '',
            ],
        ];

        foreach ($reservations as $r) {
            $date    = $r['date'];
            $dateStr = $date->format('d/m/Y');
            $dateISO = $date->format('Y-m-d');

            // Compute end time (+60 min)
            $start   = Carbon::createFromFormat('H:i', $r['time']);
            $end     = $start->copy()->addMinutes(60)->format('H:i');

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

        $this->command->info('✅ ' . count($reservations) . ' réservations créées (aujourd\'hui + demain)');
    }
}