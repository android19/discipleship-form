<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\MemberDiscipleshipClass;
use Illuminate\Database\Seeder;

class MemberDiscipleshipClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = Member::all();
        
        if ($members->isEmpty()) {
            $this->command->warn('No members found. Please run MemberSeeder first.');
            return;
        }

        $classes = [
            'one2one',
            'victory_weekend',
            'church_community',
            'purple_book',
            'making_disciples',
            'empowering_leaders',
            'leadership_113',
        ];

        // Create discipleship class records for random members
        $members->each(function ($member) use ($classes) {
            // Randomly assign 2-5 classes to each member
            $assignedClasses = collect($classes)->random(rand(2, 5));
            
            foreach ($assignedClasses as $className) {
                $isCompleted = rand(0, 100) < 70; // 70% chance of being completed
                $dateStarted = fake()->dateTimeBetween('-2 years', '-1 month');
                $dateFinished = $isCompleted 
                    ? fake()->dateTimeBetween($dateStarted, 'now')
                    : null;

                MemberDiscipleshipClass::create([
                    'member_id' => $member->id,
                    'class_name' => $className,
                    'date_started' => $dateStarted->format('Y-m-d'),
                    'date_finished' => $dateFinished?->format('Y-m-d'),
                    'is_completed' => $isCompleted,
                ]);
            }
        });

        // Create some specific examples for testing
        $firstMember = $members->first();
        if ($firstMember) {
            // Ensure the first member has all classes for testing
            foreach ($classes as $className) {
                // Check if already exists
                $existing = MemberDiscipleshipClass::where('member_id', $firstMember->id)
                    ->where('class_name', $className)
                    ->first();

                if (!$existing) {
                    $isCompleted = in_array($className, ['one2one', 'victory_weekend', 'church_community', 'purple_book']);
                    $dateStarted = fake()->dateTimeBetween('-2 years', '-1 month');
                    $dateFinished = $isCompleted 
                        ? fake()->dateTimeBetween($dateStarted, 'now')
                        : null;

                    MemberDiscipleshipClass::create([
                        'member_id' => $firstMember->id,
                        'class_name' => $className,
                        'date_started' => $dateStarted->format('Y-m-d'),
                        'date_finished' => $dateFinished?->format('Y-m-d'),
                        'is_completed' => $isCompleted,
                    ]);
                }
            }
        }
    }
}