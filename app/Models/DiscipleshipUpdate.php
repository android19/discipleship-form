<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DiscipleshipUpdate extends Model
{
    /** @use HasFactory<\Database\Factories\DiscipleshipUpdateFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'form_token_id',
        'leader_name',
        'mobile_number',
        'ministry_involvement',
        'coach',
        'services_attended',
        'victory_groups_leading',
        'victory_group_active',
        'inactive_reason',
        'last_victory_group_date',
        'victory_group_types',
        'intern_invite_status',
        'victory_group_schedule',
        'venue',
        'concerns',
        'status',
        'submitted_at',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'assigned_to_user_id',
        'victory_group_id',
    ];

    protected function casts(): array
    {
        return [
            'victory_group_active' => 'boolean',
            'victory_groups_leading' => 'integer',
            'victory_group_types' => 'array',
            'last_victory_group_date' => 'date',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function victoryGroupMembers(): HasMany
    {
        return $this->hasMany(VictoryGroupMember::class);
    }

    public function discipleshipClass(): HasOne
    {
        return $this->hasOne(DiscipleshipClass::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(VictoryGroupMember::class)->where('member_type', 'member');
    }

    public function interns(): HasMany
    {
        return $this->hasMany(VictoryGroupMember::class)->where('member_type', 'intern');
    }

    public function formToken(): BelongsTo
    {
        return $this->belongsTo(FormToken::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function assignedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function victoryGroup(): BelongsTo
    {
        return $this->belongsTo(VictoryGroup::class);
    }
}
