<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiscipleshipUpdateRequest;
use App\Models\Coach;
use App\Models\FormToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class PublicDiscipleshipController extends Controller
{
    /**
     * Show the token access page.
     */
    public function showTokenAccess(): Response
    {
        return Inertia::render('public/TokenAccess');
    }

    /**
     * Verify the token and create a session.
     */
    public function verifyToken(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required', 'string', 'max:12'],
        ]);

        $token = strtoupper(trim($request->token));

        // Rate limiting for token verification attempts
        $key = 'token-verify:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'token' => "Too many attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        RateLimiter::hit($key, 300); // 5 minutes

        // Find and validate token
        $formToken = FormToken::where('token', $token)->first();

        if (! $formToken || ! $formToken->isValid()) {
            return back()->withErrors([
                'token' => 'Invalid or expired token. Please check your token and try again.',
            ]);
        }

        // Clear rate limiting on successful verification
        RateLimiter::clear($key);

        // Store token in session
        session([
            'public_form_token' => $formToken->token,
            'public_form_leader' => $formToken->leader_name,
        ]);

        return redirect()->route('public.discipleship.create', ['token' => $formToken->token]);
    }

    /**
     * Show the public discipleship form.
     */
    public function create(string $token): Response
    {
        $formToken = FormToken::where('token', $token)->first();

        // Check if token exists and is valid
        if (! $formToken) {
            return Inertia::render('public/TokenExpired', [
                'token' => $token,
                'error' => 'Token not found',
                'message' => 'The access token you provided does not exist in our system.',
                'suggestions' => [
                    'Double-check the token you entered',
                    'Contact your ministry leader for a new token',
                    'Make sure you copied the complete token',
                ],
            ]);
        }

        if (! $formToken->isValid()) {
            // Clear session if exists
            session()->forget(['public_form_token', 'public_form_leader']);

            $reason = '';
            $suggestions = [];

            if (! $formToken->is_active) {
                $reason = 'Token has been deactivated';
                $suggestions = [
                    'This token has been disabled by an administrator',
                    'Contact your ministry leader for assistance',
                    'Request a new active token',
                ];
            } elseif ($formToken->expires_at < now()) {
                $reason = 'Token has expired';
                $suggestions = [
                    'This token expired on '.$formToken->expires_at->format('F j, Y \a\t g:i A'),
                    'Contact your ministry leader for a new token',
                    'Tokens have expiration dates for security purposes',
                ];
            } elseif ($formToken->max_uses && $formToken->used_count >= $formToken->max_uses) {
                $reason = 'Token usage limit reached';
                $suggestions = [
                    'This token has reached its maximum usage limit of '.$formToken->max_uses.' uses',
                    'Contact your ministry leader to reset the usage count',
                    'Request a new token with higher usage limits',
                ];
            }

            return Inertia::render('public/TokenExpired', [
                'token' => $token,
                'error' => $reason,
                'message' => 'Your access token is no longer valid.',
                'suggestions' => $suggestions,
                'tokenInfo' => [
                    'leader_name' => $formToken->leader_name,
                    'expires_at' => $formToken->expires_at->format('F j, Y \a\t g:i A'),
                    'used_count' => $formToken->used_count,
                    'max_uses' => $formToken->max_uses,
                    'is_active' => $formToken->is_active,
                ],
            ]);
        }

        // Verify token from URL matches session (only if session exists)
        if (session('public_form_token') && session('public_form_token') !== $token) {
            return Inertia::render('public/TokenExpired', [
                'token' => $token,
                'error' => 'Session mismatch',
                'message' => 'Your session does not match this token.',
                'suggestions' => [
                    'Please enter your token again to start a new session',
                    'Make sure you are using the correct token',
                    'Clear your browser cookies and try again',
                ],
            ]);
        }

        // Get coaches for dropdown
        $coaches = Coach::active()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn ($coach) => [
                'value' => $coach->full_name,
                'label' => $coach->full_name,
            ]);

        // Get members for selection
        $members = \App\Models\Member::active()
            ->with('victoryGroup:id,name')
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get()
            ->map(fn ($member) => [
                'value' => $member->id,
                'label' => $member->full_name.($member->victoryGroup ? ' ('.$member->victoryGroup->name.')' : ''),
                'member' => [
                    'id' => $member->id,
                    'full_name' => $member->full_name,
                    'victory_group' => $member->victoryGroup?->name,
                ],
            ]);

        return Inertia::render('public/DiscipleshipForm', [
            'token' => $token,
            'leaderName' => $formToken->leader_name,
            'coaches' => $coaches,
            'members' => $members,
            'tokenInfo' => [
                'remaining_uses' => $formToken->remaining_uses,
                'expires_at' => $formToken->expires_at->format('M j, Y g:i A'),
            ],
        ]);
    }

    /**
     * Store the discipleship update from public form.
     */
    public function store(StoreDiscipleshipUpdateRequest $request, string $token): RedirectResponse
    {
        // Verify token from URL matches session
        if (session('public_form_token') !== $token) {
            return redirect()->route('public.discipleship.access')
                ->withErrors(['token' => 'Invalid session. Please enter your token again.']);
        }

        $formToken = FormToken::where('token', $token)->first();

        if (! $formToken || ! $formToken->isValid()) {
            session()->forget(['public_form_token', 'public_form_leader']);

            return redirect()->route('public.discipleship.access')
                ->withErrors(['token' => 'Token has expired or is no longer valid.']);
        }

        DB::transaction(function () use ($request, $formToken) {
            // Create discipleship update with token reference
            $discipleshipUpdate = $formToken->discipleshipUpdates()->create([
                'user_id' => null, // No authenticated user
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
                'status' => 'submitted', // Public submissions start as submitted
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

            // Increment token usage
            $formToken->incrementUsage();
        });

        // Clear session
        session()->forget(['public_form_token', 'public_form_leader']);

        return redirect()->route('public.discipleship.thanks')
            ->with('success', 'Your discipleship update has been submitted successfully!');
    }

    /**
     * Show thank you page.
     */
    public function thanks(): Response
    {
        return Inertia::render('public/ThankYou');
    }
}
