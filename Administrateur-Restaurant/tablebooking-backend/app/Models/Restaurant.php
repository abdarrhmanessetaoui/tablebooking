<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'city',
        'slug',
        'address',
        'phone',
        'email',
        'description',
        'cuisine_type',
        'capacity',
        'opening_time',
        'closing_time',
    ];

    protected $casts = [
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];

    /**
     * Get the admin user who owns this restaurant.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all reservations for this restaurant.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
