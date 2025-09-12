<?php

use App\Models\Coach;
use App\Models\Leader;
use App\Models\Member;
use App\Models\Ministry;
use App\Models\User;
use App\Models\VictoryGroup;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('member can be created with ministry involvement', function () {
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
        'lifestage' => 'Single',
        'address' => '123 Test Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'victory_group_id' => $victoryGroup->id,
        'ministries' => [
            [
                'name' => 'Worship Team',
                'date_started' => '2024-01-15',
                'status' => 'active',
            ],
            [
                'name' => 'Ushers Ministry',
                'date_started' => '2024-02-01',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->post(route('members.store'), $memberData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Verify member is created
    $this->assertDatabaseHas('members', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'victory_group_id' => $victoryGroup->id,
    ]);

    // Verify ministries are created
    $member = Member::where('first_name', 'John')->where('last_name', 'Doe')->first();

    $this->assertDatabaseHas('ministries', [
        'member_id' => $member->id,
        'name' => 'Worship Team',
        'status' => 'active',
    ]);

    $this->assertDatabaseHas('ministries', [
        'member_id' => $member->id,
        'name' => 'Ushers Ministry',
        'status' => 'active',
    ]);

    expect($member->ministries)->toHaveCount(2);
});

test('member can be created without ministry involvement', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);

    $this->actingAs($user);

    $memberData = [
        'first_name' => 'Jane',
        'middle_initial' => 'B',
        'last_name' => 'Smith',
        'age' => 28,
        'sex' => 'Female',
        'contact_number' => '09123456789',
        'lifestage' => 'Married',
        'address' => '456 Test Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'victory_group_id' => $victoryGroup->id,
    ];

    $response = $this->post(route('members.store'), $memberData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Verify member is created
    $member = Member::where('first_name', 'Jane')->where('last_name', 'Smith')->first();
    expect($member)->not->toBeNull();
    expect($member->ministries)->toHaveCount(0);
});

test('ministry with empty name is not created', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);

    $this->actingAs($user);

    $memberData = [
        'first_name' => 'Test',
        'last_name' => 'User',
        'age' => 25,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Test Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'victory_group_id' => $victoryGroup->id,
        'ministries' => [
            [
                'name' => '',
                'date_started' => '2024-01-15',
                'status' => 'active',
            ],
            [
                'name' => 'Valid Ministry',
                'date_started' => '2024-02-01',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->post(route('members.store'), $memberData);

    $response->assertSessionHasErrors('ministries.0.name');

    // Check that the member is not created when validation fails
    $member = Member::where('first_name', 'Test')->where('last_name', 'User')->first();
    expect($member)->toBeNull();
});

test('ministry without date started is not created', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);

    $this->actingAs($user);

    $memberData = [
        'first_name' => 'Test',
        'last_name' => 'User2',
        'age' => 25,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Test Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'victory_group_id' => $victoryGroup->id,
        'ministries' => [
            [
                'name' => 'Ministry Without Date',
                'date_started' => '',
                'status' => 'active',
            ],
            [
                'name' => 'Valid Ministry',
                'date_started' => '2024-02-01',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->post(route('members.store'), $memberData);

    $response->assertRedirect();

    // Verify member is created
    $member = Member::where('first_name', 'Test')->where('last_name', 'User2')->first();

    // Only the valid ministry should be created
    expect($member->ministries)->toHaveCount(1);
    $this->assertDatabaseHas('ministries', [
        'member_id' => $member->id,
        'name' => 'Valid Ministry',
    ]);
});

test('ministry validation rules work correctly', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $memberData = [
        'first_name' => 'Test',
        'last_name' => 'ValidationUser',
        'age' => 25,
        'sex' => 'Male',
        'contact_number' => '09123456789',
        'lifestage' => 'Single',
        'address' => '123 Test Street',
        'date_launched' => '2024-01-01',
        'status' => 'Active',
        'ministries' => [
            [
                'name' => str_repeat('A', 300), // Name too long
                'date_started' => '2025-12-31', // Future date
                'status' => 'invalid_status', // Invalid status
            ],
        ],
    ];

    $response = $this->post(route('members.store'), $memberData);

    $response->assertSessionHasErrors([
        'ministries.0.name',
        'ministries.0.date_started',
        'ministries.0.status',
    ]);
});

test('member show page displays ministry information', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $member = Member::factory()->create(['victory_group_id' => $victoryGroup->id]);

    // Create ministries for the member (order by name to match controller loading)
    Ministry::factory()->active()->create([
        'member_id' => $member->id,
        'name' => 'Ushers Ministry',
    ]);
    Ministry::factory()->rest()->create([
        'member_id' => $member->id,
        'name' => 'Worship Team',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('members.show', $member));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Show')
        ->has('member')
        ->has('member.ministries', 2)
        ->where('member.ministries.0.name', 'Ushers Ministry')
        ->where('member.ministries.1.name', 'Worship Team')
    );
});

test('admin can access ministries index page', function () {
    $adminUser = User::factory()->admin()->create();

    // Create some ministries
    $member1 = Member::factory()->create();
    $member2 = Member::factory()->create();

    Ministry::factory()->active()->create([
        'member_id' => $member1->id,
        'name' => 'Worship Team',
    ]);
    Ministry::factory()->rest()->create([
        'member_id' => $member2->id,
        'name' => 'Ushers Ministry',
    ]);

    $this->actingAs($adminUser);

    $response = $this->get(route('ministries.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ministries/Index')
        ->has('ministries')
        ->has('filters')
    );
});

test('non-admin cannot access ministries index page', function () {
    $regularUser = User::factory()->create();

    $this->actingAs($regularUser);

    $response = $this->get('/ministries');

    // Should be forbidden for non-admin users
    $response->assertForbidden();
});

test('ministries index can be searched by ministry name', function () {
    $adminUser = User::factory()->admin()->create();
    $member = Member::factory()->create();

    Ministry::factory()->create([
        'member_id' => $member->id,
        'name' => 'Worship Team',
    ]);
    Ministry::factory()->create([
        'member_id' => $member->id,
        'name' => 'Ushers Ministry',
    ]);

    $this->actingAs($adminUser);

    $response = $this->get(route('ministries.index', ['search' => 'Worship']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ministries/Index')
        ->has('ministries.data', 1)
        ->where('ministries.data.0.name', 'Worship Team')
    );
});

test('ministries index can be filtered by status', function () {
    $adminUser = User::factory()->admin()->create();
    $member = Member::factory()->create();

    Ministry::factory()->active()->create([
        'member_id' => $member->id,
        'name' => 'Active Ministry',
    ]);
    Ministry::factory()->rest()->create([
        'member_id' => $member->id,
        'name' => 'Rest Ministry',
    ]);

    $this->actingAs($adminUser);

    $response = $this->get(route('ministries.index', ['status' => 'active']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ministries/Index')
        ->has('ministries.data', 1)
        ->where('ministries.data.0.status', 'active')
    );
});

test('ministry model attributes and relationships work correctly', function () {
    $member = Member::factory()->create();
    $ministry = Ministry::factory()->active()->create([
        'member_id' => $member->id,
        'name' => 'Test Ministry',
    ]);

    // Test relationship
    expect($ministry->member)->toBeInstanceOf(Member::class);
    expect($ministry->member->id)->toBe($member->id);

    // Test reverse relationship
    expect($member->ministries)->toHaveCount(1);
    expect($member->ministries->first()->name)->toBe('Test Ministry');

    // Test attributes
    expect($ministry->status_label)->toBe('Active');
    expect($ministry->status_color)->toBe('bg-green-100 text-green-800');
});

test('ministry scopes work correctly', function () {
    $member = Member::factory()->create();

    Ministry::factory()->active()->create(['member_id' => $member->id]);
    Ministry::factory()->active()->create(['member_id' => $member->id]);
    Ministry::factory()->rest()->create(['member_id' => $member->id]);
    Ministry::factory()->released()->create(['member_id' => $member->id]);

    expect(Ministry::active()->count())->toBe(2);
    expect(Ministry::rest()->count())->toBe(1);
    expect(Ministry::released()->count())->toBe(1);
    expect(Ministry::withStatus('active')->count())->toBe(2);
});

test('member edit page loads with ministry information', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $member = Member::factory()->create(['victory_group_id' => $victoryGroup->id]);

    // Create ministries for the member
    Ministry::factory()->active()->create([
        'member_id' => $member->id,
        'name' => 'Worship Team',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('members.edit', $member));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/Edit')
        ->has('member')
        ->has('member.ministries', 1)
        ->where('member.ministries.0.name', 'Worship Team')
    );
});

test('member can be updated with new ministry involvement', function () {
    $user = User::factory()->create();
    $coach = Coach::factory()->create();
    $leader = Leader::factory()->create(['coach_id' => $coach->id]);
    $victoryGroup = VictoryGroup::factory()->create(['leader_id' => $leader->id]);
    $member = Member::factory()->create(['victory_group_id' => $victoryGroup->id]);

    $this->actingAs($user);

    $updateData = [
        'first_name' => $member->first_name,
        'last_name' => $member->last_name,
        'age' => $member->age,
        'sex' => $member->sex,
        'contact_number' => $member->contact_number,
        'lifestage' => $member->lifestage,
        'address' => $member->address,
        'date_launched' => $member->date_launched,
        'status' => $member->status,
        'victory_group_id' => (string) $member->victory_group_id,
        'ministries' => [
            [
                'name' => 'Music',
                'date_started' => '2024-01-15',
                'status' => 'active',
            ],
        ],
    ];

    $response = $this->put(route('members.update', $member), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Verify ministry was added
    $member->refresh();
    expect($member->ministries)->toHaveCount(1);
    $this->assertDatabaseHas('ministries', [
        'member_id' => $member->id,
        'name' => 'Music',
        'status' => 'active',
    ]);
});

test('existing ministry can be updated via edit form', function () {
    $user = User::factory()->create();
    $member = Member::factory()->create();

    // Create an existing ministry
    $ministry = Ministry::factory()->active()->create([
        'member_id' => $member->id,
        'name' => 'Worship Team',
        'status' => 'active',
    ]);

    $this->actingAs($user);

    $updateData = [
        'first_name' => $member->first_name,
        'last_name' => $member->last_name,
        'age' => $member->age,
        'sex' => $member->sex,
        'contact_number' => $member->contact_number,
        'lifestage' => $member->lifestage,
        'address' => $member->address,
        'date_launched' => $member->date_launched,
        'status' => $member->status,
        'victory_group_id' => 'none',
        'existing_ministries' => [
            $ministry->id => [
                'name' => 'Music',
                'date_started' => $ministry->date_started,
                'status' => 'rest',
            ],
        ],
    ];

    $response = $this->put(route('members.update', $member), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Verify ministry was updated
    $ministry->refresh();
    expect($ministry->name)->toBe('Music');
    expect($ministry->status)->toBe('rest');
});

test('existing ministry can be deleted via edit form', function () {
    $user = User::factory()->create();
    $member = Member::factory()->create();

    // Create an existing ministry
    $ministry = Ministry::factory()->active()->create([
        'member_id' => $member->id,
        'name' => 'Worship Team',
    ]);

    $this->actingAs($user);

    $updateData = [
        'first_name' => $member->first_name,
        'last_name' => $member->last_name,
        'age' => $member->age,
        'sex' => $member->sex,
        'contact_number' => $member->contact_number,
        'lifestage' => $member->lifestage,
        'address' => $member->address,
        'date_launched' => $member->date_launched,
        'status' => $member->status,
        'victory_group_id' => 'none',
        'existing_ministries' => [
            $ministry->id => [
                'delete' => '1',
            ],
        ],
    ];

    $response = $this->put(route('members.update', $member), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Verify ministry was deleted
    $this->assertDatabaseMissing('ministries', [
        'id' => $ministry->id,
    ]);

    $member->refresh();
    expect($member->ministries)->toHaveCount(0);
});
