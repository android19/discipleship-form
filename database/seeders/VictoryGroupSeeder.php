<?php

namespace Database\Seeders;

use App\Models\Leader;
use App\Models\VictoryGroup;
use Illuminate\Database\Seeder;

class VictoryGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaders = Leader::all();
        
        if ($leaders->isEmpty()) {
            $this->command->warn('No leaders found. Please run LeaderSeeder first.');
            return;
        }

        $victoryGroups = [
            [
                'name' => 'Makati Victory Group',
                'schedule' => 'Saturdays 7:00 PM',
                'venue' => 'Makati Sports Club',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'BGC Young Professionals',
                'schedule' => 'Fridays 8:00 PM',
                'venue' => 'High Street Central Square',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Quezon City Family Victory Group',
                'schedule' => 'Sundays 4:00 PM',
                'venue' => 'SM North EDSA Activity Center',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Pasig Victory Group',
                'schedule' => 'Saturdays 6:30 PM',
                'venue' => 'Pasig City Sports Center',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Mandaluyong Singles VG',
                'schedule' => 'Thursdays 7:30 PM',
                'venue' => 'Shaw Boulevard Community Center',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Taguig Victory Group',
                'schedule' => 'Sundays 5:00 PM',
                'venue' => 'Market! Market! Activity Center',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Ortigas Victory Group',
                'schedule' => 'Saturdays 5:30 PM',
                'venue' => 'Robinsons Galleria Activity Area',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Youth Victory Group',
                'schedule' => 'Sundays 3:00 PM',
                'venue' => 'Ayala Triangle Gardens',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Online Victory Group',
                'schedule' => 'Wednesdays 8:00 PM',
                'venue' => 'Zoom Meeting Room',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Campus Victory Group',
                'schedule' => 'Tuesdays 6:00 PM',
                'venue' => 'University of the Philippines Diliman',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Senior Citizens VG',
                'schedule' => 'Sundays 2:00 PM',
                'venue' => 'Rizal Park',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Couples Victory Group',
                'schedule' => 'Saturdays 4:00 PM',
                'venue' => 'Eastwood City Central Plaza',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Single Parents VG',
                'schedule' => 'Sundays 6:00 PM',
                'venue' => 'Greenhills Shopping Center',
                'status' => 'Active',
                'leader_id' => $leaders->random()->id,
            ],
            [
                'name' => 'Alabang Victory Group',
                'schedule' => 'Saturdays 7:00 PM',
                'venue' => 'Festival Mall Activity Center',
                'status' => 'Inactive',
                'leader_id' => $leaders->random()->id,
            ],
        ];

        foreach ($victoryGroups as $groupData) {
            VictoryGroup::create($groupData);
        }
    }
}