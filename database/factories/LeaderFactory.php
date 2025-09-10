<?php

namespace Database\Factories;

use App\Models\Coach;
use App\Models\Leader;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Leader>
 */
class LeaderFactory extends Factory
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
            'age' => fake()->numberBetween(25, 60),
            'sex' => $sex,
            'contact_number' => fake()->phoneNumber(),
            'lifestage' => fake()->randomElement([
                'Young Professional',
                'Singles',
                'Married',
                'Married with Kids',
                'Senior',
            ]),
            'address' => fake()->address(),
            'date_launched' => fake()->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['Active', 'Inactive']),
            'coach_id' => null, // Will be set by relationships or tests
        ];
    }

    /**
     * Indicate that the leader is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
        ]);
    }

    /**
     * Indicate that the leader is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Inactive',
        ]);
    }

    /**
     * Assign the leader to a coach.
     */
    public function withCoach(?Coach $coach = null): static
    {
        return $this->state(fn (array $attributes) => [
            'coach_id' => $coach?->id ?? Coach::factory(),
        ]);
    }

    /**
     * Create a leader with specific lifestage.
     */
    public function lifestage(string $lifestage): static
    {
        return $this->state(fn (array $attributes) => [
            'lifestage' => $lifestage,
        ]);
    }

    /**
     * Create a young leader (25-35).
     */
    public function young(): static
    {
        return $this->state(fn (array $attributes) => [
            'age' => fake()->numberBetween(25, 35),
            'lifestage' => fake()->randomElement(['Young Professional', 'Singles', 'Married']),
        ]);
    }

    /**
     * Create an experienced leader (40+).
     */
    public function experienced(): static
    {
        return $this->state(fn (array $attributes) => [
            'age' => fake()->numberBetween(40, 60),
            'lifestage' => fake()->randomElement(['Married', 'Married with Kids', 'Senior']),
            'date_launched' => fake()->dateTimeBetween('-5 years', '-1 year')->format('Y-m-d'),
        ]);
    }
}
