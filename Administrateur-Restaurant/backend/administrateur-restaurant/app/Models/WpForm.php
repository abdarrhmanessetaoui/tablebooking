<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WpForm extends Model
{
    protected $table      = 'wpjn_cpappbk_forms';
    public    $timestamps = false;

    public function messages()
    {
        return $this->hasMany(WpMessage::class, 'formid');
    }
}