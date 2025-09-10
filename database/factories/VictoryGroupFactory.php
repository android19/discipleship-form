<?php

namespace Database\Factories;

use App\Models\Leader;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VictoryGroup>
 */
class VictoryGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lifestages = ['Kids', 'Youth', 'Young Professional', 'Singles', 'Married', 'Married with Kids', 'Senior'];
        $locations = ['Makati', 'Quezon City', 'Manila', 'Pasig', 'Taguig', 'Alabang', 'Ortigas', 'BGC'];

        $lifestage = fake()->randomElement($lifestages);
        $location = fake()->randomElement($locations);

        return [
            'name' => $lifestage.' - '.$location,
            'leader_id' => null, // Will be set by relationships or tests
            'schedule' => fake()->randomElement([
                'Sunday 2PM',
                'Sunday 4PM',
                'Sunday 6PM',
                'Friday 7PM',
                'Saturday 2PM',
                'Saturday 4PM',
                'Wednesday 7PM',
            ]),
            'venue' => fake()->randomElement([
                'Victory Church Makati',
                'Victory Church QC',
                'Victory Church Manila',
                'Victory Church Pasig',
                'Victory Church Taguig',
                'Victory Church Alabang',
                'Victory Church Ortigas',
                'Victory Church BGC',
                'Online',
                'Coffee Shop',
                'Member\'s Home',
                'Community Center',
            ]),
            'status' => fake()->randomElement(['Active', 'Inactive']),
        ];
    }

    /**
     * Indicate that the victory group is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
        ]);
    }

    /**
     * Indicate that the victory group is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Inactive',
        ]);
    }

    /**
     * Assign the victory group to a leader.
     */
    public function withLeader(?Leader $leader = null): static
    {
        return $this->state(fn (array $attributes) => [
            'leader_id' => $leader?->id ?? Leader::factory(),
        ]);
    }

    /**
     * Create a victory group for a specific lifestage.
     */
    public function forLifestage(string $lifestage): static
    {
        $locations = ['Makati', 'Quezon City', 'Manila', 'Pasig', 'Taguig', 'Alabang', 'Ortigas', 'BGC'];
        $location = fake()->randomElement($locations);

        return $this->state(fn (array $attributes) => [
            'name' => $lifestage.' - '.$location,
        ]);
    }

    /**
     * Create a victory group with online setup.
     */
    public function online(): static
    {
        return $this->state(fn (array $attributes) => [
            'venue' => 'Online',
            'schedule' => fake()->randomElement([
                'Sunday 7PM',
                'Friday 8PM',
                'Saturday 7PM',
                'Wednesday 8PM',
            ]),
        ]);
    }

    /**
     * Create a youth victory group.
     */
    public function youth(): static
    {
        return $this->forLifestage('Youth')->state(fn (array $attributes) => [
            'schedule' => fake()->randomElement([
                'Saturday 2PM',
                'Saturday 4PM',
                'Sunday 2PM',
                'Friday 6PM',
            ]),
        ]);
    }

    /**
     * Create a singles victory group.
     */
    public function singles(): static
    {
        return $this->forLifestage('Singles')->state(fn (array $attributes) => [
            'schedule' => fake()->randomElement([
                'Friday 7PM',
                'Saturday 4PM',
                'Sunday 4PM',
                'Wednesday 7PM',
            ]),
        ]);
    }

    /**
     * Create a married victory group.
     */
    public function married(): static
    {
        return $this->forLifestage('Married')->state(fn (array $attributes) => [
            'schedule' => fake()->randomElement([
                'Sunday 2PM',
                'Sunday 4PM',
                'Saturday 2PM',
                'Saturday 4PM',
            ]),
        ]);
    }
}
