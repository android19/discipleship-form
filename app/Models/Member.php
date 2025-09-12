<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
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
        'victory_group_id',
    ];

    protected $casts = [
        'date_launched' => 'date',
        'age' => 'integer',
    ];

    protected $appends = [
        'full_name',
    ];

    /**
     * Get the member's full name.
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
     * Get the victory group that the member belongs to.
     */
    public function victoryGroup(): BelongsTo
    {
        return $this->belongsTo(VictoryGroup::class);
    }

    /**
     * Get the discipleship classes for this member.
     */
    public function discipleshipClasses(): HasMany
    {
        return $this->hasMany(MemberDiscipleshipClass::class);
    }

    /**
     * Get the ministries for this member.
     */
    public function ministries(): HasMany
    {
        return $this->hasMany(Ministry::class);
    }

    /**
     * Get progress for a specific class.
     */
    public function getClassProgress(string $className): ?MemberDiscipleshipClass
    {
        return $this->discipleshipClasses()
            ->where('class_name', $className)
            ->first();
    }

    /**
     * Check if member has completed a specific class.
     */
    public function hasCompletedClass(string $className): bool
    {
        return $this->discipleshipClasses()
            ->where('class_name', $className)
            ->where('is_completed', true)
            ->exists();
    }

    /**
     * Scope a query to only include active members.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'Active');
    }

    /**
     * Scope a query to only include inactive members.
     */
    public function scopeInactive(Builder $query): void
    {
        $query->where('status', 'Inactive');
    }

    /**
     * Scope a query to include members with their victory group.
     */
    public function scopeWithVictoryGroup(Builder $query): void
    {
        $query->with('victoryGroup');
    }

    /**
     * Scope a query to include members with their discipleship classes.
     */
    public function scopeWithDiscipleshipClasses(Builder $query): void
    {
        $query->with('discipleshipClasses');
    }
}
