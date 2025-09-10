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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('middle_initial', 1)->nullable();
            $table->string('last_name');
            $table->integer('age');
            $table->enum('sex', ['Male', 'Female']);
            $table->string('contact_number');
            $table->string('lifestage');
            $table->text('address');
            $table->date('date_launched');
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->unsignedBigInteger('victory_group_id')->nullable();
            $table->timestamps();

            $table->index(['status', 'victory_group_id']);
            $table->index('date_launched');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
