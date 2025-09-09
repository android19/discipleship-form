<?php

namespace App\Policies;

use App\Models\DiscipleshipUpdate;
use App\Models\User;

class DiscipleshipUpdatePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, DiscipleshipUpdate $discipleshipUpdate): bool
    {
        return $user->id === $discipleshipUpdate->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DiscipleshipUpdate $discipleshipUpdate): bool
    {
        return $user->id === $discipleshipUpdate->user_id && $discipleshipUpdate->status !== 'submitted';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DiscipleshipUpdate $discipleshipUpdate): bool
    {
        return $user->id === $discipleshipUpdate->user_id && $discipleshipUpdate->status === 'draft';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DiscipleshipUpdate $discipleshipUpdate): bool
    {
        return $user->id === $discipleshipUpdate->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DiscipleshipUpdate $discipleshipUpdate): bool
    {
        return $user->id === $discipleshipUpdate->user_id;
    }
}
