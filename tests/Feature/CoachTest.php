<?php

use App\Models\Coach;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('can display the coaches index page', function () {
    $coaches = Coach::factory()->count(3)->create();

    $response = $this->get('/coaches');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 3)
        );
});

it('can display the coach create page', function () {
    $response = $this->get('/coaches/create');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Create')
        );
});

it('can create a new coach', function () {
    $coachData = [
        'first_name' => 'John',
        'middle_initial' => 'D',
        'last_name' => 'Doe',
        'age' => 30,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Main St, City, Country',
        'date_launched' => '2024-01-15',
        'status' => 'Active',
    ];

    $response = $this->post('/coaches', $coachData);

    $response->assertRedirect('/coaches')
        ->assertSessionHas('success');

    $this->assertDatabaseHas('coaches', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'age' => 30,
        'status' => 'Active',
    ]);
});

it('validates required fields when creating a coach', function () {
    $response = $this->post('/coaches', []);

    $response->assertSessionHasErrors([
        'first_name',
        'last_name',
        'age',
        'sex',
        'contact_number',
        'lifestage',
        'address',
        'date_launched',
        'status',
    ]);
});

it('can display a specific coach', function () {
    $coach = Coach::factory()->create([
        'first_name' => 'Jane',
        'last_name' => 'Smith',
    ]);

    $response = $this->get("/coaches/{$coach->id}");

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Show')
            ->has('coach')
            ->where('coach.first_name', 'Jane')
            ->where('coach.last_name', 'Smith')
        );
});

it('can display the coach edit page', function () {
    $coach = Coach::factory()->create();

    $response = $this->get("/coaches/{$coach->id}/edit");

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Edit')
            ->has('coach')
            ->where('coach.id', $coach->id)
        );
});

it('can update a coach', function () {
    $coach = Coach::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'status' => 'Active',
    ]);

    $updateData = [
        'first_name' => 'Johnny',
        'middle_initial' => 'M',
        'last_name' => 'Doe',
        'age' => 35,
        'sex' => 'Male',
        'contact_number' => '09987654321',
        'lifestage' => 'Married',
        'address' => '456 Updated St, New City, Country',
        'date_launched' => '2024-02-20',
        'status' => 'Inactive',
    ];

    $response = $this->patch("/coaches/{$coach->id}", $updateData);

    $response->assertRedirect('/coaches')
        ->assertSessionHas('success');

    $coach->refresh();

    expect($coach->first_name)->toBe('Johnny')
        ->and($coach->age)->toBe(35)
        ->and($coach->status)->toBe('Inactive');
});

it('can delete a coach', function () {
    $coach = Coach::factory()->create();

    $response = $this->delete("/coaches/{$coach->id}");

    $response->assertRedirect('/coaches')
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('coaches', ['id' => $coach->id]);
});

it('generates full name accessor correctly', function () {
    $coach = Coach::factory()->create([
        'first_name' => 'John',
        'middle_initial' => 'D',
        'last_name' => 'Doe',
    ]);

    expect($coach->full_name)->toBe('John D. Doe');

    $coachWithoutMiddle = Coach::factory()->create([
        'first_name' => 'Jane',
        'middle_initial' => null,
        'last_name' => 'Smith',
    ]);

    expect($coachWithoutMiddle->full_name)->toBe('Jane Smith');
});

it('can filter active coaches', function () {
    Coach::factory()->create(['status' => 'Active']);
    Coach::factory()->create(['status' => 'Active']);
    Coach::factory()->create(['status' => 'Inactive']);

    $activeCoaches = Coach::active()->get();

    expect($activeCoaches)->toHaveCount(2);
    expect($activeCoaches->pluck('status')->unique()->first())->toBe('Active');
});

it('can filter inactive coaches', function () {
    Coach::factory()->create(['status' => 'Active']);
    Coach::factory()->create(['status' => 'Inactive']);
    Coach::factory()->create(['status' => 'Inactive']);

    $inactiveCoaches = Coach::inactive()->get();

    expect($inactiveCoaches)->toHaveCount(2);
    expect($inactiveCoaches->pluck('status')->unique()->first())->toBe('Inactive');
});

it('validates age range when creating a coach', function () {
    $response = $this->post('/coaches', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'age' => 17, // Below minimum
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Main St',
        'date_launched' => '2024-01-15',
        'status' => 'Active',
    ]);

    $response->assertSessionHasErrors(['age']);

    $response = $this->post('/coaches', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'age' => 121, // Above maximum
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Main St',
        'date_launched' => '2024-01-15',
        'status' => 'Active',
    ]);

    $response->assertSessionHasErrors(['age']);
});

it('validates sex field accepts only Male or Female', function () {
    $response = $this->post('/coaches', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'age' => 30,
        'sex' => 'Other', // Invalid value
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Main St',
        'date_launched' => '2024-01-15',
        'status' => 'Active',
    ]);

    $response->assertSessionHasErrors(['sex']);
});

it('validates status field accepts only Active or Inactive', function () {
    $response = $this->post('/coaches', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'age' => 30,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Main St',
        'date_launched' => '2024-01-15',
        'status' => 'Pending', // Invalid value
    ]);

    $response->assertSessionHasErrors(['status']);
});

it('can return coaches list for API dropdown', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'middle_initial' => null,
        'last_name' => 'Doe',
        'status' => 'Active',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'middle_initial' => null,
        'last_name' => 'Smith',
        'status' => 'Inactive',
    ]);

    $response = $this->get('/api/coaches/list');

    $response->assertSuccessful()
        ->assertJsonCount(1) // Only active coaches
        ->assertJsonFragment([
            'value' => 'John Doe',
            'label' => 'John Doe',
        ]);
});

it('returns coaches sorted by last name then first name for dropdown', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'middle_initial' => null,
        'last_name' => 'Smith',
        'status' => 'Active',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'middle_initial' => null,
        'last_name' => 'Doe',
        'status' => 'Active',
    ]);
    Coach::factory()->create([
        'first_name' => 'Bob',
        'middle_initial' => null,
        'last_name' => 'Smith',
        'status' => 'Active',
    ]);

    $response = $this->get('/api/coaches/list');

    $response->assertSuccessful();

    $coaches = $response->json();

    // Should be sorted: Jane Doe, Bob Smith, John Smith
    expect($coaches[0]['label'])->toBe('Jane Doe')
        ->and($coaches[1]['label'])->toBe('Bob Smith')
        ->and($coaches[2]['label'])->toBe('John Smith');
});

it('can search coaches by first name', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'middle_initial' => null,
        'last_name' => 'Doe',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'middle_initial' => null,
        'last_name' => 'Smith',
    ]);

    $response = $this->get('/coaches?search=John');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 1)
            ->where('coaches.data.0.first_name', 'John')
            ->where('filters.search', 'John')
        );
});

it('can search coaches by last name', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'middle_initial' => null,
        'last_name' => 'Doe',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'middle_initial' => null,
        'last_name' => 'Smith',
    ]);

    $response = $this->get('/coaches?search=Smith');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 1)
            ->where('coaches.data.0.last_name', 'Smith')
            ->where('filters.search', 'Smith')
        );
});

it('can search coaches by full name', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'middle_initial' => 'D',
        'last_name' => 'Doe',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'middle_initial' => null,
        'last_name' => 'Smith',
    ]);

    $response = $this->get('/coaches?search=John D. Doe');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 1)
            ->where('coaches.data.0.first_name', 'John')
            ->where('filters.search', 'John D. Doe')
        );
});

it('can search coaches by contact number', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'contact_number' => '09123456789',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'contact_number' => '09987654321',
    ]);

    $response = $this->get('/coaches?search=09123456789');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 1)
            ->where('coaches.data.0.contact_number', '09123456789')
            ->where('filters.search', '09123456789')
        );
});

it('can search coaches by status', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'status' => 'Active',
    ]);
    Coach::factory()->create([
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'status' => 'Inactive',
    ]);

    $response = $this->get('/coaches?search=Inactive');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 1)
            ->where('coaches.data.0.status', 'Inactive')
            ->where('filters.search', 'Inactive')
        );
});

it('returns empty results when search matches nothing', function () {
    Coach::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    $response = $this->get('/coaches?search=NonExistent');

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('coaches/Index')
            ->has('coaches.data', 0)
            ->where('filters.search', 'NonExistent')
        );
});
