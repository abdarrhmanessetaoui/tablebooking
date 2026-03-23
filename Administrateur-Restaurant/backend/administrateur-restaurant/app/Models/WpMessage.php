<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class WpMessage extends Model
{
    protected $table      = 'wpjn_cpappbk_messages';
    public    $timestamps = false;

    protected $fillable = [
        'formid',
        'time',
        'ipaddr',
        'notifyto',
        'data',
        'posted_data',
        'whoadded',
        'reminderstatus',
        'reminderstatussnd',
        'isold',
        'table_idx',
    ];

    // Cache tables per form so we don't re-query on every row
    protected static array $tablesCache = [];

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

    protected function getTablesForForm(int $formId): array
    {
        if (isset(self::$tablesCache[$formId])) {
            return self::$tablesCache[$formId];
        }

        $form = DB::table('wpjn_cpappbk_forms')->where('id', $formId)->first();
        if (!$form) return self::$tablesCache[$formId] = [];

        $structure = json_decode($form->form_structure, true);
        $tables    = [];

        foreach ($structure[0] ?? [] as $field) {
            if (($field['ftype'] ?? '') === 'fapp') {
                $tables = $field['tables'] ?? [];
                break;
            }
        }

        return self::$tablesCache[$formId] = $tables;
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

        // Resolve table number and location from form structure
        $tableNumber   = null;
        $tableLocation = null;

        if ($this->table_idx) {
            $tables = $this->getTablesForForm((int) $this->formid);
            foreach ($tables as $t) {
                if ((int)($t['idx'] ?? -1) === (int) $this->table_idx) {
                    $tableNumber   = $t['number']   ?? null;
                    $tableLocation = $t['location'] ?? null;
                    break;
                }
            }
        }

        return [
            'id'             => $this->id,
            'formid'         => $this->formid,
            'booked_at'      => $this->time,
            'name'           => $d['fieldname3']      ?? null,
            'phone'          => $d['fieldname6']      ?? null,
            'email'          => $d['email']           ?? null,
            'date'           => $date,
            'start_time'     => $d['app_starttime_1'] ?? null,
            'end_time'       => $d['app_endtime_1']   ?? null,
            'guests'         => $d['app_quantity_1']  ?? null,
            'service'        => $d['app_service_1']   ?? null,
            'status'         => $d['app_status_1']    ?? null,
            'notes'          => $d['fieldname8']      ?? null,
            'table_idx'      => $this->table_idx,
            'table_number'   => $tableNumber,   
            'table_location' => $tableLocation,  
        ];
    }
}