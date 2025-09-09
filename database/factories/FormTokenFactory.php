<?php

namespace Database\Factories;

use App\Models\FormToken;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FormToken>
 */
class FormTokenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'token' => FormToken::generateUniqueToken(),
            'leader_name' => fake()->name(),
            'description' => fake()->optional()->sentence(),
            'expires_at' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'is_active' => fake()->boolean(80), // 80% chance of being active
            'max_uses' => fake()->optional(50)->numberBetween(1, 50), // 50% chance of having a limit
            'used_count' => fake()->numberBetween(0, 5),
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the token is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the token is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the token is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => fake()->dateTimeBetween('-1 month', '-1 day'),
        ]);
    }

    /**
     * Indicate that the token has unlimited uses.
     */
    public function unlimited(): static
    {
        return $this->state(fn (array $attributes) => [
            'max_uses' => null,
        ]);
    }

    /**
     * Indicate that the token has reached its usage limit.
     */
    public function limitReached(): static
    {
        return $this->state(fn (array $attributes) => [
            'max_uses' => 5,
            'used_count' => 5,
        ]);
    }

    /**
     * Set a specific token value.
     */
    public function withToken(string $token): static
    {
        return $this->state(fn (array $attributes) => [
            'token' => $token,
        ]);
    }

    /**
     * Set a specific leader name.
     */
    public function forLeader(string $leaderName): static
    {
        return $this->state(fn (array $attributes) => [
            'leader_name' => $leaderName,
        ]);
    }
}
