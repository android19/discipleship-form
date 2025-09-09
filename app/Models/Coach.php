<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
