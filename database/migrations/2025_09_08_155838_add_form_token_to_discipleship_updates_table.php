<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('discipleship_updates', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change();
            $table->foreignId('form_token_id')->nullable()->constrained('form_tokens')->onDelete('set null');
            $table->index('form_token_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discipleship_updates', function (Blueprint $table) {
            $table->dropForeign(['form_token_id']);
            $table->dropColumn('form_token_id');
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
