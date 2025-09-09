<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCoachRequest;
use App\Http\Requests\UpdateCoachRequest;
use App\Models\Coach;
use Inertia\Inertia;

class CoachController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request('search');

        $coaches = Coach::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', '%'.$search.'%')
                        ->orWhere('last_name', 'like', '%'.$search.'%')
                        ->orWhere('contact_number', 'like', '%'.$search.'%')
                        ->orWhere('lifestage', 'like', '%'.$search.'%')
                        ->orWhere('address', 'like', '%'.$search.'%')
                        ->orWhere('status', 'like', '%'.$search.'%');

                    // Also search in combinations for full name matching
                    if (str_contains($search, ' ')) {
                        $parts = explode(' ', $search, 3);
                        if (count($parts) >= 2) {
                            $firstName = trim($parts[0]);
                            $rest = trim($parts[1]);

                            // Check if middle part looks like middle initial (single char or char with dot)
                            if (strlen($rest) <= 2 && count($parts) >= 3) {
                                $middleInitial = rtrim($rest, '.');
                                $lastName = trim($parts[2]);

                                $q->orWhere(function ($nameQuery) use ($firstName, $middleInitial, $lastName) {
                                    $nameQuery->where('first_name', 'like', '%'.$firstName.'%')
                                        ->where('middle_initial', 'like', '%'.$middleInitial.'%')
                                        ->where('last_name', 'like', '%'.$lastName.'%');
                                });
                            } else {
                                // Treat as first name + last name
                                $lastName = $rest;
                                $q->orWhere(function ($nameQuery) use ($firstName, $lastName) {
                                    $nameQuery->where('first_name', 'like', '%'.$firstName.'%')
                                        ->where('last_name', 'like', '%'.$lastName.'%');
                                });
                            }
                        }
                    }
                });
            })
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('coaches/Index', [
            'coaches' => $coaches,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('coaches/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCoachRequest $request)
    {
        Coach::create($request->validated());

        return redirect()->route('coaches.index')
            ->with('success', 'Coach created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Coach $coach)
    {
        return Inertia::render('coaches/Show', [
            'coach' => $coach,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coach $coach)
    {
        return Inertia::render('coaches/Edit', [
            'coach' => $coach,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCoachRequest $request, Coach $coach)
    {
        $coach->update($request->validated());

        return redirect()->route('coaches.index')
            ->with('success', 'Coach updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coach $coach)
    {
        $coach->delete();

        return redirect()->route('coaches.index')
            ->with('success', 'Coach deleted successfully.');
    }

    /**
     * Get coaches for dropdown selection.
     */
    public function list()
    {
        $coaches = Coach::active()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(function ($coach) {
                return [
                    'value' => $coach->full_name,
                    'label' => $coach->full_name,
                ];
            });

        return response()->json($coaches);
    }
}
