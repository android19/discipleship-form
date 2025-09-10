<?php

namespace Database\Seeders;

use App\Models\Coach;
use App\Models\Leader;
use Illuminate\Database\Seeder;

class LeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coaches = Coach::all();
        
        if ($coaches->isEmpty()) {
            $this->command->warn('No coaches found. Please run CoachSeeder first.');
            return;
        }

        $leaders = [
            [
                'first_name' => 'John',
                'middle_initial' => 'A',
                'last_name' => 'Martinez',
                'age' => 28,
                'sex' => 'Male',
                'contact_number' => '09171112222',
                'lifestage' => 'Single',
                'address' => '111 Leadership Lane, Makati City',
                'date_launched' => '2021-06-01',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Anna',
                'middle_initial' => 'B',
                'last_name' => 'Santos',
                'age' => 26,
                'sex' => 'Female',
                'contact_number' => '09183334444',
                'lifestage' => 'Single',
                'address' => '222 Victory Street, Quezon City',
                'date_launched' => '2021-09-15',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Mark',
                'middle_initial' => 'C',
                'last_name' => 'Dela Cruz',
                'age' => 31,
                'sex' => 'Male',
                'contact_number' => '09195555666',
                'lifestage' => 'Married',
                'address' => '333 Faith Avenue, Pasig City',
                'date_launched' => '2020-12-10',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Grace',
                'middle_initial' => 'D',
                'last_name' => 'Reyes',
                'age' => 29,
                'sex' => 'Female',
                'contact_number' => '09177777888',
                'lifestage' => 'Married',
                'address' => '444 Hope Road, Mandaluyong City',
                'date_launched' => '2022-01-20',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Peter',
                'middle_initial' => 'E',
                'last_name' => 'Villanueva',
                'age' => 33,
                'sex' => 'Male',
                'contact_number' => '09169999000',
                'lifestage' => 'Married',
                'address' => '555 Grace Street, Taguig City',
                'date_launched' => '2021-03-05',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Joy',
                'middle_initial' => 'F',
                'last_name' => 'Aquino',
                'age' => 25,
                'sex' => 'Female',
                'contact_number' => '09151111222',
                'lifestage' => 'Single',
                'address' => '666 Love Boulevard, BGC, Taguig',
                'date_launched' => '2022-07-12',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'James',
                'middle_initial' => 'G',
                'last_name' => 'Torres',
                'age' => 30,
                'sex' => 'Male',
                'contact_number' => '09173334455',
                'lifestage' => 'Single',
                'address' => '777 Peace Street, Makati City',
                'date_launched' => '2021-11-30',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Lisa',
                'middle_initial' => 'H',
                'last_name' => 'Morales',
                'age' => 27,
                'sex' => 'Female',
                'contact_number' => '09185556677',
                'lifestage' => 'Single',
                'address' => '888 Joy Avenue, Quezon City',
                'date_launched' => '2022-04-18',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Robert',
                'middle_initial' => 'I',
                'last_name' => 'Castro',
                'age' => 34,
                'sex' => 'Male',
                'contact_number' => '09197778899',
                'lifestage' => 'Married',
                'address' => '999 Strength Road, Pasig City',
                'date_launched' => '2020-08-25',
                'status' => 'Active',
                'coach_id' => $coaches->random()->id,
            ],
            [
                'first_name' => 'Michelle',
                'middle_initial' => 'J',
                'last_name' => 'Lim',
                'age' => 24,
                'sex' => 'Female',
                'contact_number' => '09159990000',
                'lifestage' => 'Single',
                'address' => '101 Wisdom Street, Mandaluyong City',
                'date_launched' => '2023-02-14',
                'status' => 'Inactive',
                'coach_id' => $coaches->random()->id,
            ],
        ];

        foreach ($leaders as $leaderData) {
            Leader::create($leaderData);
        }
    }
}