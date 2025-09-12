<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Ministry extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'name',
        'date_started',
        'status',
    ];

    protected $casts = [
        'date_started' => 'date',
    ];

    protected $appends = [
        'status_label',
        'status_color',
    ];

    /**
     * Get the member that this ministry belongs to.
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Scope a query to only include active ministries.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active');
    }

    /**
     * Scope a query to only include resting ministries.
     */
    public function scopeRest(Builder $query): void
    {
        $query->where('status', 'rest');
    }

    /**
     * Scope a query to only include released ministries.
     */
    public function scopeReleased(Builder $query): void
    {
        $query->where('status', 'release');
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeWithStatus(Builder $query, string $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Get the status label for display.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'active' => 'Active',
            'rest' => 'Rest',
            'release' => 'Released',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get the status color for UI display.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'active' => 'bg-green-100 text-green-800',
            'rest' => 'bg-yellow-100 text-yellow-800',
            'release' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}
