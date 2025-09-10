import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface VictoryGroup {
    id: number;
    name: string;
    schedule?: string;
    venue?: string;
    status: string;
    leader?: {
        id: number;
        full_name: string;
        coach?: {
            id: number;
            full_name: string;
        };
    };
    members: Array<{
        id: number;
        full_name: string;
        age: number;
        sex: string;
        contact_number: string;
        lifestage: string;
        status: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface Props {
    victoryGroup: VictoryGroup;
}

export default function Show({ victoryGroup }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Victory Groups',
            href: '/victory-groups',
        },
        {
            title: victoryGroup.name,
            href: `/victory-groups/${victoryGroup.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this victory group?')) {
            router.delete(`/victory-groups/${victoryGroup.id}`, {
                onSuccess: () => {
                    router.visit('/victory-groups');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${victoryGroup.name} - Victory Group Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                
                {/* Header */}
                <Card className="bg-orange-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        VICTORY GROUP DETAILS
                    </h1>
                    <p className="text-center mt-2">
                        {victoryGroup.name}
                    </p>
                </Card>

                {/* Victory Group Information */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-orange-600">
                            Group Information
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.visit(`/victory-groups/${victoryGroup.id}/edit`)}
                            >
                                Edit Victory Group
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete Victory Group
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Group Name</div>
                            <div className="mt-1 text-lg">{victoryGroup.name}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Schedule</div>
                            <div className="mt-1 text-lg">
                                {victoryGroup.schedule || <span className="text-gray-400">Not set</span>}
                            </div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Venue</div>
                            <div className="mt-1 text-lg">
                                {victoryGroup.venue || <span className="text-gray-400">Not set</span>}
                            </div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Status</div>
                            <div className="mt-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                    victoryGroup.status === 'Active' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {victoryGroup.status}
                                </span>
                            </div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Total Members</div>
                            <div className="mt-1 text-lg">
                                <span className="inline-flex px-2 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                    {victoryGroup.members.length} members
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Leadership Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-orange-600">
                        Leadership Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Victory Group Leader</div>
                            <div className="mt-1 text-lg">
                                {victoryGroup.leader ? (
                                    <span className="text-purple-600 font-medium">
                                        {victoryGroup.leader.full_name}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">No leader assigned</span>
                                )}
                            </div>
                        </div>
                        
                        {victoryGroup.leader?.coach && (
                            <div>
                                <div className="font-medium text-gray-600">Coach</div>
                                <div className="mt-1 text-lg">
                                    <span className="text-blue-600 font-medium">
                                        {victoryGroup.leader.coach.full_name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Members */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-orange-600">
                            Members ({victoryGroup.members.length})
                        </h2>
                        <Button
                            onClick={() => router.visit('/members/create')}
                            size="sm"
                        >
                            Add New Member
                        </Button>
                    </div>
                    
                    {victoryGroup.members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-orange-100">
                                        <th className="border border-gray-300 p-3 text-left">Name</th>
                                        <th className="border border-gray-300 p-3 text-left">Age</th>
                                        <th className="border border-gray-300 p-3 text-left">Sex</th>
                                        <th className="border border-gray-300 p-3 text-left">Contact</th>
                                        <th className="border border-gray-300 p-3 text-left">Lifestage</th>
                                        <th className="border border-gray-300 p-3 text-center">Status</th>
                                        <th className="border border-gray-300 p-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {victoryGroup.members.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3">
                                                <div className="font-medium">{member.full_name}</div>
                                            </td>
                                            <td className="border border-gray-300 p-3">{member.age}</td>
                                            <td className="border border-gray-300 p-3">{member.sex}</td>
                                            <td className="border border-gray-300 p-3">{member.contact_number}</td>
                                            <td className="border border-gray-300 p-3">{member.lifestage}</td>
                                            <td className="border border-gray-300 p-3 text-center">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${member.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.visit(`/members/${member.id}`)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => router.visit(`/members/${member.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No members assigned to this victory group yet.
                            <div className="mt-2">
                                <Button 
                                    variant="link" 
                                    onClick={() => router.visit('/members/create')}
                                >
                                    Add the first member
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Activity Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-orange-600">
                        Activity Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Created</div>
                            <div className="mt-1 text-lg">
                                {new Date(victoryGroup.created_at).toLocaleDateString('en-US', {
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
                                {new Date(victoryGroup.updated_at).toLocaleDateString('en-US', {
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
                            onClick={() => router.visit('/victory-groups')}
                        >
                            Back to Victory Groups List
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}