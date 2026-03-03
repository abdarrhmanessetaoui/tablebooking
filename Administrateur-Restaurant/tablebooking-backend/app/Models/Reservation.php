<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'restaurant_id',
        'client_name',
        'client_phone',
        'date',
        'time',
        'guests',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
    ];

    /**
     * Get the restaurant this reservation belongs to.
     */
    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
