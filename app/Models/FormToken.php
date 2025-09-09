<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class FormToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'leader_name',
        'description',
        'expires_at',
        'is_active',
        'max_uses',
        'used_count',
        'created_by',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'max_uses' => 'integer',
        'used_count' => 'integer',
    ];

    /**
     * Generate a unique token.
     */
    public static function generateUniqueToken(): string
    {
        do {
            $token = strtoupper(Str::random(8));
        } while (self::where('token', $token)->exists());

        return $token;
    }

    /**
     * Check if token is valid and can be used.
     */
    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->expires_at < now()) {
            return false;
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Increment the usage count.
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    /**
     * Check if token has reached usage limit.
     */
    public function hasReachedLimit(): bool
    {
        return $this->max_uses && $this->used_count >= $this->max_uses;
    }

    /**
     * Get the user who created this token.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the discipleship updates created with this token.
     */
    public function discipleshipUpdates(): HasMany
    {
        return $this->hasMany(DiscipleshipUpdate::class);
    }

    /**
     * Scope active tokens.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope expired tokens.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Scope valid tokens (active and not expired).
     */
    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where('expires_at', '>', now());
    }

    /**
     * Scope tokens that haven't reached usage limit.
     */
    public function scopeWithinLimit($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('max_uses')
                ->orWhereRaw('used_count < max_uses');
        });
    }

    /**
     * Get the remaining uses for this token.
     */
    public function getRemainingUsesAttribute(): ?int
    {
        if (! $this->max_uses) {
            return null;
        }

        return max(0, $this->max_uses - $this->used_count);
    }

    /**
     * Check if token is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at < now();
    }
}
