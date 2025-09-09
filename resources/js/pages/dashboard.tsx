import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Users, UserCheck, GraduationCap, BookOpen, Heart, Star, Trophy, Crown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardStats {
    leaders: number;
    coaches: number;
    members: number;
    interns: number;
}

interface CourseCompletions {
    one2one: number;
    victory_weekend: number;
    church_community: number;
    purple_book: number;
    making_disciples: number;
    empowering_leaders: number;
    leadership_113: number;
}

interface Props {
    stats: DashboardStats;
    courseCompletions: CourseCompletions;
    ministryStats: Record<string, number>;
}

export default function Dashboard({ stats, courseCompletions, ministryStats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Victory Group Dashboard</h1>
                    <p className="text-gray-600">Overview of leaders, members, courses, and ministry involvement</p>
                </div>

                {/* Basic Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Leaders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.leaders}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Coaches</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.coaches}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Members</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.members}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Interns</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.interns}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Course Completions */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Discipleship Course Completions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Heart className="h-5 w-5 text-red-500" />
                                <span className="font-medium">One2One</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.one2one}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium">Victory Weekend</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.victory_weekend}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">Church Community</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.church_community}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-purple-500" />
                                <span className="font-medium">Purple Book</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.purple_book}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <UserCheck className="h-5 w-5 text-green-500" />
                                <span className="font-medium">Making Disciples</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.making_disciples}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-indigo-500" />
                                <span className="font-medium">Empowering Leaders</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.empowering_leaders}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Crown className="h-5 w-5 text-pink-500" />
                                <span className="font-medium">Leadership 113</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{courseCompletions.leadership_113}</span>
                        </div>
                    </div>
                </Card>

                {/* Ministry Involvement */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Ministry Involvement</h2>
                    {Object.keys(ministryStats).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(ministryStats).map(([ministry, count]) => (
                                <div key={ministry} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium capitalize">{ministry}</span>
                                    <span className="text-lg font-bold text-gray-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No ministry involvement data available yet.</p>
                            <p className="text-sm">Data will appear as more discipleship forms are approved.</p>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
