<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("SET SESSION sql_mode = ''");
        DB::statement("ALTER TABLE `wpjn_cpappbk_messages` ADD `table_idx` INT UNSIGNED NULL DEFAULT NULL");
    }

    public function down(): void
    {
        DB::statement("SET SESSION sql_mode = ''");
        DB::statement("ALTER TABLE `wpjn_cpappbk_messages` DROP COLUMN `table_idx`");
    }
};