<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coach extends Model
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
    ];

    protected $casts = [
        'date_launched' => 'date',
        'age' => 'integer',
    ];

    protected $appends = [
        'full_name',
    ];

    /**
     * Get the full name attribute.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.($this->middle_initial ? $this->middle_initial.'. ' : '').$this->last_name);
    }

    /**
     * Scope a query to only include active coaches.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    /**
     * Scope a query to only include inactive coaches.
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'Inactive');
    }

    /**
     * Get all leaders that this coach coaches.
     */
    public function leaders(): HasMany
    {
        return $this->hasMany(Leader::class);
    }

    /**
     * Get active leaders that this coach coaches.
     */
    public function activeLeaders(): HasMany
    {
        return $this->leaders()->where('status', 'Active');
    }

    /**
     * Get the count of leaders this coach coaches.
     */
    public function getLeadersCountAttribute(): int
    {
        return $this->leaders()->count();
    }

    /**
     * Get the count of active leaders this coach coaches.
     */
    public function getActiveLeadersCountAttribute(): int
    {
        return $this->activeLeaders()->count();
    }
}
