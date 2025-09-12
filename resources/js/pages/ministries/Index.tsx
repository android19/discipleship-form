import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Paginated } from '@/types';

interface Ministry {
    id: number;
    name: string;
    date_started: string;
    status: string;
    status_label: string;
    status_color: string;
    member: {
        id: number;
        first_name: string;
        last_name: string;
        full_name?: string;
    };
}

interface Props {
    ministries: Paginated<Ministry>;
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ministry Involvement',
        href: '/ministries',
    },
];

export default function Index({ ministries, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ministry Involvement" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <Card className="bg-green-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        MINISTRY INVOLVEMENT
                    </h1>
                    <p className="text-center mt-2">
                        View all member ministry involvements
                    </p>
                </Card>

                {/* Filters */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        Filters
                    </h2>
                    <Form method="get" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    name="search"
                                    placeholder="Search by ministry name or member name..."
                                    defaultValue={filters.search || ''}
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={filters.status || 'all'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="rest">Rest</SelectItem>
                                        <SelectItem value="release">Released</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">Apply Filters</Button>
                            <Button type="button" variant="outline" onClick={() => window.location.href = '/ministries'}>
                                Clear Filters
                            </Button>
                        </div>
                    </Form>
                </Card>

                {/* Ministries List */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        Ministries ({ministries.total})
                    </h2>
                    
                    {ministries.data.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No ministries found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ministries.data.map((ministry) => (
                                <div key={ministry.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {ministry.name}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                Member: {ministry.member.first_name} {ministry.member.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Started: {new Date(ministry.date_started).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={ministry.status_color}>
                                                {ministry.status_label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Pagination would go here if needed */}
                </Card>
            </div>
        </AppLayout>
    );
}