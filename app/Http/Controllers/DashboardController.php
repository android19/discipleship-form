<?php

namespace App\Http\Controllers;

use App\Models\Coach;
use App\Models\DiscipleshipUpdate;
use App\Models\VictoryGroupMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display dashboard with comprehensive statistics.
     */
    public function index(): Response
    {
        // Get basic counts
        $stats = [
            'leaders' => $this->getLeadersCount(),
            'coaches' => $this->getCoachesCount(),
            'members' => $this->getMembersCount(),
            'interns' => $this->getInternsCount(),
        ];

        // Get discipleship course completion statistics
        $courseCompletions = [
            'one2one' => $this->getOne2OneCompletions(),
            'victory_weekend' => $this->getVictoryWeekendCompletions(),
            'church_community' => $this->getChurchCommunityCompletions(),
            'purple_book' => $this->getPurpleBookCompletions(),
            'making_disciples' => $this->getMakingDisciplesCompletions(),
            'empowering_leaders' => $this->getEmpoweringLeadersCompletions(),
            'leadership_113' => $this->getLeadership113Completions(),
        ];

        // Get ministry involvement statistics
        $ministryStats = $this->getMinistryInvolvementStats();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'courseCompletions' => $courseCompletions,
            'ministryStats' => $ministryStats,
        ]);
    }

    /**
     * Get count of unique leaders from approved discipleship updates.
     */
    private function getLeadersCount(): int
    {
        return DiscipleshipUpdate::where('status', 'approved')
            ->distinct('leader_name')
            ->count('leader_name');
    }

    /**
     * Get count of active coaches.
     */
    private function getCoachesCount(): int
    {
        return Coach::where('status', 'Active')->count();
    }

    /**
     * Get count of victory group members.
     */
    private function getMembersCount(): int
    {
        return VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('member_type', 'member')->count();
    }

    /**
     * Get count of victory group interns.
     */
    private function getInternsCount(): int
    {
        return VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('member_type', 'intern')->count();
    }

    /**
     * Get One2One completion count.
     */
    private function getOne2OneCompletions(): int
    {
        return VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->whereNotNull('one_to_one_facilitator')
        ->where('one_to_one_facilitator', '!=', '')
        ->count();
    }

    /**
     * Get Victory Weekend completion count.
     */
    private function getVictoryWeekendCompletions(): int
    {
        return VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('victory_weekend', 1)->count();
    }

    /**
     * Get Church Community completion count from both members and discipleship classes.
     */
    private function getChurchCommunityCompletions(): int
    {
        $memberCompletions = VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('church_community', 1)->count();

        $classCompletions = DB::table('discipleship_classes')
            ->join('discipleship_updates', 'discipleship_classes.discipleship_update_id', '=', 'discipleship_updates.id')
            ->where('discipleship_updates.status', 'approved')
            ->where('discipleship_classes.church_community', 1)
            ->count();

        return $memberCompletions + $classCompletions;
    }

    /**
     * Get Purple Book completion count from both members and discipleship classes.
     */
    private function getPurpleBookCompletions(): int
    {
        $memberCompletions = VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('purple_book', 1)->count();

        $classCompletions = DB::table('discipleship_classes')
            ->join('discipleship_updates', 'discipleship_classes.discipleship_update_id', '=', 'discipleship_updates.id')
            ->where('discipleship_updates.status', 'approved')
            ->where('discipleship_classes.purple_book', 1)
            ->count();

        return $memberCompletions + $classCompletions;
    }

    /**
     * Get Making Disciples completion count from both members and discipleship classes.
     */
    private function getMakingDisciplesCompletions(): int
    {
        $memberCompletions = VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('making_disciples', 1)->count();

        $classCompletions = DB::table('discipleship_classes')
            ->join('discipleship_updates', 'discipleship_classes.discipleship_update_id', '=', 'discipleship_updates.id')
            ->where('discipleship_updates.status', 'approved')
            ->where('discipleship_classes.making_disciples', 1)
            ->count();

        return $memberCompletions + $classCompletions;
    }

    /**
     * Get Empowering Leaders completion count from both members and discipleship classes.
     */
    private function getEmpoweringLeadersCompletions(): int
    {
        $memberCompletions = VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->where('empowering_leaders', 1)->count();

        $classCompletions = DB::table('discipleship_classes')
            ->join('discipleship_updates', 'discipleship_classes.discipleship_update_id', '=', 'discipleship_updates.id')
            ->where('discipleship_updates.status', 'approved')
            ->where('discipleship_classes.empowering_leaders', 1)
            ->count();

        return $memberCompletions + $classCompletions;
    }

    /**
     * Get Leadership 113 completion count from discipleship classes.
     */
    private function getLeadership113Completions(): int
    {
        return DB::table('discipleship_classes')
            ->join('discipleship_updates', 'discipleship_classes.discipleship_update_id', '=', 'discipleship_updates.id')
            ->where('discipleship_updates.status', 'approved')
            ->where('discipleship_classes.leadership_113', 1)
            ->count();
    }

    /**
     * Get ministry involvement statistics grouped by ministry.
     */
    private function getMinistryInvolvementStats(): array
    {
        // Get ministry stats from discipleship_updates
        $leaderMinistries = DiscipleshipUpdate::where('status', 'approved')
            ->whereNotNull('ministry_involvement')
            ->where('ministry_involvement', '!=', '')
            ->select('ministry_involvement', DB::raw('count(*) as count'))
            ->groupBy('ministry_involvement')
            ->pluck('count', 'ministry_involvement')
            ->toArray();

        // Get ministry stats from victory_group_members
        $memberMinistries = VictoryGroupMember::whereHas('discipleshipUpdate', function ($query) {
            $query->where('status', 'approved');
        })->whereNotNull('ministry_involvement')
        ->where('ministry_involvement', '!=', '')
        ->select('ministry_involvement', DB::raw('count(*) as count'))
        ->groupBy('ministry_involvement')
        ->pluck('count', 'ministry_involvement')
        ->toArray();

        // Merge and sum the counts
        $combined = [];
        foreach ($leaderMinistries as $ministry => $count) {
            $combined[$ministry] = ($combined[$ministry] ?? 0) + $count;
        }
        foreach ($memberMinistries as $ministry => $count) {
            $combined[$ministry] = ($combined[$ministry] ?? 0) + $count;
        }

        // Sort by count descending
        arsort($combined);

        return $combined;
    }
}
