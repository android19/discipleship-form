<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\VictoryGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sex = fake()->randomElement(['Male', 'Female']);

        return [
            'first_name' => fake()->firstName($sex === 'Male' ? 'male' : 'female'),
            'middle_initial' => fake()->optional(0.7)->randomLetter(),
            'last_name' => fake()->lastName(),
            'age' => fake()->numberBetween(18, 65),
            'sex' => $sex,
            'contact_number' => fake()->phoneNumber(),
            'lifestage' => fake()->randomElement([
                'Kids',
                'Youth',
                'Young Professional',
                'Singles',
                'Married',
                'Married with Kids',
                'Senior',
            ]),
            'address' => fake()->address(),
            'date_launched' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['Active', 'Inactive']),
            'victory_group_id' => null, // Will be set by relationships or tests
        ];
    }

    /**
     * Indicate that the member is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
        ]);
    }

    /**
     * Indicate that the member is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Inactive',
        ]);
    }

    /**
     * Assign the member to a victory group.
     */
    public function withVictoryGroup(?VictoryGroup $victoryGroup = null): static
    {
        return $this->state(fn (array $attributes) => [
            'victory_group_id' => $victoryGroup?->id ?? VictoryGroup::factory(),
        ]);
    }

    /**
     * Create a member with specific lifestage.
     */
    public function lifestage(string $lifestage): static
    {
        return $this->state(fn (array $attributes) => [
            'lifestage' => $lifestage,
        ]);
    }

    /**
     * Create a young member (18-25).
     */
    public function young(): static
    {
        return $this->state(fn (array $attributes) => [
            'age' => fake()->numberBetween(18, 25),
            'lifestage' => fake()->randomElement(['Youth', 'Young Professional', 'Singles']),
        ]);
    }

    /**
     * Create a senior member (50+).
     */
    public function senior(): static
    {
        return $this->state(fn (array $attributes) => [
            'age' => fake()->numberBetween(50, 65),
            'lifestage' => fake()->randomElement(['Married', 'Married with Kids', 'Senior']),
        ]);
    }
}
