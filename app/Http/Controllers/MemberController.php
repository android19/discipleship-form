<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use App\Models\VictoryGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Member::query()
            ->with(['victoryGroup.leader'])
            ->withCount('discipleshipClasses');

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

        // Apply victory group filter
        if ($request->filled('victory_group_id') && $request->victory_group_id !== 'all') {
            $query->where('victory_group_id', $request->victory_group_id);
        }

        $members = $query->orderBy('first_name')
            ->orderBy('last_name')
            ->paginate(15);

        $victoryGroups = VictoryGroup::with('leader')
            ->orderBy('name')
            ->get();

        return Inertia::render('members/Index', [
            'members' => $members,
            'victoryGroups' => $victoryGroups,
            'filters' => $request->only(['search', 'status', 'victory_group_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $victoryGroups = VictoryGroup::with('leader')
            ->active()
            ->orderBy('name')
            ->get()
            ->map(fn ($vg) => [
                'value' => $vg->id,
                'label' => $vg->name.($vg->leader ? ' ('.$vg->leader->full_name.')' : ''),
            ]);

        return Inertia::render('members/Create', [
            'victoryGroups' => $victoryGroups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMemberRequest $request): RedirectResponse
    {
        $member = Member::create($request->validated());

        return redirect()->route('members.show', $member)
            ->with('success', 'Member created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member): Response
    {
        $member->load([
            'victoryGroup.leader',
            'discipleshipClasses' => function ($query) {
                $query->orderBy('class_name');
            },
        ]);

        return Inertia::render('members/Show', [
            'member' => $member,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member): Response
    {
        $member->load('victoryGroup');

        $victoryGroups = VictoryGroup::with('leader')
            ->active()
            ->orderBy('name')
            ->get()
            ->map(fn ($vg) => [
                'value' => $vg->id,
                'label' => $vg->name.($vg->leader ? ' ('.$vg->leader->full_name.')' : ''),
            ]);

        return Inertia::render('members/Edit', [
            'member' => $member,
            'victoryGroups' => $victoryGroups,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberRequest $request, Member $member): RedirectResponse
    {
        $member->update($request->validated());

        return redirect()->route('members.show', $member)
            ->with('success', 'Member updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member): RedirectResponse
    {
        $member->delete();

        return redirect()->route('members.index')
            ->with('success', 'Member deleted successfully!');
    }

    /**
     * Get members for selection (API endpoint).
     */
    public function getMembersForSelection(Request $request)
    {
        $query = Member::query()
            ->active()
            ->select('id', 'first_name', 'middle_initial', 'last_name', 'victory_group_id')
            ->with('victoryGroup:id,name');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
            });
        }

        $members = $query->orderBy('first_name')
            ->orderBy('last_name')
            ->limit(50)
            ->get()
            ->map(function ($member) {
                return [
                    'value' => $member->id,
                    'label' => $member->full_name.($member->victoryGroup ? ' ('.$member->victoryGroup->name.')' : ''),
                    'member' => $member,
                ];
            });

        return response()->json($members);
    }
}
