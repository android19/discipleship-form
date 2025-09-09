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
        Schema::create('victory_group_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discipleship_update_id')->constrained()->onDelete('cascade');

            // Member Information
            $table->string('name');
            $table->string('one_to_one_facilitator')->nullable();
            $table->date('one_to_one_date_started')->nullable();

            // Class Completions (checkboxes)
            $table->boolean('victory_weekend')->default(false);
            $table->boolean('purple_book')->default(false);
            $table->boolean('church_community')->default(false);
            $table->boolean('making_disciples')->default(false);
            $table->boolean('empowering_leaders')->default(false);

            $table->string('ministry_involvement')->nullable();
            $table->text('remarks')->nullable(); // Intern, Prospect, Regular Attendee, Visitor

            // Member Type
            $table->enum('member_type', ['member', 'intern'])->default('member');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('victory_group_members');
    }
};
