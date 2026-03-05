public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->unsignedInteger('restaurant_form_id')->nullable()->after('id');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('restaurant_form_id');
    });
}