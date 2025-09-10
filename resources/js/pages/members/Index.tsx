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
    };
    created_at: string;
    updated_at: string;
}

interface VictoryGroup {
    id: number;
    name: string;
}

interface Props {
    members: {
        data: Member[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    victoryGroups: VictoryGroup[];
    filters: {
        search: string;
        status: string;
        victory_group_id: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/members',
    },
];

export default function Index({ members, victoryGroups, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [victoryGroupId, setVictoryGroupId] = useState(filters.victory_group_id || 'all');

    // Debounced search function
    const debouncedSearch = useDebouncedCallback(
        (searchTerm: string) => {
            router.get('/members', { 
                search: searchTerm,
                status,
                victory_group_id: victoryGroupId
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
            setStatus(value === '' ? 'all' : value);
            params.status = value;
            params.victory_group_id = victoryGroupId === 'all' ? '' : victoryGroupId;
        } else if (filterType === 'victory_group_id') {
            setVictoryGroupId(value === '' ? 'all' : value);
            params.victory_group_id = value;
            params.status = status === 'all' ? '' : status;
        }

        router.get('/members', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this member?')) {
            router.delete(`/members/${id}`, {
                onSuccess: () => {
                    // Refresh will happen automatically
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <Card className="bg-green-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        MEMBER MANAGEMENT
                    </h1>
                    <p className="text-center mt-2">
                        Manage Victory Group Members
                    </p>
                </Card>

                {/* Controls */}
                <Card className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                        <div className="flex flex-col gap-4 md:flex-row md:flex-1">
                            <Input
                                placeholder="Search members..."
                                value={search}
                                onChange={handleSearchChange}
                                className="max-w-md"
                            />
                            <Select value={status} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={victoryGroupId} onValueChange={(value) => handleFilterChange('victory_group_id', value === 'all' ? '' : value)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by Victory Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Victory Groups</SelectItem>
                                    {victoryGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => router.visit('/members/create')}
                        >
                            Add New Member
                        </Button>
                    </div>
                </Card>

                {/* Members List */}
                <Card className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-green-100">
                                    <th className="border border-gray-300 p-3 text-left">Name</th>
                                    <th className="border border-gray-300 p-3 text-left">Age</th>
                                    <th className="border border-gray-300 p-3 text-left">Sex</th>
                                    <th className="border border-gray-300 p-3 text-left">Contact</th>
                                    <th className="border border-gray-300 p-3 text-left">Lifestage</th>
                                    <th className="border border-gray-300 p-3 text-left">Victory Group</th>
                                    <th className="border border-gray-300 p-3 text-left">Date Launched</th>
                                    <th className="border border-gray-300 p-3 text-center">Status</th>
                                    <th className="border border-gray-300 p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.data.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-3">
                                            <div className="font-medium">{member.full_name}</div>
                                        </td>
                                        <td className="border border-gray-300 p-3">{member.age}</td>
                                        <td className="border border-gray-300 p-3">{member.sex}</td>
                                        <td className="border border-gray-300 p-3">{member.contact_number}</td>
                                        <td className="border border-gray-300 p-3">{member.lifestage}</td>
                                        <td className="border border-gray-300 p-3">
                                            {member.victory_group ? (
                                                <span className="text-blue-600 font-medium">
                                                    {member.victory_group.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No group assigned</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-3">
                                            {new Date(member.date_launched).toLocaleDateString()}
                                        </td>
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
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(member.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {members.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No members found. <Button variant="link" onClick={() => router.visit('/members/create')}>Add the first member</Button>
                            </div>
                        )}
                    </div>

                    {/* Pagination info */}
                    {members.total > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Showing {members.data.length} of {members.total} members
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}