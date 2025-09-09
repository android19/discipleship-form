import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discipleship Updates',
        href: '/discipleship',
    },
];

interface DiscipleshipUpdate {
    id: number;
    leader_name: string;
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
    victory_groups_leading: number;
    victory_group_active: boolean;
    created_at: string;
    updated_at: string;
    submitted_at: string | null;
    victory_group_members_count: number;
    victory_group_members: any[];
}

interface Props {
    discipleshipUpdates: {
        data: DiscipleshipUpdate[];
        links: any[];
        meta: any;
    };
}

export default function Index({ discipleshipUpdates }: Props) {
    const getStatusBadge = (status: string) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            submitted: 'bg-blue-100 text-blue-800',
            under_review: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };

        // Special styling for approved status
        if (status === 'approved') {
            return (
                <Badge style={{ backgroundColor: '#076833', color: 'white' }}>
                    APPROVED
                </Badge>
            );
        }

        return (
            <Badge className={colors[status as keyof typeof colors]}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Discipleship Updates" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Discipleship Updates</h1>
                        <p className="text-gray-600">
                            Manage your Victory Group discipleship journey
                        </p>
                    </div>
                    <Link href="/discipleship/create">
                        <Button>Create New Update</Button>
                    </Link>
                </div>

                {/* Updates List */}
                {discipleshipUpdates.data.length > 0 ? (
                    <div className="space-y-4">
                        {discipleshipUpdates.data.map((update) => (
                            <Card key={update.id} className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {update.leader_name}'s Data
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>Victory Groups: {update.victory_groups_leading}</span>
                                            <span>•</span>
                                            <span>Members: {update.victory_group_members_count || 0}</span>
                                            <span>•</span>
                                            <span style={{ color: update.victory_group_active ? '#076833' : '#dc2626' }}>
                                                Status: {update.victory_group_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(update.status)}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                    <span>Created: {formatDate(update.created_at)}</span>
                                    {update.submitted_at && (
                                        <span>Submitted: {formatDate(update.submitted_at)}</span>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Link href={`/discipleship/${update.id}`}>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                    {update.status === 'draft' && (
                                        <Link href={`/discipleship/${update.id}/edit`}>
                                            <Button size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {discipleshipUpdates.links && discipleshipUpdates.links.length > 3 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {discipleshipUpdates.links.map((link, index) => (
                                    <div key={index}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded border ${link.active
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                className="px-3 py-2 text-sm rounded border bg-gray-100 text-gray-500 border-gray-300"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No discipleship updates yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Get started by creating your first discipleship update form to track
                                your Victory Group members and progress.
                            </p>
                            <Link href="/discipleship/create">
                                <Button>Create Your First Update</Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}