import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Leader {
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
    coach?: {
        id: number;
        full_name: string;
    };
    victory_groups: Array<{
        id: number;
        name: string;
        schedule?: string;
        venue?: string;
        status: string;
        members_count: number;
    }>;
    created_at: string;
    updated_at: string;
}

interface Props {
    leader: Leader;
}

export default function Show({ leader }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Leaders',
            href: '/leaders',
        },
        {
            title: leader.full_name,
            href: `/leaders/${leader.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this leader?')) {
            router.delete(`/leaders/${leader.id}`, {
                onSuccess: () => {
                    router.visit('/leaders');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${leader.full_name} - Leader Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                
                {/* Header */}
                <Card className="bg-purple-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        LEADER DETAILS
                    </h1>
                    <p className="text-center mt-2">
                        {leader.full_name}
                    </p>
                </Card>

                {/* Leader Information */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-purple-600">
                            Personal Information
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.visit(`/leaders/${leader.id}/edit`)}
                            >
                                Edit Leader
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete Leader
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Full Name</div>
                            <div className="mt-1 text-lg">{leader.full_name}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Age</div>
                            <div className="mt-1 text-lg">{leader.age}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Sex</div>
                            <div className="mt-1 text-lg">{leader.sex}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Contact Number</div>
                            <div className="mt-1 text-lg">{leader.contact_number}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Lifestage</div>
                            <div className="mt-1 text-lg">{leader.lifestage}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Date Launched</div>
                            <div className="mt-1 text-lg">
                                {new Date(leader.date_launched).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Status</div>
                            <div className="mt-1">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                    leader.status === 'Active' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {leader.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <div className="font-medium text-gray-600">Address</div>
                            <div className="mt-1 text-lg">{leader.address}</div>
                        </div>
                    </div>
                </Card>

                {/* Coach Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-purple-600">
                        Coaching Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Coach</div>
                            <div className="mt-1 text-lg">
                                {leader.coach ? (
                                    <span className="text-blue-600 font-medium">
                                        {leader.coach.full_name}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">No coach assigned</span>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Victory Groups Led</div>
                            <div className="mt-1 text-lg">
                                <span className="inline-flex px-2 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                    {leader.victory_groups.length} groups
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Victory Groups */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-purple-600">
                        Victory Groups
                    </h2>
                    
                    {leader.victory_groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {leader.victory_groups.map((group) => (
                                <Card key={group.id} className="p-4 border-l-4 border-blue-500">
                                    <div className="font-medium text-lg mb-2">{group.name}</div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        {group.schedule && (
                                            <div><span className="font-medium">Schedule:</span> {group.schedule}</div>
                                        )}
                                        {group.venue && (
                                            <div><span className="font-medium">Venue:</span> {group.venue}</div>
                                        )}
                                        <div>
                                            <span className="font-medium">Members:</span> {group.members_count}
                                        </div>
                                        <div>
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                                group.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {group.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.visit(`/victory-groups/${group.id}`)}
                                        >
                                            View Group
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No victory groups assigned yet.
                        </div>
                    )}
                </Card>

                {/* Activity Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-purple-600">
                        Activity Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Created</div>
                            <div className="mt-1 text-lg">
                                {new Date(leader.created_at).toLocaleDateString('en-US', {
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
                                {new Date(leader.updated_at).toLocaleDateString('en-US', {
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
                            onClick={() => router.visit('/leaders')}
                        >
                            Back to Leaders List
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}