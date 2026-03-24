<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create the table if it doesn't exist yet (fresh install / migrate:fresh)
        if (!Schema::hasTable('wpjn_cpappbk_messages')) {
            Schema::create('wpjn_cpappbk_messages', function (Blueprint $table) {
                $table->mediumIncrements('id');
                $table->mediumInteger('formid')->unsigned()->default(0);
                $table->string('time', 30)->nullable();
                $table->string('ipaddr', 50)->nullable();
                $table->text('notifyto')->nullable();
                $table->longText('data')->nullable();
                $table->longText('posted_data')->nullable();
                $table->string('whoadded', 50)->nullable();
                $table->string('reminderstatus', 10)->nullable();
                $table->string('reminderstatussnd', 10)->nullable();
                $table->string('isold', 5)->nullable();
                $table->integer('table_idx')->unsigned()->nullable()->default(null);
            });
            return;
        }

        // Table already exists (existing install) — just add the column if missing
        if (!Schema::hasColumn('wpjn_cpappbk_messages', 'table_idx')) {
            DB::statement("SET SESSION sql_mode = ''");
            DB::statement("ALTER TABLE `wpjn_cpappbk_messages` ADD `table_idx` INT UNSIGNED NULL DEFAULT NULL");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('wpjn_cpappbk_messages') &&
            Schema::hasColumn('wpjn_cpappbk_messages', 'table_idx')) {
            DB::statement("SET SESSION sql_mode = ''");
            DB::statement("ALTER TABLE `wpjn_cpappbk_messages` DROP COLUMN `table_idx`");
        }
    }
};