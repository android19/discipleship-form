<?php

use App\Models\Coach;
use App\Models\Leader;
use App\Models\Member;
use App\Models\User;
use App\Models\VictoryGroup;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('members index page loads successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get(route('members.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Index')
        ->has('members')
        ->has('victoryGroups')
        ->has('filters')
    );
});

test('members can be filtered by search', function () {
    $user = User::factory()->create();
    $member1 = Member::factory()->create(['first_name' => 'John', 'last_name' => 'Doe']);
    $member2 = Member::factory()->create(['first_name' => 'Jane', 'last_name' => 'Smith']);

    $this->actingAs($user);

    $response = $this->get(route('members.index', ['search' => 'John']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Index')
        ->has('members.data', 1)
        ->where('members.data.0.first_name', 'John')
    );
});

test('members can be filtered by status', function () {
    $user = User::factory()->create();
    Member::factory()->active()->create();
    Member::factory()->inactive()->create();

    $this->actingAs($user);

    $response = $this->get(route('members.index', ['status' => 'Active']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Index')
        ->has('members.data', 1)
        ->where('members.data.0.status', 'Active')
    );
});

test('create member page loads successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get(route('members.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Create')
        ->has('victoryGroups')
    );
});

test('member can be created successfully', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);

    $this->actingAs($user);

    $memberData = [
        'first_name' => 'John',
        'middle_initial' => 'A',
        'last_name' => 'Doe',
        'age' => 25,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Singles',
        'address' => '123 Test Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'victory_group_id' => $victoryGroup->id,
    ];

    $response = $this->post(route('members.store'), $memberData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('members', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'victory_group_id' => $victoryGroup->id,
    ]);
});

test('member creation requires valid data', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->post(route('members.store'), []);

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

test('member can be viewed', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $member = Member::factory()->create(['victory_group_id' => $victoryGroup->id]);

    $this->actingAs($user);

    $response = $this->get(route('members.show', $member));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Show')
        ->has('member')
        ->where('member.id', $member->id)
    );
});

test('member can be edited', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $member = Member::factory()->create(['victory_group_id' => $victoryGroup->id]);

    $this->actingAs($user);

    $response = $this->get(route('members.edit', $member));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Edit')
        ->has('member')
        ->has('victoryGroups')
        ->where('member.id', $member->id)
    );
});

test('member can be updated', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $member = Member::factory()->create(['victory_group_id' => $victoryGroup->id]);

    $this->actingAs($user);

    $updateData = [
        'first_name' => 'Updated',
        'middle_initial' => 'B',
        'last_name' => 'Name',
        'age' => 30,
        'sex' => 'Female',
        'contact_number' => '09987654321',
        'lifestage' => 'Married',
        'address' => '456 Updated Street',
        'date_launched' => '2024-02-01',
        'status' => 'Active',
        'victory_group_id' => $victoryGroup->id,
    ];

    $response = $this->put(route('members.update', $member), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $member->refresh();
    expect($member->first_name)->toBe('Updated');
    expect($member->last_name)->toBe('Name');
});

test('member can be deleted', function () {
    $user = User::factory()->create();
    $member = Member::factory()->create();

    $this->actingAs($user);

    $response = $this->delete(route('members.destroy', $member));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('members', ['id' => $member->id]);
});

test('members selection api returns correct format', function () {
    $user = User::factory()->create();
    $member = Member::factory()->active()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'middle_initial' => null,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('members.selection'));

    $response->assertOk();
    $response->assertJsonStructure([
        '*' => [
            'value',
            'label',
            'member',
        ],
    ]);

    $data = $response->json();
    expect($data[0]['label'])->toContain('John Doe');
});

test('members selection api can be searched', function () {
    $user = User::factory()->create();
    $member1 = Member::factory()->active()->create(['first_name' => 'John', 'last_name' => 'Doe', 'middle_initial' => null]);
    $member2 = Member::factory()->active()->create(['first_name' => 'Jane', 'last_name' => 'Smith', 'middle_initial' => null]);

    $this->actingAs($user);

    $response = $this->get(route('members.selection', ['search' => 'John']));

    $response->assertOk();
    $data = $response->json();
    expect(count($data))->toBe(1);
    expect($data[0]['label'])->toContain('John Doe');
});

test('member full name accessor works correctly', function () {
    $member = Member::factory()->make([
        'first_name' => 'John',
        'middle_initial' => 'A',
        'last_name' => 'Doe',
    ]);

    expect($member->full_name)->toBe('John A. Doe');
});

test('member full name accessor works without middle initial', function () {
    $member = Member::factory()->make([
        'first_name' => 'John',
        'middle_initial' => null,
        'last_name' => 'Doe',
    ]);

    expect($member->full_name)->toBe('John Doe');
});

test('member scopes work correctly', function () {
    Member::factory()->active()->create();
    Member::factory()->active()->create();
    Member::factory()->inactive()->create();

    expect(Member::active()->count())->toBe(2);
    expect(Member::inactive()->count())->toBe(1);
});
