<?php

use App\Models\User;
use App\Models\Coach;
use App\Models\DiscipleshipUpdate;
use App\Models\VictoryGroupMember;
use App\Models\DiscipleshipClass;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('dashboard displays correct leaders count', function () {
    $user = User::factory()->create();
    
    // Create approved discipleship updates with different leaders
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'leader_name' => 'John Doe',
        'status' => 'approved'
    ]);
    
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'leader_name' => 'Jane Smith',
        'status' => 'approved'
    ]);
    
    // Create duplicate leader (should not be double counted)
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'leader_name' => 'John Doe',
        'status' => 'approved'
    ]);
    
    // Create non-approved (should not be counted)
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'leader_name' => 'Bob Wilson',
        'status' => 'submitted'
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->where('stats.leaders', 2)
    );
});

test('dashboard displays correct coaches count', function () {
    $user = User::factory()->create();
    
    // Create active coaches
    Coach::factory()->count(3)->create(['status' => 'Active']);
    
    // Create inactive coach (should not be counted)
    Coach::factory()->create(['status' => 'Inactive']);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->where('stats.coaches', 3)
    );
});

test('dashboard displays correct members and interns count', function () {
    $user = User::factory()->create();
    
    // Create approved discipleship update
    $discipleshipUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved'
    ]);
    
    // Create members
    VictoryGroupMember::factory()->count(5)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'member_type' => 'member',
        'name' => 'Member Name'
    ]);
    
    // Create interns
    VictoryGroupMember::factory()->count(2)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'member_type' => 'intern',
        'name' => 'Intern Name'
    ]);
    
    // Create members for non-approved submission (should not be counted)
    $nonApprovedUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'submitted'
    ]);
    
    VictoryGroupMember::factory()->count(3)->create([
        'discipleship_update_id' => $nonApprovedUpdate->id,
        'member_type' => 'member',
        'name' => 'Non Approved Member'
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->where('stats.members', 5)
        ->where('stats.interns', 2)
    );
});

test('dashboard displays correct one2one completions', function () {
    $user = User::factory()->create();
    
    $discipleshipUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved'
    ]);
    
    // Create members with one2one facilitators
    VictoryGroupMember::factory()->count(3)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'one_to_one_facilitator' => 'Coach Name',
        'member_type' => 'member',
        'name' => 'Member with One2One'
    ]);
    
    // Create members without one2one (should not be counted)
    VictoryGroupMember::factory()->count(2)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'one_to_one_facilitator' => null,
        'member_type' => 'member',
        'name' => 'Member without One2One'
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('courseCompletions')
        ->where('courseCompletions.one2one', 3)
    );
});

test('dashboard displays correct victory weekend completions', function () {
    $user = User::factory()->create();
    
    $discipleshipUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved'
    ]);
    
    // Create members with victory weekend completion
    VictoryGroupMember::factory()->count(4)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'victory_weekend' => 1,
        'member_type' => 'member',
        'name' => 'Member with VW'
    ]);
    
    // Create members without victory weekend (should not be counted)
    VictoryGroupMember::factory()->count(2)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'victory_weekend' => 0,
        'member_type' => 'member',
        'name' => 'Member without VW'
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('courseCompletions')
        ->where('courseCompletions.victory_weekend', 4)
    );
});

test('dashboard displays correct course completions from multiple sources', function () {
    $user = User::factory()->create();
    
    $discipleshipUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved'
    ]);
    
    // Create member completions
    VictoryGroupMember::factory()->count(2)->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'purple_book' => 1,
        'church_community' => 1,
        'making_disciples' => 1,
        'empowering_leaders' => 1,
        'member_type' => 'member',
        'name' => 'Member with Courses'
    ]);
    
    // Create discipleship class completions
    DiscipleshipClass::create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'purple_book' => 1,
        'church_community' => 1,
        'making_disciples' => 1,
        'empowering_leaders' => 1,
        'leadership_113' => 1,
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('courseCompletions')
        ->where('courseCompletions.purple_book', 3) // 2 members + 1 class
        ->where('courseCompletions.church_community', 3) // 2 members + 1 class
        ->where('courseCompletions.making_disciples', 3) // 2 members + 1 class
        ->where('courseCompletions.empowering_leaders', 3) // 2 members + 1 class
        ->where('courseCompletions.leadership_113', 1) // Only from class
    );
});

test('dashboard displays correct ministry involvement statistics', function () {
    $user = User::factory()->create();
    
    // Create discipleship updates with ministry involvement
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'ministry_involvement' => 'Music',
        'status' => 'approved'
    ]);
    
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'ministry_involvement' => 'Music',
        'status' => 'approved'
    ]);
    
    DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'ministry_involvement' => 'Tech',
        'status' => 'approved'
    ]);
    
    $discipleshipUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved'
    ]);
    
    // Create members with ministry involvement
    VictoryGroupMember::factory()->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'ministry_involvement' => 'Music',
        'member_type' => 'member',
        'name' => 'Music Member'
    ]);
    
    VictoryGroupMember::factory()->create([
        'discipleship_update_id' => $discipleshipUpdate->id,
        'ministry_involvement' => 'Children',
        'member_type' => 'member',
        'name' => 'Children Member'
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('ministryStats')
        ->where('ministryStats.Music', 3) // 2 leaders + 1 member
        ->where('ministryStats.Tech', 1) // 1 leader
        ->where('ministryStats.Children', 1) // 1 member
    );
});

test('dashboard ignores non-approved submissions in all statistics', function () {
    $user = User::factory()->create();
    
    // Create non-approved discipleship updates
    $submittedUpdate = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'leader_name' => 'Non Approved Leader',
        'ministry_involvement' => 'Music',
        'status' => 'submitted'
    ]);
    
    // Create members for non-approved update
    VictoryGroupMember::factory()->count(5)->create([
        'discipleship_update_id' => $submittedUpdate->id,
        'member_type' => 'member',
        'victory_weekend' => 1,
        'purple_book' => 1,
        'ministry_involvement' => 'Music',
        'name' => 'Non Approved Member'
    ]);
    
    // Create discipleship class for non-approved update
    DiscipleshipClass::create([
        'discipleship_update_id' => $submittedUpdate->id,
        'purple_book' => 1,
        'leadership_113' => 1,
    ]);

    $this->actingAs($user);
    
    $response = $this->get(route('dashboard'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('stats.leaders', 0)
        ->where('stats.members', 0)
        ->where('courseCompletions.victory_weekend', 0)
        ->where('courseCompletions.purple_book', 0)
        ->where('courseCompletions.leadership_113', 0)
        ->where('ministryStats', [])
    );
});