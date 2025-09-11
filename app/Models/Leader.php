<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Leader extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_initial',
        'last_name',
        'age',
        'sex',
        'contact_number',
        'lifestage',
        'address',
        'date_launched',
        'status',
        'coach_id',
    ];

    protected $casts = [
        'date_launched' => 'date',
        'age' => 'integer',
    ];

    protected $appends = [
        'full_name',
    ];

    /**
     * Get the leader's full name.
     */
    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;

        if ($this->middle_initial) {
            $name .= ' '.$this->middle_initial.'.';
        }

        $name .= ' '.$this->last_name;

        return $name;
    }

    /**
     * Get the coach that coaches this leader.
     */
    public function coach(): BelongsTo
    {
        return $this->belongsTo(Coach::class);
    }

    /**
     * Get all victory groups that this leader leads.
     */
    public function victoryGroups(): HasMany
    {
        return $this->hasMany(VictoryGroup::class);
    }

    /**
     * Get all active victory groups that this leader leads.
     */
    public function activeVictoryGroups(): HasMany
    {
        return $this->victoryGroups()->where('status', 'Active');
    }

    /**
     * Get all members through victory groups.
     */
    public function members()
    {
        return Member::whereHas('victoryGroup', function ($query) {
            $query->where('leader_id', $this->id);
        });
    }

    /**
     * Get the count of victory groups this leader leads.
     */
    public function getVictoryGroupsCountAttribute(): int
    {
        return $this->victoryGroups()->count();
    }

    /**
     * Get the count of active victory groups this leader leads.
     */
    public function getActiveVictoryGroupsCountAttribute(): int
    {
        return $this->activeVictoryGroups()->count();
    }

    /**
     * Get the count of members across all victory groups.
     */
    public function getTotalMembersCountAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Scope a query to only include active leaders.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'Active');
    }

    /**
     * Scope a query to only include inactive leaders.
     */
    public function scopeInactive(Builder $query): void
    {
        $query->where('status', 'Inactive');
    }

    /**
     * Scope a query to include leaders with their coach.
     */
    public function scopeWithCoach(Builder $query): void
    {
        $query->with('coach');
    }

    /**
     * Scope a query to include leaders with their victory groups.
     */
    public function scopeWithVictoryGroups(Builder $query): void
    {
        $query->with('victoryGroups');
    }

    /**
     * Scope a query to include leaders with victory groups count.
     */
    public function scopeWithVictoryGroupsCount(Builder $query): void
    {
        $query->withCount('victoryGroups');
    }
}
