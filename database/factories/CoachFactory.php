<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coach>
 */
class CoachFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'middle_initial' => $this->faker->optional(0.7)->randomLetter(),
            'last_name' => $this->faker->lastName(),
            'age' => $this->faker->numberBetween(22, 65),
            'sex' => $this->faker->randomElement(['Male', 'Female']),
            'contact_number' => $this->faker->phoneNumber(),
            'lifestage' => $this->faker->randomElement(['Single', 'Married', 'Single Parent']),
            'address' => $this->faker->address(),
            'date_launched' => $this->faker->dateTimeBetween('-5 years', '-1 month'),
            'status' => $this->faker->randomElement(['Active', 'Inactive']),
        ];
    }

    /**
     * Indicate that the coach is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Active',
        ]);
    }

    /**
     * Indicate that the coach is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Inactive',
        ]);
    }
}
