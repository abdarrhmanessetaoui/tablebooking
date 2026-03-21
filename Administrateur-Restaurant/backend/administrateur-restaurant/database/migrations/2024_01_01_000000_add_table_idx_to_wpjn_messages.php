<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wpjn_cpappbk_messages', function (Blueprint $table) {
            $table->unsignedInteger('table_idx')->nullable()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('wpjn_cpappbk_messages', function (Blueprint $table) {
            $table->dropColumn('table_idx');
        });
    }
};