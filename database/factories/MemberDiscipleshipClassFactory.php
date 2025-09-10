<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberDiscipleshipClass>
 */
class MemberDiscipleshipClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $classes = [
            'one2one',
            'victory_weekend',
            'church_community',
            'purple_book',
            'making_disciples',
            'empowering_leaders',
            'leadership_113',
        ];

        $isCompleted = fake()->boolean(60); // 60% chance of being completed
        $dateStarted = fake()->optional(0.8)->dateTimeBetween('-2 years', 'now');
        $dateFinished = null;

        if ($isCompleted && $dateStarted) {
            $dateFinished = fake()->dateTimeBetween($dateStarted, 'now');
        }

        return [
            'member_id' => Member::factory(),
            'class_name' => fake()->randomElement($classes),
            'date_started' => $dateStarted?->format('Y-m-d'),
            'date_finished' => $dateFinished?->format('Y-m-d'),
            'is_completed' => $isCompleted && $dateFinished,
        ];
    }

    /**
     * Create a completed discipleship class.
     */
    public function completed(): static
    {
        $dateStarted = fake()->dateTimeBetween('-2 years', '-1 month');
        $dateFinished = fake()->dateTimeBetween($dateStarted, 'now');

        return $this->state(fn (array $attributes) => [
            'date_started' => $dateStarted->format('Y-m-d'),
            'date_finished' => $dateFinished->format('Y-m-d'),
            'is_completed' => true,
        ]);
    }

    /**
     * Create an in-progress discipleship class.
     */
    public function inProgress(): static
    {
        $dateStarted = fake()->dateTimeBetween('-6 months', 'now');

        return $this->state(fn (array $attributes) => [
            'date_started' => $dateStarted->format('Y-m-d'),
            'date_finished' => null,
            'is_completed' => false,
        ]);
    }

    /**
     * Create a not started discipleship class.
     */
    public function notStarted(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_started' => null,
            'date_finished' => null,
            'is_completed' => false,
        ]);
    }

    /**
     * Create a discipleship class for a specific class type.
     */
    public function forClass(string $className): static
    {
        return $this->state(fn (array $attributes) => [
            'class_name' => $className,
        ]);
    }

    /**
     * Create a discipleship class for a specific member.
     */
    public function forMember(Member $member): static
    {
        return $this->state(fn (array $attributes) => [
            'member_id' => $member->id,
        ]);
    }

    /**
     * Create One2One class progress.
     */
    public function one2one(): static
    {
        return $this->forClass('one2one');
    }

    /**
     * Create Victory Weekend class progress.
     */
    public function victoryWeekend(): static
    {
        return $this->forClass('victory_weekend');
    }

    /**
     * Create Church Community class progress.
     */
    public function churchCommunity(): static
    {
        return $this->forClass('church_community');
    }

    /**
     * Create Purple Book class progress.
     */
    public function purpleBook(): static
    {
        return $this->forClass('purple_book');
    }

    /**
     * Create Making Disciples class progress.
     */
    public function makingDisciples(): static
    {
        return $this->forClass('making_disciples');
    }

    /**
     * Create Empowering Leaders class progress.
     */
    public function empoweringLeaders(): static
    {
        return $this->forClass('empowering_leaders');
    }

    /**
     * Create Leadership 113 class progress.
     */
    public function leadership113(): static
    {
        return $this->forClass('leadership_113');
    }
}
