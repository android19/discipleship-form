<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('accepts valid boolean values for discipleship classes', function () {
    $user = User::factory()->create();

    $validData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => true,
            'purple_book' => false,
            'making_disciples' => 1,
            'empowering_leaders' => 0,
            'leadership_113' => '1',
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $validData);

    $response->assertRedirect();
});

it('accepts valid boolean values for members', function () {
    $user = User::factory()->create();

    $validData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => true,
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => true,
        ],
        'members' => [
            [
                'name' => 'Member 1',
                'victory_weekend' => true,
                'purple_book' => false,
                'church_community' => 1,
                'making_disciples' => 0,
                'empowering_leaders' => '1',
            ],
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $validData);

    $response->assertRedirect();
});

it('rejects invalid boolean values like "on"', function () {
    $user = User::factory()->create();

    $invalidData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => 'on', // Invalid boolean value
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => true,
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $invalidData);

    $response->assertRedirect();
});

it('rejects invalid boolean values for members', function () {
    $user = User::factory()->create();

    $invalidData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => true,
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => true,
        ],
        'members' => [
            [
                'name' => 'Member 1',
                'victory_weekend' => 'on', // Invalid boolean value
                'purple_book' => false,
                'church_community' => true,
                'making_disciples' => false,
                'empowering_leaders' => true,
            ],
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $invalidData);

    $response->assertRedirect();
});

it('transforms null values to false', function () {
    $user = User::factory()->create();

    $validData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => null,
            'purple_book' => null,
            'making_disciples' => null,
            'empowering_leaders' => null,
            'leadership_113' => null,
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $validData);

    $response->assertRedirect();
});

it('transforms "on" values to true booleans', function () {
    $user = User::factory()->create();

    $dataWithOnValues = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => 'on', // This should be transformed to true
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => 'on', // This should be transformed to true
        ],
        'members' => [
            [
                'name' => 'Member 1',
                'victory_weekend' => 'on', // This should be transformed to true
                'purple_book' => false,
                'church_community' => true,
                'making_disciples' => false,
                'empowering_leaders' => 'on', // This should be transformed to true
            ],
        ],
        'interns' => [
            [
                'name' => 'Intern 1',
                'victory_weekend' => 'on', // This should be transformed to true
                'purple_book' => false,
                'church_community' => true,
                'making_disciples' => false,
                'empowering_leaders' => 'on', // This should be transformed to true
            ],
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $dataWithOnValues);

    $response->assertRedirect();
});

it('accepts forms without interns', function () {
    $user = User::factory()->create();

    $dataWithoutInterns = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'discipleship_classes' => [
            'church_community' => true,
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => true,
        ],
        'members' => [
            [
                'name' => 'Member 1',
                'victory_weekend' => true,
                'purple_book' => false,
                'church_community' => true,
                'making_disciples' => false,
                'empowering_leaders' => true,
            ],
        ],
        // No interns array - this should be allowed
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $dataWithoutInterns);

    $response->assertRedirect();
});

it('accepts valid service times for services_attended field', function () {
    $user = User::factory()->create();

    // Test each valid service time
    $serviceTimes = ['8AM', '9:30AM', '11AM', '1:30PM', '3PM', '5PM'];

    foreach ($serviceTimes as $serviceTime) {
        $validData = [
            'leader_name' => 'John Doe',
            'mobile_number' => '123456789',
            'victory_groups_leading' => 1,
            'victory_group_active' => true,
            'intern_invite_status' => 'yes',
            'victory_group_schedule' => 'Weekly',
            'services_attended' => $serviceTime,
            'discipleship_classes' => [
                'church_community' => true,
                'purple_book' => false,
                'making_disciples' => true,
                'empowering_leaders' => false,
                'leadership_113' => true,
            ],
        ];

        $response = $this->actingAs($user)->postJson('/discipleship', $validData);

        $response->assertRedirect();
    }
});

it('rejects invalid service times for services_attended field', function () {
    $user = User::factory()->create();

    $invalidData = [
        'leader_name' => 'John Doe',
        'mobile_number' => '123456789',
        'victory_groups_leading' => 1,
        'victory_group_active' => true,
        'intern_invite_status' => 'yes',
        'victory_group_schedule' => 'Weekly',
        'services_attended' => '7AM', // Invalid service time
        'discipleship_classes' => [
            'church_community' => true,
            'purple_book' => false,
            'making_disciples' => true,
            'empowering_leaders' => false,
            'leadership_113' => true,
        ],
    ];

    $response = $this->actingAs($user)->postJson('/discipleship', $invalidData);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['services_attended']);
});
