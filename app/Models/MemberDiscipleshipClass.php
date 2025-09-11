<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberDiscipleshipClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'class_name',
        'date_started',
        'date_finished',
        'is_completed',
    ];

    protected $appends = [
        'status',
    ];

    protected $casts = [
        'date_started' => 'date',
        'date_finished' => 'date',
        'is_completed' => 'boolean',
    ];

    /**
     * Get the member that this class progress belongs to.
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the victory group through the member.
     */
    public function victoryGroup(): BelongsTo
    {
        return $this->belongsTo(VictoryGroup::class, 'victory_group_id', 'id')
            ->through('member');
    }

    /**
     * Check if the class is in progress.
     */
    public function getIsInProgressAttribute(): bool
    {
        return $this->date_started !== null && $this->date_finished === null && ! $this->is_completed;
    }

    /**
     * Check if the class is not started.
     */
    public function getIsNotStartedAttribute(): bool
    {
        return $this->date_started === null && ! $this->is_completed;
    }

    /**
     * Get the status of the class.
     */
    public function getStatusAttribute(): string
    {
        if ($this->is_completed) {
            return 'completed';
        }

        if ($this->date_started && ! $this->date_finished) {
            return 'in_progress';
        }

        return 'not_started';
    }

    /**
     * Get the duration of the class in days (if completed).
     */
    public function getDurationInDaysAttribute(): ?int
    {
        if ($this->date_started && $this->date_finished) {
            return $this->date_started->diffInDays($this->date_finished);
        }

        return null;
    }

    /**
     * Scope a query to only include completed classes.
     */
    public function scopeCompleted(Builder $query): void
    {
        $query->where('is_completed', true);
    }

    /**
     * Scope a query to only include in progress classes.
     */
    public function scopeInProgress(Builder $query): void
    {
        $query->whereNotNull('date_started')
            ->whereNull('date_finished')
            ->where('is_completed', false);
    }

    /**
     * Scope a query to only include not started classes.
     */
    public function scopeNotStarted(Builder $query): void
    {
        $query->whereNull('date_started')
            ->where('is_completed', false);
    }

    /**
     * Scope a query to filter by class name.
     */
    public function scopeForClass(Builder $query, string $className): void
    {
        $query->where('class_name', $className);
    }

    /**
     * Mark the class as completed.
     */
    public function markAsCompleted(?string $finishDate = null): bool
    {
        return $this->update([
            'is_completed' => true,
            'date_finished' => $finishDate ? $finishDate : now()->toDateString(),
        ]);
    }

    /**
     * Start the class.
     */
    public function startClass(?string $startDate = null): bool
    {
        return $this->update([
            'date_started' => $startDate ? $startDate : now()->toDateString(),
        ]);
    }
}
