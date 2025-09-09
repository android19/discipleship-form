<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormTokenRequest;
use App\Http\Requests\UpdateFormTokenRequest;
use App\Models\FormToken;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FormTokenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');

        $tokens = FormToken::query()
            ->with('creator:id,name')
            ->withCount('discipleshipUpdates')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('token', 'like', '%'.$search.'%')
                        ->orWhere('leader_name', 'like', '%'.$search.'%')
                        ->orWhere('description', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('tokens/Index', [
            'tokens' => $tokens,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('tokens/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFormTokenRequest $request): RedirectResponse
    {
        $token = FormToken::create([
            ...$request->validated(),
            'token' => FormToken::generateUniqueToken(),
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('tokens.show', $token)
            ->with('success', 'Form token created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(FormToken $token): Response
    {
        $token->load([
            'creator:id,name',
            'discipleshipUpdates' => function ($query) {
                $query->latest()->limit(10);
            },
        ]);

        return Inertia::render('tokens/Show', [
            'token' => $token,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FormToken $token): Response
    {
        return Inertia::render('tokens/Edit', [
            'token' => $token,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormTokenRequest $request, FormToken $token): RedirectResponse
    {
        $token->update($request->validated());

        return redirect()->route('tokens.show', $token)
            ->with('success', 'Form token updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormToken $token): RedirectResponse
    {
        $token->delete();

        return redirect()->route('tokens.index')
            ->with('success', 'Form token deleted successfully!');
    }

    /**
     * Deactivate a token.
     */
    public function deactivate(FormToken $token): RedirectResponse
    {
        $token->update(['is_active' => false]);

        return back()->with('success', 'Token deactivated successfully!');
    }

    /**
     * Activate a token.
     */
    public function activate(FormToken $token): RedirectResponse
    {
        $token->update(['is_active' => true]);

        return back()->with('success', 'Token activated successfully!');
    }

    /**
     * Reset token usage count.
     */
    public function resetUsage(FormToken $token): RedirectResponse
    {
        $token->update(['used_count' => 0]);

        return back()->with('success', 'Token usage count reset successfully!');
    }
}
