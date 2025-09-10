<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VictoryGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'leader_id',
        'schedule',
        'venue',
        'status',
    ];

    /**
     * Get the leader that leads this victory group.
     */
    public function leader(): BelongsTo
    {
        return $this->belongsTo(Leader::class);
    }

    /**
     * Get all members of this victory group.
     */
    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    /**
     * Get the discipleship updates associated with this victory group.
     */
    public function discipleshipUpdates(): HasMany
    {
        return $this->hasMany(DiscipleshipUpdate::class);
    }

    /**
     * Get active members of this victory group.
     */
    public function activeMembers(): HasMany
    {
        return $this->members()->where('status', 'Active');
    }

    /**
     * Get the count of active members.
     */
    public function getActiveMembersCountAttribute(): int
    {
        return $this->activeMembers()->count();
    }

    /**
     * Scope a query to only include active victory groups.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'Active');
    }

    /**
     * Scope a query to only include inactive victory groups.
     */
    public function scopeInactive(Builder $query): void
    {
        $query->where('status', 'Inactive');
    }

    /**
     * Scope a query to include victory groups with their leader.
     */
    public function scopeWithLeader(Builder $query): void
    {
        $query->with('leader');
    }

    /**
     * Scope a query to include victory groups with their members.
     */
    public function scopeWithMembers(Builder $query): void
    {
        $query->with('members');
    }

    /**
     * Scope a query to include victory groups with member count.
     */
    public function scopeWithMembersCount(Builder $query): void
    {
        $query->withCount('members');
    }
}
