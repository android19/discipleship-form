<?php

namespace Database\Seeders;

use App\Models\Coach;
use Illuminate\Database\Seeder;

class CoachSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coaches = [
            [
                'first_name' => 'Pastor',
                'middle_initial' => 'J',
                'last_name' => 'Smith',
                'age' => 45,
                'sex' => 'Male',
                'contact_number' => '09171234567',
                'lifestage' => 'Married',
                'address' => '123 Church Street, Makati City',
                'date_launched' => '2020-01-15',
                'status' => 'Active',
            ],
            [
                'first_name' => 'Sarah',
                'middle_initial' => 'M',
                'last_name' => 'Johnson',
                'age' => 38,
                'sex' => 'Female',
                'contact_number' => '09189876543',
                'lifestage' => 'Married',
                'address' => '456 Victory Avenue, Quezon City',
                'date_launched' => '2020-03-22',
                'status' => 'Active',
            ],
            [
                'first_name' => 'Michael',
                'middle_initial' => 'R',
                'last_name' => 'Brown',
                'age' => 42,
                'sex' => 'Male',
                'contact_number' => '09195551234',
                'lifestage' => 'Married',
                'address' => '789 Faith Road, Pasig City',
                'date_launched' => '2019-11-10',
                'status' => 'Active',
            ],
            [
                'first_name' => 'Maria',
                'middle_initial' => 'C',
                'last_name' => 'Garcia',
                'age' => 35,
                'sex' => 'Female',
                'contact_number' => '09177778888',
                'lifestage' => 'Single',
                'address' => '321 Grace Street, Mandaluyong City',
                'date_launched' => '2021-05-18',
                'status' => 'Active',
            ],
            [
                'first_name' => 'David',
                'middle_initial' => 'A',
                'last_name' => 'Wilson',
                'age' => 40,
                'sex' => 'Male',
                'contact_number' => '09163334444',
                'lifestage' => 'Married',
                'address' => '654 Hope Boulevard, Taguig City',
                'date_launched' => '2021-02-14',
                'status' => 'Active',
            ],
            [
                'first_name' => 'Rebecca',
                'middle_initial' => 'L',
                'last_name' => 'Taylor',
                'age' => 32,
                'sex' => 'Female',
                'contact_number' => '09152221111',
                'lifestage' => 'Single',
                'address' => '987 Love Street, BGC, Taguig',
                'date_launched' => '2022-08-01',
                'status' => 'Inactive',
            ],
        ];

        foreach ($coaches as $coachData) {
            Coach::create($coachData);
        }
    }
}