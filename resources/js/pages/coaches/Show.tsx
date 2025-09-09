import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Coach {
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
    created_at: string;
    updated_at: string;
}

interface Props {
    coach: Coach;
}

export default function Show({ coach }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Coaches',
            href: '/coaches',
        },
        {
            title: coach.full_name,
            href: `/coaches/${coach.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this coach?')) {
            router.delete(`/coaches/${coach.id}`, {
                onSuccess: () => {
                    router.visit('/coaches');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${coach.full_name} - Coach Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                
                {/* Header */}
                <Card className="bg-blue-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        COACH DETAILS
                    </h1>
                    <p className="text-center mt-2">
                        {coach.full_name}
                    </p>
                </Card>

                {/* Coach Information */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-blue-600">
                            Personal Information
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.visit(`/coaches/${coach.id}/edit`)}
                            >
                                Edit Coach
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete Coach
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Full Name</div>
                            <div className="mt-1 text-lg">{coach.full_name}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Age</div>
                            <div className="mt-1 text-lg">{coach.age}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Sex</div>
                            <div className="mt-1 text-lg">{coach.sex}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Contact Number</div>
                            <div className="mt-1 text-lg">{coach.contact_number}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Lifestage</div>
                            <div className="mt-1 text-lg">{coach.lifestage}</div>
                        </div>
                        
                        <div>
                            <div className="font-medium text-gray-600">Date Launched</div>
                            <div className="mt-1 text-lg">
                                {new Date(coach.date_launched).toLocaleDateString('en-US', {
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
                                    coach.status === 'Active' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {coach.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <div className="font-medium text-gray-600">Address</div>
                            <div className="mt-1 text-lg">{coach.address}</div>
                        </div>
                    </div>
                </Card>

                {/* Activity Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">
                        Activity Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="font-medium text-gray-600">Created</div>
                            <div className="mt-1 text-lg">
                                {new Date(coach.created_at).toLocaleDateString('en-US', {
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
                                {new Date(coach.updated_at).toLocaleDateString('en-US', {
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
                            onClick={() => router.visit('/coaches')}
                        >
                            Back to Coaches List
                        </Button>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}