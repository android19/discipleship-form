<?php

use App\Models\FormToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('can create a form token', function () {
    $tokenData = [
        'leader_name' => 'John Doe',
        'description' => 'Token for Victory Group leaders',
        'expires_at' => now()->addDays(30)->format('Y-m-d'),
        'is_active' => true,
        'max_uses' => 10,
    ];

    $response = $this->post('/tokens', $tokenData);

    $response->assertRedirect();

    $token = FormToken::where('leader_name', 'John Doe')->first();
    expect($token)->not->toBeNull()
        ->and($token->leader_name)->toBe('John Doe')
        ->and($token->is_active)->toBeTrue()
        ->and($token->max_uses)->toBe(10)
        ->and($token->created_by)->toBe($this->user->id);
});

it('generates unique tokens', function () {
    $token1 = FormToken::generateUniqueToken();
    $token2 = FormToken::generateUniqueToken();

    expect($token1)->not->toBe($token2)
        ->and(strlen($token1))->toBe(8)
        ->and(strlen($token2))->toBe(8);
});

it('validates token correctly', function () {
    $validToken = FormToken::factory()->create([
        'is_active' => true,
        'expires_at' => now()->addDays(30),
        'max_uses' => 5,
        'used_count' => 2,
    ]);

    $expiredToken = FormToken::factory()->create([
        'is_active' => true,
        'expires_at' => now()->subDays(1),
    ]);

    $inactiveToken = FormToken::factory()->create([
        'is_active' => false,
        'expires_at' => now()->addDays(30),
    ]);

    $maxUsedToken = FormToken::factory()->create([
        'is_active' => true,
        'expires_at' => now()->addDays(30),
        'max_uses' => 3,
        'used_count' => 3,
    ]);

    expect($validToken->isValid())->toBeTrue()
        ->and($expiredToken->isValid())->toBeFalse()
        ->and($inactiveToken->isValid())->toBeFalse()
        ->and($maxUsedToken->isValid())->toBeFalse();
});

it('can access public token form with valid token', function () {
    $token = FormToken::factory()->create([
        'token' => 'TEST1234',
        'leader_name' => 'John Doe',
        'is_active' => true,
        'expires_at' => now()->addDays(30),
    ]);

    // First verify token
    $response = $this->post('/public/discipleship/verify-token', [
        'token' => 'TEST1234',
    ]);

    $response->assertRedirect('/public/discipleship/create/TEST1234')
        ->assertSessionHas('public_form_token', 'TEST1234')
        ->assertSessionHas('public_form_leader', 'John Doe');

    // Then access the form (follow the redirect)
    $response = $this->followingRedirects()
        ->post('/public/discipleship/verify-token', [
            'token' => 'TEST1234',
        ]);

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('public/DiscipleshipForm')
            ->where('token', 'TEST1234')
            ->where('leaderName', 'John Doe')
        );
});

it('rejects invalid tokens', function () {
    $response = $this->post('/public/discipleship/verify-token', [
        'token' => 'INVALID123',
    ]);

    $response->assertRedirect()
        ->assertSessionHasErrors(['token']);
});

it('can submit discipleship form with valid token', function () {
    $token = FormToken::factory()->create([
        'token' => 'TEST1234',
        'leader_name' => 'John Doe',
        'is_active' => true,
        'expires_at' => now()->addDays(30),
        'used_count' => 0,
    ]);

    // Set up session
    session([
        'public_form_token' => 'TEST1234',
        'public_form_leader' => 'John Doe',
    ]);

    $formData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '09123456789',
        'ministry_involvement' => 'Music',
        'services_attended' => '11AM',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Saturday 7PM',
        'discipleship_classes' => [
            'church_community' => true,
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => true,
        ],
    ];

    $response = $this->post('/public/discipleship/store/TEST1234', $formData);

    $response->assertRedirect('/public/discipleship/thanks');

    // Verify data was stored
    $discipleshipUpdate = $token->discipleshipUpdates()->first();
    expect($discipleshipUpdate)->not->toBeNull()
        ->and($discipleshipUpdate->leader_name)->toBe('John Doe')
        ->and($discipleshipUpdate->status)->toBe('submitted')
        ->and($discipleshipUpdate->user_id)->toBeNull()
        ->and($discipleshipUpdate->form_token_id)->toBe($token->id);

    // Verify token usage was incremented
    $token->refresh();
    expect($token->used_count)->toBe(1);
});

it('increments token usage count', function () {
    $token = FormToken::factory()->create([
        'used_count' => 5,
    ]);

    $token->incrementUsage();

    expect($token->fresh()->used_count)->toBe(6);
});

it('checks if token has reached limit', function () {
    $unlimitedToken = FormToken::factory()->create([
        'max_uses' => null,
        'used_count' => 100,
    ]);

    $limitedToken = FormToken::factory()->create([
        'max_uses' => 5,
        'used_count' => 5,
    ]);

    $belowLimitToken = FormToken::factory()->create([
        'max_uses' => 10,
        'used_count' => 3,
    ]);

    expect($unlimitedToken->hasReachedLimit())->toBeFalse()
        ->and($limitedToken->hasReachedLimit())->toBeTrue()
        ->and($belowLimitToken->hasReachedLimit())->toBeFalse();
});
