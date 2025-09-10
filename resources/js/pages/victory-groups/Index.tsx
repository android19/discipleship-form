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

interface VictoryGroup {
    id: number;
    name: string;
    schedule?: string;
    venue?: string;
    status: string;
    leader?: {
        id: number;
        full_name: string;
    };
    members_count: number;
    created_at: string;
    updated_at: string;
}

interface Leader {
    id: number;
    full_name: string;
}

interface Props {
    victoryGroups: {
        data: VictoryGroup[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    leaders: Leader[];
    filters: {
        search: string;
        status: string;
        leader_id: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Victory Groups',
        href: '/victory-groups',
    },
];

export default function Index({ victoryGroups, leaders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [leaderId, setLeaderId] = useState(filters.leader_id || '');

    // Debounced search function
    const debouncedSearch = useDebouncedCallback(
        (searchTerm: string) => {
            router.get('/victory-groups', { 
                search: searchTerm,
                status,
                leader_id: leaderId
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
            params.leader_id = leaderId;
        } else if (filterType === 'leader_id') {
            setLeaderId(value);
            params.leader_id = value;
            params.status = status;
        }

        router.get('/victory-groups', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this victory group?')) {
            router.delete(`/victory-groups/${id}`, {
                onSuccess: () => {
                    // Refresh will happen automatically
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Victory Groups" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <Card className="bg-orange-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        VICTORY GROUP MANAGEMENT
                    </h1>
                    <p className="text-center mt-2">
                        Manage Victory Groups and Assignments
                    </p>
                </Card>

                {/* Controls */}
                <Card className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                        <div className="flex flex-col gap-4 md:flex-row md:flex-1">
                            <Input
                                placeholder="Search victory groups..."
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
                            <Select value={leaderId} onValueChange={(value) => handleFilterChange('leader_id', value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by Leader" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Leaders</SelectItem>
                                    {leaders.map((leader) => (
                                        <SelectItem key={leader.id} value={leader.id.toString()}>
                                            {leader.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => router.visit('/victory-groups/create')}
                        >
                            Add New Victory Group
                        </Button>
                    </div>
                </Card>

                {/* Victory Groups List */}
                <Card className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-orange-100">
                                    <th className="border border-gray-300 p-3 text-left">Name</th>
                                    <th className="border border-gray-300 p-3 text-left">Leader</th>
                                    <th className="border border-gray-300 p-3 text-left">Schedule</th>
                                    <th className="border border-gray-300 p-3 text-left">Venue</th>
                                    <th className="border border-gray-300 p-3 text-center">Members</th>
                                    <th className="border border-gray-300 p-3 text-center">Status</th>
                                    <th className="border border-gray-300 p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {victoryGroups.data.map((group) => (
                                    <tr key={group.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-3">
                                            <div className="font-medium">{group.name}</div>
                                        </td>
                                        <td className="border border-gray-300 p-3">
                                            {group.leader ? (
                                                <span className="text-purple-600 font-medium">
                                                    {group.leader.full_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No leader assigned</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-3">
                                            {group.schedule || <span className="text-gray-400">Not set</span>}
                                        </td>
                                        <td className="border border-gray-300 p-3">
                                            {group.venue || <span className="text-gray-400">Not set</span>}
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                {group.members_count} members
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${group.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {group.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/victory-groups/${group.id}`)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.visit(`/victory-groups/${group.id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(group.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {victoryGroups.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No victory groups found. <Button variant="link" onClick={() => router.visit('/victory-groups/create')}>Add the first victory group</Button>
                            </div>
                        )}
                    </div>

                    {/* Pagination info */}
                    {victoryGroups.total > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Showing {victoryGroups.data.length} of {victoryGroups.total} victory groups
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}