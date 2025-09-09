<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiscipleshipUpdateRequest;
use App\Http\Requests\UpdateDiscipleshipUpdateRequest;
use App\Models\Coach;
use App\Models\DiscipleshipUpdate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DiscipleshipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $discipleshipUpdates = auth()->user()
            ->discipleshipUpdates()
            ->where('status', 'approved')  // Only show approved submissions
            ->with(['discipleshipClass', 'victoryGroupMembers'])
            ->withCount('victoryGroupMembers')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('discipleship/Index', [
            'discipleshipUpdates' => $discipleshipUpdates,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $coaches = Coach::active()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn ($coach) => [
                'value' => $coach->full_name,
                'label' => $coach->full_name,
            ]);

        return Inertia::render('discipleship/Create', [
            'coaches' => $coaches,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiscipleshipUpdateRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $discipleshipUpdate = auth()->user()->discipleshipUpdates()->create([
                'leader_name' => $request->leader_name,
                'mobile_number' => $request->mobile_number,
                'ministry_involvement' => $request->ministry_involvement,
                'coach' => $request->coach,
                'services_attended' => $request->services_attended,
                'victory_groups_leading' => $request->victory_groups_leading,
                'victory_group_active' => $request->victory_group_active,
                'inactive_reason' => $request->inactive_reason,
                'last_victory_group_date' => $request->last_victory_group_date,
                'victory_group_types' => $request->victory_group_types,
                'intern_invite_status' => $request->intern_invite_status,
                'victory_group_schedule' => $request->victory_group_schedule,
                'venue' => $request->venue,
                'concerns' => $request->concerns,
                'status' => 'draft',
            ]);

            // Create discipleship classes record
            if ($request->has('discipleship_classes')) {
                $discipleshipUpdate->discipleshipClass()->create($request->discipleship_classes);
            }

            // Create victory group members
            if ($request->has('members') && is_array($request->members)) {
                foreach ($request->members as $memberData) {
                    if (! empty($memberData['name'])) {
                        $discipleshipUpdate->victoryGroupMembers()->create([
                            ...$memberData,
                            'member_type' => 'member',
                        ]);
                    }
                }
            }

            // Create interns
            if ($request->has('interns') && is_array($request->interns)) {
                foreach ($request->interns as $internData) {
                    if (! empty($internData['name'])) {
                        $discipleshipUpdate->victoryGroupMembers()->create([
                            ...$internData,
                            'member_type' => 'intern',
                        ]);
                    }
                }
            }
        });

        return redirect()->route('discipleship.index')
            ->with('success', 'Discipleship update created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(DiscipleshipUpdate $discipleship): Response
    {
        $this->authorize('view', $discipleship);

        $discipleship->load(['discipleshipClass', 'members', 'interns']);

        return Inertia::render('discipleship/Show', [
            'discipleshipUpdate' => $discipleship,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DiscipleshipUpdate $discipleship): Response
    {
        $this->authorize('update', $discipleship);

        $discipleship->load(['discipleshipClass', 'members', 'interns']);

        $coaches = Coach::active()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn ($coach) => [
                'value' => $coach->full_name,
                'label' => $coach->full_name,
            ]);

        return Inertia::render('discipleship/Edit', [
            'discipleshipUpdate' => $discipleship,
            'coaches' => $coaches,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDiscipleshipUpdateRequest $request, DiscipleshipUpdate $discipleship): RedirectResponse
    {
        DB::transaction(function () use ($request, $discipleship) {
            $discipleship->update([
                'leader_name' => $request->leader_name,
                'mobile_number' => $request->mobile_number,
                'ministry_involvement' => $request->ministry_involvement,
                'coach' => $request->coach,
                'services_attended' => $request->services_attended,
                'victory_groups_leading' => $request->victory_groups_leading,
                'victory_group_active' => $request->victory_group_active,
                'inactive_reason' => $request->inactive_reason,
                'last_victory_group_date' => $request->last_victory_group_date,
                'victory_group_types' => $request->victory_group_types,
                'intern_invite_status' => $request->intern_invite_status,
                'victory_group_schedule' => $request->victory_group_schedule,
                'venue' => $request->venue,
                'concerns' => $request->concerns,
            ]);

            // Update discipleship classes
            if ($request->has('discipleship_classes')) {
                $discipleship->discipleshipClass()->updateOrCreate(
                    ['discipleship_update_id' => $discipleship->id],
                    $request->discipleship_classes
                );
            }

            // Update members and interns
            $discipleship->victoryGroupMembers()->delete();

            if ($request->has('members') && is_array($request->members)) {
                foreach ($request->members as $memberData) {
                    if (! empty($memberData['name'])) {
                        $discipleship->victoryGroupMembers()->create([
                            ...$memberData,
                            'member_type' => 'member',
                        ]);
                    }
                }
            }

            if ($request->has('interns') && is_array($request->interns)) {
                foreach ($request->interns as $internData) {
                    if (! empty($internData['name'])) {
                        $discipleship->victoryGroupMembers()->create([
                            ...$internData,
                            'member_type' => 'intern',
                        ]);
                    }
                }
            }
        });

        return redirect()->route('discipleship.show', $discipleship)
            ->with('success', 'Discipleship update updated successfully!');
    }

    /**
     * Submit the discipleship update for review.
     */
    public function submit(DiscipleshipUpdate $discipleshipUpdate): RedirectResponse
    {
        $this->authorize('update', $discipleshipUpdate);

        $discipleshipUpdate->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return redirect()->route('discipleship.show', $discipleshipUpdate)
            ->with('success', 'Discipleship update submitted successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DiscipleshipUpdate $discipleship): RedirectResponse
    {
        $this->authorize('delete', $discipleship);

        $discipleship->delete();

        return redirect()->route('discipleship.index')
            ->with('success', 'Discipleship update deleted successfully!');
    }
}
