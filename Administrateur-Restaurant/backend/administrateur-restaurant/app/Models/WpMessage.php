<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WpMessage extends Model
{
    protected $table      = 'wpjn_cpappbk_messages';
    public    $timestamps = false;

    
    protected $fillable = [
        'formid',
        'time',
        'ipaddr',
        'notifyto',
        'posted_data',
        'whoadded',
        'reminderstatus',
        'reminderstatussnd',
        'isold',
    ];

    public function form()
    {
        return $this->belongsTo(WpForm::class, 'formid');
    }

    public function getParsedDataAttribute(): array
    {
        if (empty($this->posted_data)) return [];
        $data = @unserialize($this->posted_data);
        return is_array($data) ? $data : [];
    }

    public function toCleanArray(): array
    {
        $d = $this->parsed_data;

        $rawDate = $d['app_date_1'] ?? null;
        $date    = null;
        if ($rawDate) {
            $parsed = \DateTime::createFromFormat('d/m/Y', $rawDate);
            $date   = $parsed ? $parsed->format('Y-m-d') : $rawDate;
        }

        return [
            'id'         => $this->id,
            'formid'     => $this->formid,
            'booked_at'  => $this->time,
            'name'       => $d['fieldname3']      ?? null,
            'phone'      => $d['fieldname6']      ?? null,
            'email'      => $d['email']           ?? null,
            'date'       => $date,
            'start_time' => $d['app_starttime_1'] ?? null,
            'end_time'   => $d['app_endtime_1']   ?? null,
            'guests'     => $d['app_quantity_1']  ?? null,
            'service'    => $d['app_service_1']   ?? null,
            'status'     => $d['app_status_1']    ?? null,
            'notes'      => $d['fieldname8']      ?? null,
        ];
    }
}