import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Member {
    id: number;
    name: string;
    one_to_one_facilitator: string | null;
    one_to_one_date_started: string | null;
    victory_weekend: boolean;
    purple_book: boolean;
    church_community: boolean;
    making_disciples: boolean;
    empowering_leaders: boolean;
    ministry_involvement: string | null;
    remarks: string | null;
    member_type: 'member' | 'intern';
}

interface DiscipleshipClass {
    church_community: boolean;
    purple_book: boolean;
    making_disciples: boolean;
    empowering_leaders: boolean;
    leadership_113: boolean;
}

interface DiscipleshipUpdate {
    id: number;
    leader_name: string;
    mobile_number: string;
    ministry_involvement: string | null;
    coach: string | null;
    services_attended: string | null;
    victory_groups_leading: number;
    victory_group_active: boolean;
    inactive_reason: string | null;
    last_victory_group_date: string | null;
    victory_group_types: string[] | null;
    intern_invite_status: 'yes' | 'none';
    victory_group_schedule: string | null;
    venue: string | null;
    concerns: string | null;
    status: 'draft' | 'submitted' | 'reviewed';
    submitted_at: string | null;
    created_at: string;
    updated_at: string;
    discipleship_class: DiscipleshipClass | null;
    members: Member[];
    interns: Member[];
}

interface Props {
    discipleshipUpdate: DiscipleshipUpdate;
}

export default function Show({ discipleshipUpdate }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Discipleship Updates',
            href: '/discipleship',
        },
        {
            title: discipleshipUpdate.leader_name,
            href: `/discipleship/${discipleshipUpdate.id}`,
        },
    ];

    const getStatusBadge = (status: string) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            submitted: 'bg-blue-100 text-blue-800',
            reviewed: 'bg-green-100 text-green-800',
        };

        return (
            <Badge className={colors[status as keyof typeof colors]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleSubmit = () => {
        if (confirm('Are you sure you want to submit this discipleship update? You will not be able to edit it after submission.')) {
            router.patch(`/discipleship/${discipleshipUpdate.id}/submit`);
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this discipleship update? This action cannot be undone.')) {
            router.delete(`/discipleship/${discipleshipUpdate.id}`);
        }
    };

    const renderMemberTable = (members: Member[], title: string, headerColor: string) => {
        if (members.length === 0) return null;

        return (
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: headerColor }}>
                    {title}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Name</th>
                                <th className="border border-gray-300 p-2 text-left">ONE2ONE Facilitator</th>
                                <th className="border border-gray-300 p-2 text-left">Date Started</th>
                                <th className="border border-gray-300 p-2 text-center">VW</th>
                                <th className="border border-gray-300 p-2 text-center">PB</th>
                                <th className="border border-gray-300 p-2 text-center">CC</th>
                                <th className="border border-gray-300 p-2 text-center">MD</th>
                                <th className="border border-gray-300 p-2 text-center">EL</th>
                                <th className="border border-gray-300 p-2 text-left">Ministry</th>
                                <th className="border border-gray-300 p-2 text-left">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td className="border border-gray-300 p-2 font-medium">{member.name}</td>
                                    <td className="border border-gray-300 p-2">{member.one_to_one_facilitator || '-'}</td>
                                    <td className="border border-gray-300 p-2">
                                        {member.one_to_one_date_started ? formatDate(member.one_to_one_date_started) : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {member.victory_weekend ? '✓' : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {member.purple_book ? '✓' : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {member.church_community ? '✓' : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {member.making_disciples ? '✓' : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        {member.empowering_leaders ? '✓' : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2">{member.ministry_involvement || '-'}</td>
                                    <td className="border border-gray-300 p-2">{member.remarks || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    VW = Victory Weekend, PB = Purple Book, CC = Church Community, MD = Making Disciples, EL = Empowering Leaders
                </p>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${discipleshipUpdate.leader_name} - Discipleship Update`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            {discipleshipUpdate.leader_name}'s Discipleship Update
                        </h1>
                        <div className="flex items-center gap-4">
                            {getStatusBadge(discipleshipUpdate.status)}
                            <span className="text-gray-500">
                                Created: {formatDate(discipleshipUpdate.created_at)}
                            </span>
                            {discipleshipUpdate.submitted_at && (
                                <span className="text-gray-500">
                                    Submitted: {formatDate(discipleshipUpdate.submitted_at)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {discipleshipUpdate.status === 'draft' && (
                            <>
                                <Link href={`/discipleship/${discipleshipUpdate.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>
                                <Button onClick={handleSubmit}>Submit</Button>
                                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                            </>
                        )}
                        <Button variant="outline" onClick={() => window.print()}>Print</Button>
                    </div>
                </div>

                {/* Leader Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Leader Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-gray-700">Name:</label>
                            <p className="text-gray-900">{discipleshipUpdate.leader_name}</p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Mobile Number:</label>
                            <p className="text-gray-900">{discipleshipUpdate.mobile_number}</p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Ministry Involvement:</label>
                            <p className="text-gray-900">{discipleshipUpdate.ministry_involvement || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Coach:</label>
                            <p className="text-gray-900">{discipleshipUpdate.coach || 'Not specified'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="font-medium text-gray-700">Services Usually Attended:</label>
                            <p className="text-gray-900">{discipleshipUpdate.services_attended || 'Not specified'}</p>
                        </div>
                    </div>
                </Card>

                {/* Victory Group Details */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Victory Group Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-gray-700">Victory Groups Leading:</label>
                            <p className="text-gray-900">{discipleshipUpdate.victory_groups_leading}</p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Victory Group Active:</label>
                            <p className="text-gray-900">
                                {discipleshipUpdate.victory_group_active ? (
                                    <span className="text-green-600 font-medium">Yes</span>
                                ) : (
                                    <span className="text-red-600 font-medium">No</span>
                                )}
                            </p>
                        </div>
                        {!discipleshipUpdate.victory_group_active && discipleshipUpdate.inactive_reason && (
                            <div className="md:col-span-2">
                                <label className="font-medium text-gray-700">Reason for Inactive:</label>
                                <p className="text-gray-900">{discipleshipUpdate.inactive_reason}</p>
                            </div>
                        )}
                        <div>
                            <label className="font-medium text-gray-700">Last Victory Group Date:</label>
                            <p className="text-gray-900">{formatDate(discipleshipUpdate.last_victory_group_date)}</p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Victory Group Types:</label>
                            <p className="text-gray-900">
                                {discipleshipUpdate.victory_group_types?.join(', ') || 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Intern Invite Status:</label>
                            <p className="text-gray-900">
                                {discipleshipUpdate.intern_invite_status === 'yes' ? 'Yes' : 'None'}
                            </p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Victory Group Schedule:</label>
                            <p className="text-gray-900">{discipleshipUpdate.victory_group_schedule || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700">Venue:</label>
                            <p className="text-gray-900">{discipleshipUpdate.venue || 'Not specified'}</p>
                        </div>
                        {discipleshipUpdate.concerns && (
                            <div className="md:col-span-2">
                                <label className="font-medium text-gray-700">Concerns:</label>
                                <p className="text-gray-900">{discipleshipUpdate.concerns}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Discipleship Classes */}
                {discipleshipUpdate.discipleship_class && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-purple-600">Discipleship Classes Completed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <span className={`mr-2 ${discipleshipUpdate.discipleship_class.church_community ? 'text-green-600' : 'text-gray-400'}`}>
                                    {discipleshipUpdate.discipleship_class.church_community ? '✓' : '○'}
                                </span>
                                <span>Church Community</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${discipleshipUpdate.discipleship_class.purple_book ? 'text-green-600' : 'text-gray-400'}`}>
                                    {discipleshipUpdate.discipleship_class.purple_book ? '✓' : '○'}
                                </span>
                                <span>Purple Book</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${discipleshipUpdate.discipleship_class.making_disciples ? 'text-green-600' : 'text-gray-400'}`}>
                                    {discipleshipUpdate.discipleship_class.making_disciples ? '✓' : '○'}
                                </span>
                                <span>Making Disciples</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${discipleshipUpdate.discipleship_class.empowering_leaders ? 'text-green-600' : 'text-gray-400'}`}>
                                    {discipleshipUpdate.discipleship_class.empowering_leaders ? '✓' : '○'}
                                </span>
                                <span>Empowering Leaders</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${discipleshipUpdate.discipleship_class.leadership_113 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {discipleshipUpdate.discipleship_class.leadership_113 ? '✓' : '○'}
                                </span>
                                <span>Leadership 113</span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Victory Group Members */}
                {renderMemberTable(discipleshipUpdate.members, 'Victory Group Members', '#16a34a')}

                {/* Victory Group Interns */}
                {renderMemberTable(discipleshipUpdate.interns, 'Victory Group Interns', '#ea580c')}

                {/* Summary */}
                <Card className="p-6 bg-gray-50">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {discipleshipUpdate.victory_groups_leading}
                            </div>
                            <div className="text-sm text-gray-600">Victory Groups</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {discipleshipUpdate.members.length}
                            </div>
                            <div className="text-sm text-gray-600">Members</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-600">
                                {discipleshipUpdate.interns.length}
                            </div>
                            <div className="text-sm text-gray-600">Interns</div>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}