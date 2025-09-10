import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem, type PageProps } from '@/types';

interface Submission {
    id: number;
    leader_name: string;
    status: string;
    created_at: string;
    user: { id: number; name: string; email: string } | null;
    form_token: { token: string; leader_name: string } | null;
    reviewed_by: { name: string } | null;
    reviewed_at: string | null;
    members_count: number;
    interns_count: number;
}

interface Props extends PageProps {
    submissions: {
        data: Submission[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    stats: {
        total: number;
        pending_review: number;
        under_review: number;
        approved_today: number;
    };
    filters: {
        status?: string;
        submission_type?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submissions',
        href: '/admin/submissions',
    },
];

const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function Index({ submissions, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [submissionType, setSubmissionType] = useState(filters.submission_type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get('/admin/submissions', {
            search: search || undefined,
            status: status || undefined,
            submission_type: submissionType || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setSubmissionType('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/submissions');
    };

    const getSubmissionTypeLabel = (submission: Submission) => {
        return submission.form_token ? 'Token' : 'Authenticated';
    };

    const getSubmissionTypeBadge = (submission: Submission) => {
        return submission.form_token
            ? <Badge className="bg-orange-100 text-orange-800">Token</Badge>
            : <Badge className="bg-purple-100 text-purple-800">Auth</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Review Submissions" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <Card className="bg-red-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        REVIEW SUBMISSIONS
                    </h1>
                    <p className="text-center mt-2">
                        Manage and review all discipleship submissions
                    </p>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                        <p className="text-sm text-gray-600">Total Submissions</p>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending_review}</div>
                        <p className="text-sm text-gray-600">Pending Review</p>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-orange-600">{stats.under_review}</div>
                        <p className="text-sm text-gray-600">Under Review</p>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.approved_today}</div>
                        <p className="text-sm text-gray-600">Approved Today</p>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Filter Submissions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <Label>Search Leader</Label>
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Leader name..."
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Type</Label>
                            <Select value={submissionType} onValueChange={setSubmissionType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="token">Token Submissions</SelectItem>
                                    <SelectItem value="authenticated">Authenticated Users</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Date From</Label>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Date To</Label>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleFilter}>Apply Filters</Button>
                        <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                </Card>

                {/* Submissions Table */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Submissions ({submissions.total})
                        </h2>
                    </div>

                    {submissions.data.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No submissions found matching your criteria.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-semibold">ID</th>
                                            <th className="text-left p-3 font-semibold">Leader Name</th>
                                            <th className="text-left p-3 font-semibold">Type</th>
                                            <th className="text-left p-3 font-semibold">Status</th>
                                            <th className="text-left p-3 font-semibold">Members/Interns</th>
                                            <th className="text-left p-3 font-semibold">Submitted</th>
                                            <th className="text-left p-3 font-semibold">Reviewed By</th>
                                            <th className="text-left p-3 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.data.map((submission) => (
                                            <tr key={submission.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">#{submission.id}</td>
                                                <td className="p-3">
                                                    <div>
                                                        <div className="font-medium">{submission.leader_name}</div>
                                                        {submission.user && (
                                                            <div className="text-sm text-gray-500">
                                                                {submission.user.name} ({submission.user.email})
                                                            </div>
                                                        )}
                                                        {submission.form_token && (
                                                            <div className="text-sm text-gray-500">
                                                                Token: {submission.form_token.token}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {getSubmissionTypeBadge(submission)}
                                                </td>
                                                <td className="p-3">
                                                    <Badge className={statusColors[submission.status as keyof typeof statusColors]}>
                                                        {submission.status.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm">
                                                        {submission.members_count} members
                                                        <br />
                                                        {submission.interns_count} interns
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {new Date(submission.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {submission.reviewed_by ? (
                                                        <div>
                                                            {submission.reviewed_by.name}
                                                            <br />
                                                            <span className="text-xs">
                                                                {submission.reviewed_at && new Date(submission.reviewed_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not reviewed</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/submissions/${submission.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                View
                                                            </Button>
                                                        </Link>
                                                        {['submitted', 'under_review'].includes(submission.status) && (
                                                            <Link href={`/admin/submissions/${submission.id}/edit`}>
                                                                <Button size="sm">
                                                                    Edit
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {submissions.last_page > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-600">
                                        Showing {((submissions.current_page - 1) * submissions.per_page) + 1} to {Math.min(submissions.current_page * submissions.per_page, submissions.total)} of {submissions.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {submissions.current_page > 1 && (
                                            <Link href={`/admin/submissions?page=${submissions.current_page - 1}`}>
                                                <Button variant="outline" size="sm">Previous</Button>
                                            </Link>
                                        )}
                                        {submissions.current_page < submissions.last_page && (
                                            <Link href={`/admin/submissions?page=${submissions.current_page + 1}`}>
                                                <Button variant="outline" size="sm">Next</Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}