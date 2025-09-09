<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VictoryGroupMember extends Model
{
    /** @use HasFactory<\Database\Factories\VictoryGroupMemberFactory> */
    use HasFactory;

    protected $fillable = [
        'discipleship_update_id',
        'name',
        'one_to_one_facilitator',
        'one_to_one_date_started',
        'victory_weekend',
        'purple_book',
        'church_community',
        'making_disciples',
        'empowering_leaders',
        'ministry_involvement',
        'remarks',
        'member_type',
    ];

    protected function casts(): array
    {
        return [
            'victory_weekend' => 'boolean',
            'purple_book' => 'boolean',
            'church_community' => 'boolean',
            'making_disciples' => 'boolean',
            'empowering_leaders' => 'boolean',
            'one_to_one_date_started' => 'date',
        ];
    }

    public function discipleshipUpdate(): BelongsTo
    {
        return $this->belongsTo(DiscipleshipUpdate::class);
    }
}
