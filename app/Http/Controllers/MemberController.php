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
            ->get();

        // Available discipleship classes
        $discipleshipClasses = [
            'one2one' => 'One2One',
            'victory_weekend' => 'Victory Weekend',
            'church_community' => 'Church Community',
            'purple_book' => 'Purple Book',
            'making_disciples' => 'Making Disciples',
            'empowering_leaders' => 'Empowering Leaders',
            'leadership_113' => 'Leadership 113',
        ];

        return Inertia::render('members/Create', [
            'victoryGroups' => $victoryGroups,
            'discipleshipClasses' => $discipleshipClasses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMemberRequest $request): RedirectResponse
    {
        $memberData = $request->safe()->except(['discipleship_classes']);
        $member = Member::create($memberData);

        // Handle discipleship classes if provided
        if ($request->has('discipleship_classes')) {
            foreach ($request->discipleship_classes as $className => $classData) {
                if (! empty($classData['selected'])) {
                    $member->discipleshipClasses()->create([
                        'class_name' => $className,
                        'date_started' => $classData['date_started'] ?? null,
                        'date_finished' => $classData['date_finished'] ?? null,
                        'is_completed' => ! empty($classData['date_finished']),
                    ]);
                }
            }
        }

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
            'ministries' => function ($query) {
                $query->orderBy('name');
            },
        ]);

        // Available discipleship classes for reference
        $discipleshipClasses = [
            'one2one' => 'One2One',
            'victory_weekend' => 'Victory Weekend',
            'church_community' => 'Church Community',
            'purple_book' => 'Purple Book',
            'making_disciples' => 'Making Disciples',
            'empowering_leaders' => 'Empowering Leaders',
            'leadership_113' => 'Leadership 113',
        ];

        return Inertia::render('members/Show', [
            'member' => $member,
            'discipleshipClasses' => $discipleshipClasses,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member): Response
    {
        $member->load([
            'victoryGroup',
            'discipleshipClasses' => function ($query) {
                $query->orderBy('class_name');
            },
            'ministries' => function ($query) {
                $query->orderBy('name');
            },
        ]);

        $victoryGroups = VictoryGroup::with('leader')
            ->active()
            ->orderBy('name')
            ->get();

        // Available discipleship classes
        $discipleshipClasses = [
            'one2one' => 'One2One',
            'victory_weekend' => 'Victory Weekend',
            'church_community' => 'Church Community',
            'purple_book' => 'Purple Book',
            'making_disciples' => 'Making Disciples',
            'empowering_leaders' => 'Empowering Leaders',
            'leadership_113' => 'Leadership 113',
        ];

        return Inertia::render('members/Edit', [
            'member' => $member,
            'victoryGroups' => $victoryGroups,
            'discipleshipClasses' => $discipleshipClasses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberRequest $request, Member $member): RedirectResponse
    {
        $memberData = $request->safe()->except(['discipleship_classes', 'existing_classes', 'ministries', 'existing_ministries']);
        
        // Handle victory group assignment with "none" value
        if ($memberData['victory_group_id'] === 'none') {
            $memberData['victory_group_id'] = null;
        }
        
        $member->update($memberData);

        // Handle existing discipleship classes (edit/delete)
        if ($request->has('existing_classes')) {
            foreach ($request->existing_classes as $classId => $classData) {
                $existingClass = $member->discipleshipClasses()->find($classId);
                
                if ($existingClass) {
                    // Check if this class should be deleted
                    if (! empty($classData['delete'])) {
                        $existingClass->delete();
                        continue;
                    }
                    
                    // Update the existing class
                    $updateData = [
                        'date_started' => $classData['date_started'] ?? null,
                        'date_finished' => $classData['date_finished'] ?? null,
                        'is_completed' => ! empty($classData['is_completed']),
                    ];
                    
                    // Auto-mark as completed if finish date is provided
                    if (! empty($classData['date_finished'])) {
                        $updateData['is_completed'] = true;
                    }
                    
                    $existingClass->update($updateData);
                }
            }
        }

        // Handle new discipleship classes if provided
        if ($request->has('discipleship_classes')) {
            foreach ($request->discipleship_classes as $className => $classData) {
                if (! empty($classData['selected'])) {
                    // Check if this class already exists for the member
                    $existingClass = $member->discipleshipClasses()
                        ->where('class_name', $className)
                        ->first();

                    if (! $existingClass) {
                        $member->discipleshipClasses()->create([
                            'class_name' => $className,
                            'date_started' => $classData['date_started'] ?? null,
                            'date_finished' => $classData['date_finished'] ?? null,
                            'is_completed' => ! empty($classData['date_finished']) || ! empty($classData['is_completed']),
                        ]);
                    }
                }
            }
        }

        // Handle existing ministries (edit/delete)
        if ($request->has('existing_ministries')) {
            foreach ($request->existing_ministries as $ministryId => $ministryData) {
                $existingMinistry = $member->ministries()->find($ministryId);
                
                if ($existingMinistry) {
                    // Check if this ministry should be deleted
                    if (! empty($ministryData['delete'])) {
                        $existingMinistry->delete();
                        continue;
                    }
                    
                    // Update the existing ministry
                    $updateData = [
                        'name' => $ministryData['name'] ?? $existingMinistry->name,
                        'date_started' => $ministryData['date_started'] ?? $existingMinistry->date_started,
                        'status' => $ministryData['status'] ?? $existingMinistry->status,
                    ];
                    
                    $existingMinistry->update($updateData);
                }
            }
        }

        // Handle new ministries if provided
        if ($request->has('ministries')) {
            foreach ($request->ministries as $ministryData) {
                if (! empty($ministryData['name'])) {
                    $member->ministries()->create([
                        'name' => $ministryData['name'],
                        'date_started' => $ministryData['date_started'] ?? now()->toDateString(),
                        'status' => $ministryData['status'] ?? 'active',
                    ]);
                }
            }
        }

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
