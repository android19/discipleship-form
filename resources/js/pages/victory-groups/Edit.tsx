import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface VictoryGroup {
    id: number;
    name: string;
    schedule?: string;
    venue?: string;
    status: string;
    leader_id?: number;
    created_at: string;
    updated_at: string;
}

interface Leader {
    id: number;
    full_name: string;
    coach?: {
        id: number;
        full_name: string;
    };
}

interface Props {
    victoryGroup: VictoryGroup;
    leaders: Leader[];
}

export default function Edit({ victoryGroup, leaders }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Victory Groups',
            href: '/victory-groups',
        },
        {
            title: victoryGroup.name,
            href: `/victory-groups/${victoryGroup.id}`,
        },
        {
            title: 'Edit',
            href: `/victory-groups/${victoryGroup.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${victoryGroup.name} - Victory Group`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Form action={`/victory-groups/${victoryGroup.id}`} method="patch">
                    {({ errors, hasErrors, processing, wasSuccessful, recentlySuccessful }) => (
                        <div className="space-y-6">
                            {/* Header */}
                            <Card className="bg-orange-600 text-white p-6">
                                <h1 className="text-2xl font-bold text-center">
                                    EDIT VICTORY GROUP
                                </h1>
                                <p className="text-center mt-2">
                                    Update {victoryGroup.name}'s Information
                                </p>
                            </Card>

                            {/* Victory Group Information */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-orange-600">
                                    Group Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Group Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={victoryGroup.name}
                                            placeholder="e.g., Makati Victory Group, Youth VG"
                                            required
                                        />
                                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select name="status" defaultValue={victoryGroup.status} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <div className="text-red-600 text-sm mt-1">{errors.status}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="schedule">Schedule</Label>
                                        <Input
                                            id="schedule"
                                            name="schedule"
                                            defaultValue={victoryGroup.schedule || ''}
                                            placeholder="e.g., Saturdays 7:00 PM, Every Sunday 3:00 PM"
                                        />
                                        {errors.schedule && <div className="text-red-600 text-sm mt-1">{errors.schedule}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input
                                            id="venue"
                                            name="venue"
                                            defaultValue={victoryGroup.venue || ''}
                                            placeholder="e.g., Makati City Hall, Online via Zoom"
                                        />
                                        {errors.venue && <div className="text-red-600 text-sm mt-1">{errors.venue}</div>}
                                    </div>
                                </div>
                            </Card>

                            {/* Leader Assignment */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-orange-600">
                                    Leader Assignment
                                </h2>
                                <div>
                                    <Label htmlFor="leader_id">Victory Group Leader</Label>
                                    <Select name="leader_id" defaultValue={victoryGroup.leader_id?.toString() || ''}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Leader (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">No Leader</SelectItem>
                                            {leaders && leaders.length > 0 ? leaders.map((leader) => (
                                                <SelectItem key={leader.id} value={leader.id.toString()}>
                                                    {leader.full_name} {leader.coach && `(Coach: ${leader.coach.full_name})`}
                                                </SelectItem>
                                            )) : (
                                                <SelectItem value="" disabled>No leaders available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.leader_id && <div className="text-red-600 text-sm mt-1">{errors.leader_id}</div>}
                                    <p className="text-sm text-gray-600 mt-1">
                                        Leader assignment is optional and can be changed anytime.
                                    </p>
                                </div>
                            </Card>

                            {/* Submit Buttons */}
                            <Card className="p-6">
                                <div className="flex gap-4 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Victory Group'}
                                    </Button>
                                </div>
                            </Card>

                            {/* Display errors */}
                            {hasErrors && (
                                <Card className="p-6 border-red-300 bg-red-50">
                                    <h3 className="text-red-600 font-medium mb-2">Please correct the following errors:</h3>
                                    <ul className="text-red-600 space-y-1">
                                        {Object.entries(errors).map(([field, message]) => (
                                            <li key={field}>• {message}</li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {wasSuccessful && (
                                <Card className="p-6 border-green-300 bg-green-50">
                                    <p className="text-green-600 font-medium">
                                        Victory Group updated successfully!
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}