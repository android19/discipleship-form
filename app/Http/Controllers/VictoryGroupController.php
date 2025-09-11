<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVictoryGroupRequest;
use App\Http\Requests\UpdateVictoryGroupRequest;
use App\Models\Leader;
use App\Models\VictoryGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VictoryGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = VictoryGroup::query()
            ->with(['leader'])
            ->withCount(['members', 'activeMembers']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('leader', function ($leaderQuery) use ($search) {
                        $leaderQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                    });
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply leader filter
        if ($request->filled('leader_id') && $request->leader_id !== 'all') {
            $query->where('leader_id', $request->leader_id);
        }

        $victoryGroups = $query->orderBy('name')
            ->paginate(15);

        $leaders = Leader::active()
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('victory-groups/Index', [
            'victoryGroups' => $victoryGroups,
            'leaders' => $leaders,
            'filters' => $request->only(['search', 'status', 'leader_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $leaders = Leader::active()
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('victory-groups/Create', [
            'leaders' => $leaders,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVictoryGroupRequest $request): RedirectResponse
    {
        $victoryGroup = VictoryGroup::create($request->validated());

        return redirect()->route('victory-groups.show', $victoryGroup)
            ->with('success', 'Victory Group created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(VictoryGroup $victoryGroup): Response
    {
        $victoryGroup->load([
            'leader.coach',
            'members' => function ($query) {
                $query->orderBy('first_name')->orderBy('last_name');
            },
            'discipleshipUpdates' => function ($query) {
                $query->latest()->take(5);
            },
        ]);

        return Inertia::render('victory-groups/Show', [
            'victoryGroup' => $victoryGroup,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VictoryGroup $victoryGroup): Response
    {
        $victoryGroup->load('leader');

        $leaders = Leader::active()
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('victory-groups/Edit', [
            'victoryGroup' => $victoryGroup,
            'leaders' => $leaders,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVictoryGroupRequest $request, VictoryGroup $victoryGroup): RedirectResponse
    {
        $victoryGroup->update($request->validated());

        return redirect()->route('victory-groups.show', $victoryGroup)
            ->with('success', 'Victory Group updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VictoryGroup $victoryGroup): RedirectResponse
    {
        // Check if victory group has members
        if ($victoryGroup->members()->exists()) {
            return redirect()->route('victory-groups.index')
                ->with('error', 'Cannot delete victory group that has members.');
        }

        $victoryGroup->delete();

        return redirect()->route('victory-groups.index')
            ->with('success', 'Victory Group deleted successfully!');
    }

    /**
     * Get victory groups for selection (API endpoint).
     */
    public function getVictoryGroupsForSelection(Request $request)
    {
        $query = VictoryGroup::query()
            ->active()
            ->select('id', 'name', 'leader_id')
            ->with('leader:id,first_name,last_name');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('leader', function ($leaderQuery) use ($search) {
                        $leaderQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                    });
            });
        }

        $victoryGroups = $query->orderBy('name')
            ->limit(50)
            ->get()
            ->map(function ($victoryGroup) {
                return [
                    'value' => $victoryGroup->id,
                    'label' => $victoryGroup->name.($victoryGroup->leader ? ' ('.$victoryGroup->leader->full_name.')' : ''),
                    'victoryGroup' => $victoryGroup,
                ];
            });

        return response()->json($victoryGroups);
    }
}
