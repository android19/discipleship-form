<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ministry>
 */
class MinistryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ministryNames = [
            'Worship Ministry',
            'Children Ministry',
            'Youth Ministry',
            'Prayer Ministry',
            'Ushering Ministry',
            'Technical Ministry',
            'Media Ministry',
            'Counseling Ministry',
            'Outreach Ministry',
            'Fellowship Ministry',
            'Discipleship Ministry',
            'Finance Ministry',
        ];

        return [
            'member_id' => Member::factory(),
            'name' => fake()->randomElement($ministryNames),
            'date_started' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['active', 'rest', 'release']),
        ];
    }

    /**
     * Indicate that the ministry is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the ministry is on rest.
     */
    public function rest(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rest',
        ]);
    }

    /**
     * Indicate that the ministry is released.
     */
    public function released(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'release',
        ]);
    }
}
