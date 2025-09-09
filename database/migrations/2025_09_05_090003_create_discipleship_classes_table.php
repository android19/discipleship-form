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
        Schema::create('discipleship_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discipleship_update_id')->constrained()->onDelete('cascade');

            // Discipleship Classes Checklist
            $table->boolean('church_community')->default(false);
            $table->boolean('purple_book')->default(false);
            $table->boolean('making_disciples')->default(false);
            $table->boolean('empowering_leaders')->default(false);
            $table->boolean('leadership_113')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discipleship_classes');
    }
};
