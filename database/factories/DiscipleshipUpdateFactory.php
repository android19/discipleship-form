<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DiscipleshipUpdate>
 */
class DiscipleshipUpdateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'leader_name' => $this->faker->name(),
            'mobile_number' => $this->faker->phoneNumber(),
            'ministry_involvement' => $this->faker->randomElement(['Music Ministry', 'Youth Ministry', 'Small Groups', 'Worship Team']),
            'coach' => $this->faker->name(),
            'services_attended' => $this->faker->randomElement(['Sunday Service', 'Wednesday Service', 'Both Services']),
            'victory_groups_leading' => $this->faker->numberBetween(1, 5),
            'victory_group_active' => $this->faker->boolean(80),
            'inactive_reason' => $this->faker->optional()->sentence(),
            'last_victory_group_date' => $this->faker->optional()->date(),
            'victory_group_types' => $this->faker->optional()->randomElements(['students', 'singles', 'married', 'others'], 2),
            'intern_invite_status' => $this->faker->randomElement(['yes', 'none']),
            'victory_group_schedule' => $this->faker->optional()->randomElement(['Saturday 3PM', 'Sunday 5PM', 'Wednesday 7PM']),
            'venue' => $this->faker->optional()->randomElement(['Community Center', 'Home', 'Church', 'Coffee Shop']),
            'concerns' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'reviewed']),
            'submitted_at' => function (array $attributes) {
                return $attributes['status'] === 'draft' ? null : $this->faker->dateTimeBetween('-1 month', 'now');
            },
        ];
    }
}
