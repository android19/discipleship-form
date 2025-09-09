<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscipleshipClass extends Model
{
    /** @use HasFactory<\Database\Factories\DiscipleshipClassFactory> */
    use HasFactory;

    protected $fillable = [
        'discipleship_update_id',
        'church_community',
        'purple_book',
        'making_disciples',
        'empowering_leaders',
        'leadership_113',
    ];

    protected function casts(): array
    {
        return [
            'church_community' => 'boolean',
            'purple_book' => 'boolean',
            'making_disciples' => 'boolean',
            'empowering_leaders' => 'boolean',
            'leadership_113' => 'boolean',
        ];
    }

    public function discipleshipUpdate(): BelongsTo
    {
        return $this->belongsTo(DiscipleshipUpdate::class);
    }
}
