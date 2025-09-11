import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface DiscipleshipClass {
    id: number;
    class_name: string;
    date_started?: string;
    date_finished?: string;
    is_completed: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Member {
    id: number;
    first_name: string;
    middle_initial?: string;
    last_name: string;
    full_name: string;
    age: number;
    sex: string;
    contact_number: string;
    lifestage: string;
    address: string;
    date_launched: string;
    status: string;
    victory_group?: {
        id: number;
        name: string;
        schedule?: string;
        venue?: string;
        leader?: {
            id: number;
            full_name: string;
        };
    };
    discipleship_classes?: DiscipleshipClass[];
    created_at: string;
    updated_at: string;
}

interface Props {
    member: Member;
    discipleshipClasses: Record<string, string>;
}

export default function Show({ member, discipleshipClasses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Members',
            href: '/members',
        },
        {
            title: member.full_name,
            href: `/members/${member.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this member?')) {
            router.delete(`/members/${member.id}`, {
                onSuccess: () => {
                    router.visit('/members');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${member.full_name} - Member Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <Card className="bg-green-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        MEMBER DETAILS
                    </h1>
                    <p className="text-center mt-2">
                        {member.full_name}
                    </p>
                </Card>

                {/* Member Information */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-green-600">
                            Personal Information
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.visit(`/members/${member.id}/edit`)}
                            >
                                Edit Member
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete Member
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Full Name</div>
                            <div className="mt-1 text-lg">{member.full_name}</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Age</div>
                            <div className="mt-1 text-lg">{member.age}</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Sex</div>
                            <div className="mt-1 text-lg">{member.sex}</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Contact Number</div>
                            <div className="mt-1 text-lg">{member.contact_number}</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Lifestage</div>
                            <div className="mt-1 text-lg">{member.lifestage}</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Date Baptized</div>
                            <div className="mt-1 text-lg">
                                {new Date(member.date_launched).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Status</div>
                            <div className="mt-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${member.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {member.status}
                                </span>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="font-medium text-gray-600">Address</div>
                            <div className="mt-1 text-lg">{member.address}</div>
                        </div>
                    </div>
                </Card>

                {/* Victory Group Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        Victory Group Information
                    </h2>

                    {member.victory_group ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <div className="font-medium text-gray-600">Victory Group</div>
                                <div className="mt-1 text-lg">
                                    <span className="text-blue-600 font-medium">
                                        {member.victory_group.name}
                                    </span>
                                </div>
                            </div>

                            {member.victory_group.leader && (
                                <div>
                                    <div className="font-medium text-gray-600">Victory Group Leader</div>
                                    <div className="mt-1 text-lg">
                                        <span className="text-blue-600 font-medium">
                                            {member.victory_group.leader.full_name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {member.victory_group.schedule && (
                                <div>
                                    <div className="font-medium text-gray-600">Schedule</div>
                                    <div className="mt-1 text-lg">
                                        <span className="text-gray-900">
                                            {member.victory_group.schedule}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {member.victory_group.venue && (
                                <div className="md:col-span-2 lg:col-span-3">
                                    <div className="font-medium text-gray-600">Venue</div>
                                    <div className="mt-1 text-lg">
                                        <span className="text-gray-900">
                                            {member.victory_group.venue}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-lg">👥</div>
                            <p className="text-gray-600 mt-2">No Victory Group assigned</p>
                            <p className="text-gray-500 text-sm mt-1">Victory Group can be assigned when editing this member.</p>
                        </div>
                    )}
                </Card>

                {/* Discipleship Classes */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        Discipleship Classes Progress
                    </h2>

                    {member.discipleship_classes && member.discipleship_classes.length > 0 ? (
                        <div className="space-y-4">
                            {member.discipleship_classes.map((classProgress) => (
                                <div key={classProgress.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-900">
                                            {discipleshipClasses[classProgress.class_name] || classProgress.class_name}
                                        </h3>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${classProgress.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : classProgress.status === 'in_progress'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {classProgress.status === 'completed'
                                                ? 'Completed'
                                                : classProgress.status === 'in_progress'
                                                    ? 'In Progress'
                                                    : 'Not Started'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="font-medium text-gray-600 text-sm">Date Started</div>
                                            <div className="mt-1">
                                                {classProgress.date_started
                                                    ? new Date(classProgress.date_started).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : <span className="text-gray-400">Not started yet</span>
                                                }
                                            </div>
                                        </div>

                                        <div>
                                            <div className="font-medium text-gray-600 text-sm">Date Finished</div>
                                            <div className="mt-1">
                                                {classProgress.date_finished
                                                    ? new Date(classProgress.date_finished).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : <span className="text-gray-400">Not finished yet</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-lg">📚</div>
                            <p className="text-gray-600 mt-2">No discipleship classes recorded yet.</p>
                            <p className="text-gray-500 text-sm mt-1">Classes can be added when editing this member.</p>
                        </div>
                    )}
                </Card>

                {/* Activity Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        Activity Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Created</div>
                            <div className="mt-1 text-lg">
                                {new Date(member.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-600">Last Updated</div>
                            <div className="mt-1 text-lg">
                                {new Date(member.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Back Button */}
                <Card className="p-6">
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/members')}
                        >
                            Back to Members List
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}