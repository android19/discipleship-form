import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem, type PageProps } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
}

interface FormToken {
    id: number;
    token: string;
    leader_name: string;
    expires_at: string;
    is_active: boolean;
    used_count: number;
    max_uses: number | null;
}

interface VictoryGroupMember {
    id: number;
    name: string;
    one_to_one_facilitator: string;
    one_to_one_date_started: string;
    victory_weekend: boolean;
    purple_book: boolean;
    church_community: boolean;
    making_disciples: boolean;
    empowering_leaders: boolean;
    ministry_involvement: string;
    remarks: string;
    member_type: 'member' | 'intern';
}

interface DiscipleshipClass {
    church_community: boolean;
    purple_book: boolean;
    making_disciples: boolean;
    empowering_leaders: boolean;
    leadership_113: boolean;
}

interface Submission {
    id: number;
    leader_name: string;
    mobile_number: string;
    ministry_involvement: string;
    coach: string;
    services_attended: string;
    victory_groups_leading: number;
    victory_group_active: boolean;
    inactive_reason: string | null;
    last_victory_group_date: string | null;
    victory_group_types: string[];
    intern_invite_status: string;
    victory_group_schedule: string;
    venue: string;
    concerns: string | null;
    status: string;
    created_at: string;
    reviewed_at: string | null;
    review_notes: string | null;
    user: User | null;
    form_token: FormToken | null;
    reviewed_by: User | null;
    assigned_to_user: User | null;
    discipleship_class: DiscipleshipClass | null;
    victory_group_members: VictoryGroupMember[];
    members: VictoryGroupMember[];
    interns: VictoryGroupMember[];
}

interface Props extends PageProps {
    submission: Submission;
    availableUsers: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/submissions',
    },
    {
        title: 'Review Submission',
        href: '#',
    },
];

const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function Show({ submission, availableUsers }: Props) {
    const [reviewNotes, setReviewNotes] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleApprove = () => {
        router.post(`/admin/submissions/${submission.id}/approve`, {
            review_notes: reviewNotes,
        });
    };

    const handleReject = () => {
        if (!reviewNotes.trim()) {
            alert('Please provide review notes for rejection.');
            return;
        }
        router.post(`/admin/submissions/${submission.id}/reject`, {
            review_notes: reviewNotes,
        });
    };

    const handleAssignToUser = () => {
        if (!selectedUserId) {
            alert('Please select a user to assign to.');
            return;
        }
        router.post(`/admin/submissions/${submission.id}/assign`, {
            user_id: selectedUserId,
        });
    };

    const handleMarkUnderReview = () => {
        router.post(`/admin/submissions/${submission.id}/mark-under-review`);
    };

    const getSubmissionTypeInfo = () => {
        if (submission.form_token) {
            return {
                type: 'Token Submission',
                badge: <Badge className="bg-orange-100 text-orange-800">Token</Badge>,
                details: (
                    <div className="text-sm text-gray-600">
                        <p><strong>Token:</strong> {submission.form_token.token}</p>
                        <p><strong>Expires:</strong> {new Date(submission.form_token.expires_at).toLocaleDateString()}</p>
                        <p><strong>Usage:</strong> {submission.form_token.used_count}{submission.form_token.max_uses ? ` / ${submission.form_token.max_uses}` : ' (unlimited)'}</p>
                    </div>
                )
            };
        } else {
            return {
                type: 'Authenticated User',
                badge: <Badge className="bg-purple-100 text-purple-800">Auth</Badge>,
                details: submission.user ? (
                    <div className="text-sm text-gray-600">
                        <p><strong>User:</strong> {submission.user.name}</p>
                        <p><strong>Email:</strong> {submission.user.email}</p>
                    </div>
                ) : null
            };
        }
    };

    const submissionTypeInfo = getSubmissionTypeInfo();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review Submission #${submission.id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <Card className="bg-red-600 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Submission #{submission.id}
                            </h1>
                            <p className="mt-2">Leader: {submission.leader_name}</p>
                        </div>
                        <div className="text-right">
                            <Badge className={`text-white ${statusColors[submission.status as keyof typeof statusColors]?.replace('text-', 'text-white ').replace('bg-', 'bg-opacity-30 bg-')}`}>
                                {submission.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <div className="mt-2">{submissionTypeInfo.badge}</div>
                        </div>
                    </div>
                </Card>

                {/* Action Bar */}
                <Card className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {submission.status === 'submitted' && (
                            <Button onClick={handleMarkUnderReview} variant="outline">
                                Mark Under Review
                            </Button>
                        )}
                        
                        {['submitted', 'under_review'].includes(submission.status) && (
                            <>
                                <Link href={`/admin/submissions/${submission.id}/edit`}>
                                    <Button variant="outline">Edit Submission</Button>
                                </Link>
                                <Button onClick={() => setShowApproveModal(true)} className="bg-green-600 hover:bg-green-700">
                                    Approve
                                </Button>
                                <Button onClick={() => setShowRejectModal(true)} variant="destructive">
                                    Reject
                                </Button>
                            </>
                        )}
                    </div>
                </Card>

                {/* Submission Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Basic Information</h2>
                        <div className="space-y-3">
                            <div><strong>Leader Name:</strong> {submission.leader_name}</div>
                            <div><strong>Mobile Number:</strong> {submission.mobile_number}</div>
                            <div><strong>Ministry Involvement:</strong> {submission.ministry_involvement}</div>
                            <div><strong>Coach:</strong> {submission.coach}</div>
                            <div><strong>Services Attended:</strong> {submission.services_attended}</div>
                            <div><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleString()}</div>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Submission Type</h3>
                            {submissionTypeInfo.details}
                        </div>
                    </Card>

                    {/* Review Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">Review Information</h2>
                        <div className="space-y-3">
                            <div><strong>Status:</strong> 
                                <Badge className={`ml-2 ${statusColors[submission.status as keyof typeof statusColors]}`}>
                                    {submission.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </div>
                            {submission.reviewed_by && (
                                <div><strong>Reviewed By:</strong> {submission.reviewed_by.name}</div>
                            )}
                            {submission.reviewed_at && (
                                <div><strong>Reviewed At:</strong> {new Date(submission.reviewed_at).toLocaleString()}</div>
                            )}
                            {submission.assigned_to_user && (
                                <div><strong>Assigned To:</strong> {submission.assigned_to_user.name} ({submission.assigned_to_user.email})</div>
                            )}
                            {submission.review_notes && (
                                <div>
                                    <strong>Review Notes:</strong>
                                    <p className="mt-1 p-2 bg-gray-100 rounded text-sm">{submission.review_notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Assign to User (only for token submissions) */}
                        {submission.form_token && !submission.user && (
                            <div className="mt-4 border-t pt-4">
                                <h3 className="font-semibold mb-2">Assign to User</h3>
                                <div className="flex gap-2">
                                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select user..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUsers.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleAssignToUser} size="sm">
                                        Assign
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Victory Group Details */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Victory Group Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong>Groups Leading:</strong> {submission.victory_groups_leading}</div>
                        <div><strong>Group Active:</strong> {submission.victory_group_active ? 'Yes' : 'No'}</div>
                        {!submission.victory_group_active && submission.inactive_reason && (
                            <div className="md:col-span-2"><strong>Inactive Reason:</strong> {submission.inactive_reason}</div>
                        )}
                        {submission.last_victory_group_date && (
                            <div><strong>Last Group Date:</strong> {new Date(submission.last_victory_group_date).toLocaleDateString()}</div>
                        )}
                        <div><strong>Group Types:</strong> {submission.victory_group_types.join(', ')}</div>
                        <div><strong>Intern Invite Status:</strong> {submission.intern_invite_status}</div>
                        <div><strong>Schedule:</strong> {submission.victory_group_schedule}</div>
                        <div><strong>Venue:</strong> {submission.venue}</div>
                    </div>
                    {submission.concerns && (
                        <div className="mt-4">
                            <strong>Concerns:</strong>
                            <p className="mt-1 p-2 bg-gray-100 rounded text-sm">{submission.concerns}</p>
                        </div>
                    )}
                </Card>

                {/* Discipleship Classes */}
                {submission.discipleship_class && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-green-600">Discipleship Classes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${submission.discipleship_class.church_community ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Church Community
                            </div>
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${submission.discipleship_class.purple_book ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Purple Book
                            </div>
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${submission.discipleship_class.making_disciples ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Making Disciples
                            </div>
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${submission.discipleship_class.empowering_leaders ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Empowering Leaders
                            </div>
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${submission.discipleship_class.leadership_113 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                Leadership 113
                            </div>
                        </div>
                    </Card>
                )}

                {/* Members and Interns */}
                {(submission.members.length > 0 || submission.interns.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Members */}
                        {submission.members.length > 0 && (
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">
                                    Victory Group Members ({submission.members.length})
                                </h2>
                                <div className="space-y-4">
                                    {submission.members.map((member, index) => (
                                        <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                                            <h3 className="font-semibold">{member.name}</h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div><strong>Facilitator:</strong> {member.one_to_one_facilitator || 'N/A'}</div>
                                                <div><strong>Date Started:</strong> {member.one_to_one_date_started || 'N/A'}</div>
                                                <div><strong>Ministry:</strong> {member.ministry_involvement || 'N/A'}</div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {member.victory_weekend && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Victory Weekend</span>}
                                                    {member.purple_book && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Purple Book</span>}
                                                    {member.church_community && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Church Community</span>}
                                                    {member.making_disciples && <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Making Disciples</span>}
                                                    {member.empowering_leaders && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Empowering Leaders</span>}
                                                </div>
                                                {member.remarks && <div><strong>Remarks:</strong> {member.remarks}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Interns */}
                        {submission.interns.length > 0 && (
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-orange-600">
                                    Victory Group Interns ({submission.interns.length})
                                </h2>
                                <div className="space-y-4">
                                    {submission.interns.map((intern, index) => (
                                        <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                                            <h3 className="font-semibold">{intern.name}</h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div><strong>Facilitator:</strong> {intern.one_to_one_facilitator || 'N/A'}</div>
                                                <div><strong>Date Started:</strong> {intern.one_to_one_date_started || 'N/A'}</div>
                                                <div><strong>Ministry:</strong> {intern.ministry_involvement || 'N/A'}</div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {intern.victory_weekend && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Victory Weekend</span>}
                                                    {intern.purple_book && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Purple Book</span>}
                                                    {intern.church_community && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Church Community</span>}
                                                    {intern.making_disciples && <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Making Disciples</span>}
                                                    {intern.empowering_leaders && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Empowering Leaders</span>}
                                                </div>
                                                {intern.remarks && <div><strong>Remarks:</strong> {intern.remarks}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* Review Actions */}
                {['submitted', 'under_review'].includes(submission.status) && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-purple-600">Review Actions</h2>
                        <div>
                            <Label>Review Notes</Label>
                            <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add your review notes here..."
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </Card>
                )}

                {/* Approve/Reject Modals */}
                {showApproveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Approve Submission</h3>
                            <p className="text-gray-600 mb-4">Are you sure you want to approve this submission?</p>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                                    Approve
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Reject Submission</h3>
                            <p className="text-gray-600 mb-4">Are you sure you want to reject this submission? Review notes are required.</p>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleReject} variant="destructive">
                                    Reject
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}