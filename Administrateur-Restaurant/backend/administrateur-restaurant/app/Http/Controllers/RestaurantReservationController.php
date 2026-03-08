<?php
// Remplace la méthode store() dans RestaurantReservationController.php

public function store(Request $request)
{
    $request->validate([
        'name'       => 'required|string',
        'date'       => 'required|date',        // reçoit Y-m-d depuis le frontend
        'start_time' => 'required|string',
        'guests'     => 'required|integer|min:1',
        'status'     => 'in:Pending,Confirmed,Cancelled',
    ]);

    $status     = $request->status     ?? 'Pending';
    $service    = $request->service    ?? '';
    $guests     = $request->guests;
    $startTime  = $request->start_time;

    // Convertir Y-m-d → d/m/Y (format attendu par toCleanArray)
    $dateObj    = \DateTime::createFromFormat('Y-m-d', $request->date);
    $dateFr     = $dateObj ? $dateObj->format('d/m/Y') : $request->date;
    $dateIso    = $dateObj ? $dateObj->format('Y-m-d') : $request->date;

    // Calculer end_time (+1h par défaut)
    $endTime = date('H:i', strtotime($startTime) + 3600);

    $posted_data = serialize([
        // Champs identiques au format WordPress
        'apps' => [
            0 => [
                'id'        => 1,
                'cancelled' => $status,      // ← utilisé par updateStatus()
                'service'   => $service,
                'date'      => $dateIso,
                'slot'      => $startTime . '/' . $endTime,
                'quant'     => (string) $guests,
            ]
        ],
        'app_service_1'   => $service,
        'app_status_1'    => $status,         // ← lu par toCleanArray()
        'app_date_1'      => $dateFr,         // ← lu par toCleanArray() en d/m/Y
        'app_starttime_1' => $startTime,
        'app_endtime_1'   => $endTime,
        'app_quantity_1'  => (string) $guests,
        'fieldname3'      => $request->name,
        'fieldname6'      => $request->phone  ?? '',
        'email'           => $request->email  ?? '',
        'fieldname8'      => $request->notes  ?? '',
        'formid'          => $this->formId(),
        'request_timestamp' => now()->format('d/m/Y H:i:s'),
    ]);

    $message = WpMessage::create([
        'formid'      => $this->formId(),
        'time'        => now()->toDateTimeString(),
        'ipaddr'      => $request->ip(),
        'whoadded'    => auth()->user()->name ?? 'admin',
        'posted_data' => $posted_data,
    ]);

    return response()->json($message->toCleanArray(), 201);
}