import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useDebouncedCallback } from 'use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    victory_groups_count: number;
    created_at: string;
    updated_at: string;
}

interface Coach {
    id: number;
    full_name: string;
}

interface Props {
    leaders: {
        data: Leader[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    coaches: Coach[];
    filters: {
        search: string;
        status: string;
        coach_id: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leaders',
        href: '/leaders',
    },
];

export default function Index({ leaders, coaches, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [coachId, setCoachId] = useState(filters.coach_id || '');

    // Debounced search function
    const debouncedSearch = useDebouncedCallback(
        (searchTerm: string) => {
            router.get('/leaders', { 
                search: searchTerm,
                status,
                coach_id: coachId
            }, {
                preserveState: true,
                replace: true,
            });
        },
        300
    );

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    // Handle filter changes
    const handleFilterChange = (filterType: string, value: string) => {
        const params: any = { search };
        
        if (filterType === 'status') {
            setStatus(value);
            params.status = value;
            params.coach_id = coachId;
        } else if (filterType === 'coach_id') {
            setCoachId(value);
            params.coach_id = value;
            params.status = status;
        }

        router.get('/leaders', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this leader?')) {
            router.delete(`/leaders/${id}`, {
                onSuccess: () => {
                    // Refresh will happen automatically
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leaders" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <Card className="bg-purple-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        LEADER MANAGEMENT
                    </h1>
                    <p className="text-center mt-2">
                        Manage Victory Group Leaders
                    </p>
                </Card>

                {/* Controls */}
                <Card className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                        <div className="flex flex-col gap-4 md:flex-row md:flex-1">
                            <Input
                                placeholder="Search leaders..."
                                value={search}
                                onChange={handleSearchChange}
                                className="max-w-md"
                            />
                            <Select value={status} onValueChange={(value) => handleFilterChange('status', value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={coachId} onValueChange={(value) => handleFilterChange('coach_id', value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by Coach" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Coaches</SelectItem>
                                    {coaches.map((coach) => (
                                        <SelectItem key={coach.id} value={coach.id.toString()}>
                                            {coach.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => router.visit('/leaders/create')}
                        >
                            Add New Leader
                        </Button>
                    </div>
                </Card>

                {/* Leaders List */}
                <Card className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-purple-100">
                                    <th className="border border-gray-300 p-3 text-left">Name</th>
                                    <th className="border border-gray-300 p-3 text-left">Age</th>
                                    <th className="border border-gray-300 p-3 text-left">Sex</th>
                                    <th className="border border-gray-300 p-3 text-left">Contact</th>
                                    <th className="border border-gray-300 p-3 text-left">Lifestage</th>
                                    <th className="border border-gray-300 p-3 text-left">Coach</th>
                                    <th className="border border-gray-300 p-3 text-center">Victory Groups</th>
                                    <th className="border border-gray-300 p-3 text-left">Date Launched</th>
                                    <th className="border border-gray-300 p-3 text-center">Status</th>
                                    <th className="border border-gray-300 p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaders.data.map((leader) => (
                                    <tr key={leader.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-3">
                                            <div className="font-medium">{leader.full_name}</div>
                                        </td>
                                        <td className="border border-gray-300 p-3">{leader.age}</td>
                                        <td className="border border-gray-300 p-3">{leader.sex}</td>
                                        <td className="border border-gray-300 p-3">{leader.contact_number}</td>
                                        <td className="border border-gray-300 p-3">{leader.lifestage}</td>
                                        <td className="border border-gray-300 p-3">
                                            {leader.coach ? (
                                                <span className="text-blue-600 font-medium">
                                                    {leader.coach.full_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No coach assigned</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {leader.victory_groups_count} groups
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 p-3">
                                            {new Date(leader.date_launched).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${leader.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {leader.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/leaders/${leader.id}`)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.visit(`/leaders/${leader.id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(leader.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {leaders.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No leaders found. <Button variant="link" onClick={() => router.visit('/leaders/create')}>Add the first leader</Button>
                            </div>
                        )}
                    </div>

                    {/* Pagination info */}
                    {leaders.total > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Showing {leaders.data.length} of {leaders.total} leaders
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}