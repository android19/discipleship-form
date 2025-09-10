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
        Schema::create('member_discipleship_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->enum('class_name', [
                'one2one',
                'victory_weekend',
                'church_community',
                'purple_book',
                'making_disciples',
                'empowering_leaders',
                'leadership_113',
            ]);
            $table->date('date_started')->nullable();
            $table->date('date_finished')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamps();

            $table->unique(['member_id', 'class_name']);
            $table->index(['member_id', 'is_completed']);
            $table->index('class_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_discipleship_classes');
    }
};
