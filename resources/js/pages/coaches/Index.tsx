import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useDebouncedCallback } from 'use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import Pagination from '@/components/ui/pagination';

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
    coaches: {
        data: Coach[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Coaches',
        href: '/coaches',
    },
];

export default function Index({ coaches, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounced search function
    const debouncedSearch = useDebouncedCallback(
        (searchTerm: string) => {
            router.get('/coaches', { search: searchTerm }, {
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

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this coach?')) {
            router.delete(`/coaches/${id}`, {
                onSuccess: () => {
                    // Refresh will happen automatically
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Coaches" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <Card className="bg-blue-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        COACH MANAGEMENT
                    </h1>
                    <p className="text-center mt-2">
                        Manage Coaches Details
                    </p>
                </Card>

                {/* Controls */}
                <Card className="p-6">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search coaches..."
                                value={search}
                                onChange={handleSearchChange}
                                className="max-w-md"
                            />
                        </div>
                        <Button
                            onClick={() => router.visit('/coaches/create')}
                        >
                            Add New Coach
                        </Button>
                    </div>
                </Card>

                {/* Coaches List */}
                <Card className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="border border-gray-300 p-3 text-left">Name</th>
                                    <th className="border border-gray-300 p-3 text-left">Age</th>
                                    <th className="border border-gray-300 p-3 text-left">Sex</th>
                                    <th className="border border-gray-300 p-3 text-left">Contact</th>
                                    <th className="border border-gray-300 p-3 text-left">Lifestage</th>
                                    <th className="border border-gray-300 p-3 text-left">Date Launched</th>
                                    <th className="border border-gray-300 p-3 text-center">Status</th>
                                    <th className="border border-gray-300 p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coaches.data.map((coach) => (
                                    <tr key={coach.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-3">
                                            <div className="font-medium">{coach.full_name}</div>
                                        </td>
                                        <td className="border border-gray-300 p-3">{coach.age}</td>
                                        <td className="border border-gray-300 p-3">{coach.sex}</td>
                                        <td className="border border-gray-300 p-3">{coach.contact_number}</td>
                                        <td className="border border-gray-300 p-3">{coach.lifestage}</td>
                                        <td className="border border-gray-300 p-3">
                                            {new Date(coach.date_launched).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${coach.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {coach.status}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 p-3 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.visit(`/coaches/${coach.id}`)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.visit(`/coaches/${coach.id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(coach.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {coaches.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No coaches found. <Button variant="link" onClick={() => router.visit('/coaches/create')}>Add the first coach</Button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {coaches.total > 0 && (
                        <Pagination
                            links={coaches.links}
                            currentPage={coaches.current_page}
                            lastPage={coaches.last_page}
                            total={coaches.total}
                            perPage={coaches.per_page}
                            showing={coaches.data.length}
                        />
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}