<?php

use App\Models\Coach;
use App\Models\Leader;
use App\Models\User;
use App\Models\VictoryGroup;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('leader can be created successfully', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();

    $this->actingAs($user);

    $leaderData = [
        'first_name' => 'John',
        'middle_initial' => 'A',
        'last_name' => 'Leader',
        'age' => 30,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Married',
        'address' => '123 Leader Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'coach_id' => $coach->id,
    ];

    $response = $this->post(route('leaders.store'), $leaderData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('leaders', [
        'first_name' => 'John',
        'last_name' => 'Leader',
        'coach_id' => $coach->id,
    ]);
});

test('leader creation requires valid data', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->post(route('leaders.store'), []);

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

test('leader can be updated', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);

    $this->actingAs($user);

    $updateData = [
        'first_name' => 'Updated',
        'middle_initial' => 'B',
        'last_name' => 'Leader',
        'age' => 35,
        'sex' => 'Female',
        'contact_number' => '09987654321',
        'lifestage' => 'Singles',
        'address' => '456 Updated Street',
        'date_launched' => '2024-02-01',
        'status' => 'Active',
        'coach_id' => (string) $coach->id,
    ];

    $response = $this->put(route('leaders.update', $leader), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $leader->refresh();
    expect($leader->first_name)->toBe('Updated');
    expect($leader->last_name)->toBe('Leader');
});

test('leader can be deleted when no victory groups assigned', function () {
    $user = User::factory()->create();
    $leader = Leader::factory()->create();

    $this->actingAs($user);

    $response = $this->delete(route('leaders.destroy', $leader));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('leaders', ['id' => $leader->id]);
});

test('leader cannot be deleted when victory groups assigned', function () {
    $user = User::factory()->create();
    $leader = Leader::factory()->create();
    VictoryGroup::factory()->create(['leader_id' => $leader->id]);

    $this->actingAs($user);

    $response = $this->delete(route('leaders.destroy', $leader));

    $response->assertRedirect();
    $response->assertSessionHas('error');

    $this->assertDatabaseHas('leaders', ['id' => $leader->id]);
});

test('leaders selection api returns correct format', function () {
    $user = User::factory()->create();
    $leader = Leader::factory()->active()->create([
        'first_name' => 'John',
        'last_name' => 'Leader',
        'middle_initial' => null,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('leaders.selection'));

    $response->assertOk();
    $response->assertJsonStructure([
        '*' => [
            'value',
            'label',
            'leader',
        ],
    ]);

    $data = $response->json();
    expect($data[0]['label'])->toContain('John Leader');
});

test('leaders selection api can be searched', function () {
    $user = User::factory()->create();
    $leader1 = Leader::factory()->active()->create(['first_name' => 'John', 'last_name' => 'Leader', 'middle_initial' => null]);
    $leader2 = Leader::factory()->active()->create(['first_name' => 'Jane', 'last_name' => 'Smith', 'middle_initial' => null]);

    $this->actingAs($user);

    $response = $this->get(route('leaders.selection', ['search' => 'John']));

    $response->assertOk();
    $data = $response->json();
    expect(count($data))->toBe(1);
    expect($data[0]['label'])->toContain('John Leader');
});

test('leader full name accessor works correctly', function () {
    $leader = Leader::factory()->make([
        'first_name' => 'John',
        'middle_initial' => 'A',
        'last_name' => 'Leader',
    ]);

    expect($leader->full_name)->toBe('John A. Leader');
});

test('leader full name accessor works without middle initial', function () {
    $leader = Leader::factory()->make([
        'first_name' => 'John',
        'middle_initial' => null,
        'last_name' => 'Leader',
    ]);

    expect($leader->full_name)->toBe('John Leader');
});

test('leader scopes work correctly', function () {
    Leader::factory()->active()->create();
    Leader::factory()->active()->create();
    Leader::factory()->inactive()->create();

    expect(Leader::active()->count())->toBe(2);
    expect(Leader::inactive()->count())->toBe(1);
});

test('leader relationships work correctly', function () {
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup1 = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $victoryGroup2 = VictoryGroup::factory()->create(['leader_id' => $leader->id]);

    expect($leader->coach->id)->toBe($coach->id);
    expect($leader->victoryGroups()->count())->toBe(2);
});
