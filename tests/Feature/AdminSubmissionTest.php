<?php

use App\Models\User;
use App\Models\DiscipleshipUpdate;
use App\Models\VictoryGroupMember;
use App\Models\DiscipleshipClass;
use App\Models\FormToken;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('non-admin users cannot access admin submissions', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user);
    
    $this->get(route('admin.submissions.index'))->assertStatus(403);
});

test('admin users can access admin submissions index', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin);
    
    $response = $this->get(route('admin.submissions.index'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Index')
        ->has('submissions')
        ->has('stats')
    );
});

test('admin can view submission details', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    $submission = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'submitted'
    ]);

    $this->actingAs($admin);
    
    $response = $this->get(route('admin.submissions.show', $submission));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Show')
        ->has('submission')
        ->where('submission.id', $submission->id)
    );
});

test('admin can approve submission', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    $submission = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'submitted'
    ]);

    $this->actingAs($admin);
    
    $response = $this->post(route('admin.submissions.approve', $submission), [
        'review_notes' => 'Looks good!'
    ]);
    
    $response->assertRedirect(route('admin.submissions.show', $submission));
    $response->assertSessionHas('success');
    
    $submission->refresh();
    expect($submission->status)->toBe('approved');
    expect($submission->reviewed_by)->toBe($admin->id);
    expect($submission->review_notes)->toBe('Looks good!');
    expect($submission->reviewed_at)->not->toBeNull();
});

test('admin can reject submission', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    $submission = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'submitted'
    ]);

    $this->actingAs($admin);
    
    $response = $this->post(route('admin.submissions.reject', $submission), [
        'review_notes' => 'Missing information'
    ]);
    
    $response->assertRedirect(route('admin.submissions.show', $submission));
    $response->assertSessionHas('success');
    
    $submission->refresh();
    expect($submission->status)->toBe('rejected');
    expect($submission->reviewed_by)->toBe($admin->id);
    expect($submission->review_notes)->toBe('Missing information');
    expect($submission->reviewed_at)->not->toBeNull();
});

test('admin can assign token submission to user', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    $targetUser = User::factory()->create();
    $token = FormToken::factory()->create(['created_by' => $user->id]);
    
    $submission = DiscipleshipUpdate::factory()->create([
        'user_id' => null,
        'form_token_id' => $token->id,
        'status' => 'approved'
    ]);

    $this->actingAs($admin);
    
    $response = $this->post(route('admin.submissions.assign', $submission), [
        'user_id' => $targetUser->id
    ]);
    
    $response->assertRedirect(route('admin.submissions.show', $submission));
    $response->assertSessionHas('success');
    
    $submission->refresh();
    expect($submission->user_id)->toBe($targetUser->id);
    expect($submission->assigned_to_user_id)->toBe($targetUser->id);
    expect($submission->reviewed_by)->toBe($admin->id);
    expect($submission->reviewed_at)->not->toBeNull();
});

test('admin can mark submission as under review', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    $submission = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'status' => 'submitted'
    ]);

    $this->actingAs($admin);
    
    $response = $this->post(route('admin.submissions.mark-under-review', $submission));
    
    $response->assertRedirect(route('admin.submissions.show', $submission));
    $response->assertSessionHas('success');
    
    $submission->refresh();
    expect($submission->status)->toBe('under_review');
});

test('admin can edit and update submission', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    $submission = DiscipleshipUpdate::factory()->create([
        'user_id' => $user->id,
        'leader_name' => 'Original Name',
        'status' => 'submitted'
    ]);

    $this->actingAs($admin);
    
    // Test edit page access
    $response = $this->get(route('admin.submissions.edit', $submission));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Edit')
        ->has('submission')
        ->where('submission.id', $submission->id)
    );
    
    // Test update
    $response = $this->put(route('admin.submissions.update', $submission), [
        'leader_name' => 'Updated Name',
        'mobile_number' => '09123456789',
        'ministry_involvement' => 'Music',
        'coach' => 'Test Coach',
        'services_attended' => '2',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'victory_group_types' => ['Singles'],
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Sunday 7PM',
        'venue' => 'Church',
    ]);
    
    $response->assertRedirect(route('admin.submissions.show', $submission));
    $response->assertSessionHas('success');
    
    $submission->refresh();
    expect($submission->leader_name)->toBe('Updated Name');
});

test('admin submissions index shows correct statistics', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    // Create various submissions
    DiscipleshipUpdate::factory()->count(5)->create(['status' => 'submitted']);
    DiscipleshipUpdate::factory()->count(3)->create(['status' => 'under_review']);
    DiscipleshipUpdate::factory()->create(['status' => 'approved', 'reviewed_at' => now()]);
    DiscipleshipUpdate::factory()->create(['status' => 'approved', 'reviewed_at' => now()->subDay()]);

    $this->actingAs($admin);
    
    $response = $this->get(route('admin.submissions.index'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Index')
        ->where('stats.total', 10)
        ->where('stats.pending_review', 5) // submitted status
        ->where('stats.under_review', 3)
        ->where('stats.approved_today', 1) // approved today
    );
});

test('admin submissions can be filtered by status', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    
    DiscipleshipUpdate::factory()->count(2)->create(['status' => 'submitted']);
    DiscipleshipUpdate::factory()->count(3)->create(['status' => 'approved']);

    $this->actingAs($admin);
    
    $response = $this->get(route('admin.submissions.index', ['status' => 'submitted']));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Index')
        ->has('submissions.data', 2)
    );
});

test('admin submissions can be filtered by submission type', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    $token = FormToken::factory()->create(['created_by' => $user->id]);
    
    // Token submissions
    DiscipleshipUpdate::factory()->count(2)->create([
        'user_id' => null,
        'form_token_id' => $token->id,
        'status' => 'submitted'
    ]);
    
    // Authenticated user submissions
    DiscipleshipUpdate::factory()->count(3)->create([
        'user_id' => $user->id,
        'form_token_id' => null,
        'status' => 'submitted'
    ]);

    $this->actingAs($admin);
    
    $response = $this->get(route('admin.submissions.index', ['submission_type' => 'token']));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Index')
        ->has('submissions.data', 2)
    );
    
    $response = $this->get(route('admin.submissions.index', ['submission_type' => 'authenticated']));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/submissions/Index')
        ->has('submissions.data', 3)
    );
});

test('non-admin users cannot perform admin actions', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $submission = DiscipleshipUpdate::factory()->create(['status' => 'submitted']);

    $this->actingAs($user);
    
    $this->post(route('admin.submissions.approve', $submission))->assertStatus(403);
    $this->post(route('admin.submissions.reject', $submission))->assertStatus(403);
    $this->post(route('admin.submissions.assign', $submission), ['user_id' => $user->id])->assertStatus(403);
    $this->post(route('admin.submissions.mark-under-review', $submission))->assertStatus(403);
});
