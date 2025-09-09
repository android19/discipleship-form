<?php

namespace Database\Seeders;

use App\Models\FormToken;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormTokenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user to assign as creator
        $user = User::first();
        
        if (!$user) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        // Create sample tokens for testing
        $tokens = [
            [
                'leader_name' => 'John Smith',
                'description' => 'Victory Group Leaders Batch 2024 - January',
                'expires_at' => now()->addMonths(3),
                'is_active' => true,
                'max_uses' => 10,
                'used_count' => 3,
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'Maria Garcia',
                'description' => 'Special Event - Youth Leaders Training',
                'expires_at' => now()->addWeeks(2),
                'is_active' => true,
                'max_uses' => 5,
                'used_count' => 1,
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'David Johnson',
                'description' => 'Emergency Access Token for Remote Leaders',
                'expires_at' => now()->addDays(7),
                'is_active' => false,
                'max_uses' => 3,
                'used_count' => 0,
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'Sarah Wilson',
                'description' => 'Campus Ministry Leaders - Spring Semester',
                'expires_at' => now()->addMonths(6),
                'is_active' => true,
                'max_uses' => null, // Unlimited
                'used_count' => 7,
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'Michael Chen',
                'description' => 'Expired token for testing',
                'expires_at' => now()->subDays(10), // Already expired
                'is_active' => true,
                'max_uses' => 15,
                'used_count' => 8,
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'Lisa Rodriguez',
                'description' => 'High Usage Limit Token',
                'expires_at' => now()->addYear(),
                'is_active' => true,
                'max_uses' => 100,
                'used_count' => 45,
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'Robert Taylor',
                'description' => 'Reached Usage Limit Token',
                'expires_at' => now()->addMonths(2),
                'is_active' => true,
                'max_uses' => 5,
                'used_count' => 5, // Reached limit
                'created_by' => $user->id,
            ],
            [
                'leader_name' => 'Jennifer Brown',
                'description' => 'Testing Token - Short Term',
                'expires_at' => now()->addHours(24),
                'is_active' => true,
                'max_uses' => 2,
                'used_count' => 0,
                'created_by' => $user->id,
            ],
        ];

        foreach ($tokens as $tokenData) {
            // Generate unique token for each entry
            $tokenData['token'] = FormToken::generateUniqueToken();
            
            FormToken::create($tokenData);
            
            $this->command->info("Created token: {$tokenData['token']} for {$tokenData['leader_name']}");
        }

        $this->command->info('FormToken seeder completed successfully!');
        $this->command->line('');
        $this->command->line('Sample tokens created:');
        
        // Display created tokens for reference
        $createdTokens = FormToken::latest()->take(count($tokens))->get();
        foreach ($createdTokens as $token) {
            $status = $token->isValid() ? '✅ Valid' : '❌ Invalid';
            $this->command->line("• {$token->token} - {$token->leader_name} ({$status})");
        }
    }
}