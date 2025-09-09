<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateDiscipleshipUpdateRequest;
use App\Models\Coach;
use App\Models\DiscipleshipUpdate;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminSubmissionController extends Controller
{
    /**
     * Display a listing of all submissions for admin review.
     */
    public function index(Request $request): Response
    {
        $query = DiscipleshipUpdate::query()
            ->with(['user', 'formToken', 'reviewedBy', 'assignedToUser'])
            ->withCount(['members', 'interns']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('submission_type')) {
            if ($request->submission_type === 'token') {
                $query->whereNotNull('form_token_id');
            } elseif ($request->submission_type === 'authenticated') {
                $query->whereNotNull('user_id');
            }
        }

        if ($request->filled('search')) {
            $query->where('leader_name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $submissions = $query->orderBy('created_at', 'desc')->paginate(15);

        $stats = [
            'total' => DiscipleshipUpdate::count(),
            'pending_review' => DiscipleshipUpdate::where('status', 'submitted')->count(),
            'under_review' => DiscipleshipUpdate::where('status', 'under_review')->count(),
            'approved_today' => DiscipleshipUpdate::where('status', 'approved')
                ->whereDate('reviewed_at', today())
                ->count(),
        ];

        return Inertia::render('admin/submissions/Index', [
            'submissions' => $submissions,
            'stats' => $stats,
            'filters' => $request->only(['status', 'submission_type', 'search', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified submission for admin review.
     */
    public function show(DiscipleshipUpdate $submission): Response
    {
        $submission->load([
            'user',
            'formToken',
            'discipleshipClass',
            'victoryGroupMembers',
            'members',
            'interns',
            'reviewedBy',
            'assignedToUser'
        ]);

        $availableUsers = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/submissions/Show', [
            'submission' => $submission,
            'availableUsers' => $availableUsers,
        ]);
    }

    /**
     * Show the form for editing the specified submission.
     */
    public function edit(DiscipleshipUpdate $submission): Response
    {
        $submission->load(['discipleshipClass', 'members', 'interns']);

        $coaches = Coach::active()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn ($coach) => [
                'value' => $coach->full_name,
                'label' => $coach->full_name,
            ]);

        return Inertia::render('admin/submissions/Edit', [
            'submission' => $submission,
            'coaches' => $coaches,
        ]);
    }

    /**
     * Update the specified submission.
     */
    public function update(UpdateDiscipleshipUpdateRequest $request, DiscipleshipUpdate $submission): RedirectResponse
    {
        DB::transaction(function () use ($request, $submission) {
            $submission->update([
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
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);

            // Update discipleship classes
            if ($request->has('discipleship_classes')) {
                $submission->discipleshipClass()->updateOrCreate(
                    ['discipleship_update_id' => $submission->id],
                    $request->discipleship_classes
                );
            }

            // Update members and interns
            $submission->victoryGroupMembers()->delete();

            if ($request->has('members') && is_array($request->members)) {
                foreach ($request->members as $memberData) {
                    if (!empty($memberData['name'])) {
                        $submission->victoryGroupMembers()->create([
                            ...$memberData,
                            'member_type' => 'member',
                        ]);
                    }
                }
            }

            if ($request->has('interns') && is_array($request->interns)) {
                foreach ($request->interns as $internData) {
                    if (!empty($internData['name'])) {
                        $submission->victoryGroupMembers()->create([
                            ...$internData,
                            'member_type' => 'intern',
                        ]);
                    }
                }
            }
        });

        return redirect()->route('admin.submissions.show', $submission)
            ->with('success', 'Submission updated successfully!');
    }

    /**
     * Approve a submission.
     */
    public function approve(Request $request, DiscipleshipUpdate $submission): RedirectResponse
    {
        $request->validate([
            'review_notes' => 'nullable|string|max:1000',
        ]);

        $submission->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'review_notes' => $request->review_notes,
        ]);

        return redirect()->route('admin.submissions.show', $submission)
            ->with('success', 'Submission approved successfully!');
    }

    /**
     * Reject a submission.
     */
    public function reject(Request $request, DiscipleshipUpdate $submission): RedirectResponse
    {
        $request->validate([
            'review_notes' => 'required|string|max:1000',
        ]);

        $submission->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'review_notes' => $request->review_notes,
        ]);

        return redirect()->route('admin.submissions.show', $submission)
            ->with('success', 'Submission rejected.');
    }

    /**
     * Assign a token submission to a user.
     */
    public function assignToUser(Request $request, DiscipleshipUpdate $submission): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $submission->update([
            'user_id' => $request->user_id,
            'assigned_to_user_id' => $request->user_id,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->route('admin.submissions.show', $submission)
            ->with('success', 'Submission assigned to user successfully!');
    }

    /**
     * Mark submission as under review.
     */
    public function markUnderReview(DiscipleshipUpdate $submission): RedirectResponse
    {
        $submission->update([
            'status' => 'under_review',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->route('admin.submissions.show', $submission)
            ->with('success', 'Submission marked as under review.');
    }
}