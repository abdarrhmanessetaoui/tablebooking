<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedDate extends Model
{
    protected $fillable = ['date', 'reason', 'form_id'];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    public function getDateAttribute($value): string
    {
        return $value ? \Carbon\Carbon::parse($value)->format('Y-m-d') : '';
    }
}