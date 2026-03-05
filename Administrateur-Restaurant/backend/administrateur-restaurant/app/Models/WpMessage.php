<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WpMessage extends Model
{
    protected $table      = 'wpjn_cpappbk_messages';
    public    $timestamps = false;

    protected $fillable   = ['reminderstatus', 'isold'];

    public function form()
    {
        return $this->belongsTo(WpForm::class, 'formid');
    }

    // Auto-unserialize posted_data
    public function getParsedDataAttribute(): array
    {
        if (empty($this->posted_data)) return [];
        $data = @unserialize($this->posted_data);
        return is_array($data) ? $data : [];
    }

    // Clean structured output for React
    public function toCleanArray(): array
    {
        $d = $this->parsed_data;

        return [
            'id'         => $this->id,
            'formid'     => $this->formid,
            'booked_at'  => $this->time,
            'name'       => $d['fieldname3']       ?? null,
            'phone'      => $d['fieldname6']       ?? null,
            'email'      => $d['email']            ?? null,
            'date'       => $d['app_date_1']       ?? null,
            'start_time' => $d['app_starttime_1']  ?? null,
            'end_time'   => $d['app_endtime_1']    ?? null,
            'guests'     => $d['app_quantity_1']   ?? null,
            'service'    => $d['app_service_1']    ?? null,
            'status'     => $d['app_status_1']     ?? null,
            'price'      => $d['final_price']      ?? null,
            'notes'      => $d['fieldname8']       ?? null,
        ];
    }
}