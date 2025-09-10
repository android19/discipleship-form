<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaderRequest;
use App\Http\Requests\UpdateLeaderRequest;
use App\Models\Coach;
use App\Models\Leader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Leader::query()
            ->with(['coach', 'victoryGroups'])
            ->withCount(['victoryGroups', 'activeVictoryGroups']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply coach filter
        if ($request->filled('coach_id') && $request->coach_id !== 'all') {
            $query->where('coach_id', $request->coach_id);
        }

        $leaders = $query->orderBy('first_name')
            ->orderBy('last_name')
            ->paginate(15);

        $coaches = Coach::active()
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();

        return Inertia::render('leaders/Index', [
            'leaders' => $leaders,
            'coaches' => $coaches,
            'filters' => $request->only(['search', 'status', 'coach_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $coaches = Coach::active()
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get()
            ->map(fn ($coach) => [
                'value' => $coach->id,
                'label' => $coach->full_name,
            ]);

        return Inertia::render('leaders/Create', [
            'coaches' => $coaches,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaderRequest $request): RedirectResponse
    {
        $leader = Leader::create($request->validated());

        return redirect()->route('leaders.show', $leader)
            ->with('success', 'Leader created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Leader $leader): Response
    {
        $leader->load([
            'coach',
            'victoryGroups.members',
            'victoryGroups' => function ($query) {
                $query->withCount('members');
            },
        ]);

        return Inertia::render('leaders/Show', [
            'leader' => $leader,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leader $leader): Response
    {
        $leader->load('coach');

        $coaches = Coach::active()
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get()
            ->map(fn ($coach) => [
                'value' => $coach->id,
                'label' => $coach->full_name,
            ]);

        return Inertia::render('leaders/Edit', [
            'leader' => $leader,
            'coaches' => $coaches,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaderRequest $request, Leader $leader): RedirectResponse
    {
        $leader->update($request->validated());

        return redirect()->route('leaders.show', $leader)
            ->with('success', 'Leader updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leader $leader): RedirectResponse
    {
        // Check if leader has victory groups
        if ($leader->victoryGroups()->exists()) {
            return redirect()->route('leaders.index')
                ->with('error', 'Cannot delete leader who has victory groups assigned.');
        }

        $leader->delete();

        return redirect()->route('leaders.index')
            ->with('success', 'Leader deleted successfully!');
    }

    /**
     * Get leaders for selection (API endpoint).
     */
    public function getLeadersForSelection(Request $request)
    {
        $query = Leader::query()
            ->active()
            ->select('id', 'first_name', 'middle_initial', 'last_name', 'coach_id')
            ->with('coach:id,first_name,last_name');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
            });
        }

        $leaders = $query->orderBy('first_name')
            ->orderBy('last_name')
            ->limit(50)
            ->get()
            ->map(function ($leader) {
                return [
                    'value' => $leader->id,
                    'label' => $leader->full_name.($leader->coach ? ' ('.$leader->coach->full_name.')' : ''),
                    'leader' => $leader,
                ];
            });

        return response()->json($leaders);
    }
}
