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
        Schema::create('discipleship_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Leader Information
            $table->string('leader_name');
            $table->string('mobile_number');
            $table->string('ministry_involvement')->nullable();
            $table->string('coach')->nullable();
            $table->string('services_attended')->nullable();

            // Victory Group Details
            $table->integer('victory_groups_leading')->default(0);
            $table->boolean('victory_group_active')->default(true);
            $table->text('inactive_reason')->nullable();
            $table->date('last_victory_group_date')->nullable();
            $table->json('victory_group_types')->nullable(); // Store array of types
            $table->string('intern_invite_status')->default('none'); // yes, none
            $table->string('victory_group_schedule')->nullable();
            $table->string('venue')->nullable();
            $table->text('concerns')->nullable();

            // Status
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft');
            $table->timestamp('submitted_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discipleship_updates');
    }
};
