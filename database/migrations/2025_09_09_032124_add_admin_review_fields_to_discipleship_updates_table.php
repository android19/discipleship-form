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
            // Update status enum to include new review statuses
            $table->enum('status', ['draft', 'submitted', 'under_review', 'approved', 'rejected'])->default('draft')->change();
            
            // Add admin review fields
            $table->unsignedBigInteger('reviewed_by')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('review_notes')->nullable()->after('reviewed_at');
            $table->unsignedBigInteger('assigned_to_user_id')->nullable()->after('review_notes');
            
            // Add foreign key constraints
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('assigned_to_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discipleship_updates', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['reviewed_by']);
            $table->dropForeign(['assigned_to_user_id']);
            
            // Drop columns
            $table->dropColumn(['reviewed_by', 'reviewed_at', 'review_notes', 'assigned_to_user_id']);
            
            // Revert status enum to original values
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft')->change();
        });
    }
};