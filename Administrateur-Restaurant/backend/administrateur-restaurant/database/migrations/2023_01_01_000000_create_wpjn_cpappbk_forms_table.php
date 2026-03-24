<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('wpjn_cpappbk_forms')) return;

        Schema::create('wpjn_cpappbk_forms', function (Blueprint $table) {
            $table->mediumIncrements('id');
            $table->text('form_name')->nullable();
            $table->mediumText('form_structure')->nullable();
            $table->text('calendar_language')->nullable();
            $table->text('date_format')->nullable();
            $table->text('product_name')->nullable();
            $table->text('pay_later_label')->nullable();
            $table->text('defaultstatus')->nullable();
            $table->text('defaultpaidstatus')->nullable();
            $table->text('fp_from_email')->nullable();
            $table->text('fp_from_name')->nullable();
            $table->text('fp_destination_emails')->nullable();
            $table->text('fp_subject')->nullable();
            $table->string('fp_inc_additional_info', 10)->nullable();
            $table->string('fp_return_page', 500)->nullable();
            $table->text('fp_message')->nullable();
            $table->string('fp_emailformat', 10)->nullable();
            $table->string('fp_emailtomethod', 10)->nullable();
            $table->text('fp_destination_emails_field')->nullable();
            $table->string('cu_enable_copy_to_user', 10)->nullable();
            $table->string('cu_user_email_field', 250)->nullable();
            $table->string('cu_subject', 250)->nullable();
            $table->text('cu_message')->nullable();
            $table->string('cu_emailformat', 10)->nullable();
            $table->string('fp_emailfrommethod', 10)->nullable();
            $table->text('vs_text_maxapp')->nullable();
            $table->text('vs_text_is_required')->nullable();
            $table->text('vs_text_is_email')->nullable();
            $table->text('vs_text_datemmddyyyy')->nullable();
            $table->text('vs_text_dateddmmyyyy')->nullable();
            $table->text('vs_text_number')->nullable();
            $table->text('vs_text_digits')->nullable();
            $table->text('vs_text_max')->nullable();
            $table->text('vs_text_min')->nullable();
            $table->text('vs_text_pageof')->nullable();
            $table->text('vs_text_submitbtn')->nullable();
            $table->text('vs_text_previousbtn')->nullable();
            $table->text('vs_text_nextbtn')->nullable();
            $table->text('vs_text_quantity')->nullable();
            $table->text('vs_text_cancel')->nullable();
            $table->text('vs_text_cost')->nullable();
            $table->text('vs_text_nomore')->nullable();
            $table->text('vs_text_nmore')->nullable();
            $table->text('cp_user_access')->nullable();
            $table->string('cp_user_access_settings', 10)->nullable();
            $table->string('display_emails_endtime', 10)->nullable();
            $table->string('rep_enable', 10)->nullable();
            $table->string('rep_days', 10)->nullable();
            $table->string('rep_hour', 10)->nullable();
            $table->text('rep_emails')->nullable();
            $table->text('rep_subject')->nullable();
            $table->string('rep_emailformat', 10)->nullable();
            $table->text('rep_message')->nullable();
            $table->string('cv_enable_captcha', 20)->nullable();
            $table->string('cv_width', 20)->nullable();
            $table->string('cv_height', 20)->nullable();
            $table->string('cv_chars', 20)->nullable();
            $table->string('cv_font', 20)->nullable();
            $table->string('cv_min_font_size', 20)->nullable();
            $table->string('cv_max_font_size', 20)->nullable();
            $table->string('cv_noise', 20)->nullable();
            $table->string('cv_noise_length', 20)->nullable();
            $table->string('cv_background', 20)->nullable();
            $table->string('cv_border', 20)->nullable();
            $table->string('cv_text_enter_valid_captcha', 200)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wpjn_cpappbk_forms');
    }
};