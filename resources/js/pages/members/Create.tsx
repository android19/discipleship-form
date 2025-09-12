import { useState } from 'react';
import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface VictoryGroup {
    id: number;
    name: string;
    leader?: {
        id: number;
        full_name: string;
    };
}

interface Props {
    victoryGroups: VictoryGroup[];
    discipleshipClasses: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/members',
    },
    {
        title: 'Create Member',
        href: '/members/create',
    },
];

interface Ministry {
    id: string;
    name: string;
    date_started: string;
    status: string;
}

const MINISTRY_OPTIONS = [
    'Admin',
    'Comms',
    'Coordinator',
    'Kids',
    'Music',
    'Tech',
    'Spirit Empowerment',
    'Ushering',
];

export default function Create({ victoryGroups, discipleshipClasses }: Props) {
    const [ministries, setMinistries] = useState<Ministry[]>([]);

    const addMinistry = () => {
        const newMinistry: Ministry = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            date_started: '',
            status: 'active',
        };
        setMinistries([...ministries, newMinistry]);
    };

    const removeMinistry = (id: string) => {
        setMinistries(ministries.filter(ministry => ministry.id !== id));
    };

    const updateMinistry = (id: string, field: keyof Ministry, value: string) => {
        setMinistries(ministries.map(ministry =>
            ministry.id === id ? { ...ministry, [field]: value } : ministry
        ));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Member" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Form action="/members" method="post">
                    {({ errors, hasErrors, processing, wasSuccessful, recentlySuccessful }) => (
                        <div className="space-y-6">
                            {/* Hidden inputs for ministries */}
                            {ministries.map((ministry, index) => (
                                <div key={ministry.id}>
                                    <input type="hidden" name={`ministries[${index}][name]`} value={ministry.name} />
                                    <input type="hidden" name={`ministries[${index}][date_started]`} value={ministry.date_started} />
                                    <input type="hidden" name={`ministries[${index}][status]`} value={ministry.status} />
                                </div>
                            ))}
                            {/* Header */}
                            <Card className="bg-green-600 text-white p-6">
                                <h1 className="text-2xl font-bold text-center">
                                    CREATE NEW MEMBER
                                </h1>
                                <p className="text-center mt-2">
                                    Add a new Victory Group Member
                                </p>
                            </Card>

                            {/* Member Information */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="first_name">First Name *</Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            required
                                        />
                                        {errors.first_name && <div className="text-red-600 text-sm mt-1">{errors.first_name}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="middle_initial">Middle Initial</Label>
                                        <Input
                                            id="middle_initial"
                                            name="middle_initial"
                                            maxLength={1}
                                        />
                                        {errors.middle_initial && <div className="text-red-600 text-sm mt-1">{errors.middle_initial}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="last_name">Last Name *</Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            required
                                        />
                                        {errors.last_name && <div className="text-red-600 text-sm mt-1">{errors.last_name}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="age">Age *</Label>
                                        <Input
                                            id="age"
                                            name="age"
                                            type="number"
                                            min="12"
                                            max="120"
                                            required
                                        />
                                        {errors.age && <div className="text-red-600 text-sm mt-1">{errors.age}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="sex">Sex *</Label>
                                        <Select name="sex" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select sex" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.sex && <div className="text-red-600 text-sm mt-1">{errors.sex}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="contact_number">Contact Number *</Label>
                                        <Input
                                            id="contact_number"
                                            name="contact_number"
                                            required
                                        />
                                        {errors.contact_number && <div className="text-red-600 text-sm mt-1">{errors.contact_number}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="lifestage">Lifestage *</Label>
                                        <Select name="lifestage" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select lifestage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Student">Student</SelectItem>
                                                <SelectItem value="Single">Single</SelectItem>
                                                <SelectItem value="Married">Married</SelectItem>
                                                <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.lifestage && <div className="text-red-600 text-sm mt-1">{errors.lifestage}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="date_launched">Date Baptized *</Label>
                                        <Input
                                            id="date_launched"
                                            name="date_launched"
                                            type="date"
                                            required
                                        />
                                        {errors.date_launched && <div className="text-red-600 text-sm mt-1">{errors.date_launched}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select name="status" defaultValue="Active" required>
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
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        rows={3}
                                        required
                                    />
                                    {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                                </div>
                            </Card>

                            {/* Victory Group Assignment */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">
                                    Victory Group Assignment
                                </h2>
                                <div>
                                    <Label htmlFor="victory_group_id">Victory Group</Label>
                                    <Select name="victory_group_id">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Victory Group (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {victoryGroups && victoryGroups.length > 0 ? victoryGroups.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    {group.name} {group.leader && `(Leader: ${group.leader.full_name})`}
                                                </SelectItem>
                                            )) : (
                                                <SelectItem value="" disabled>No victory groups available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.victory_group_id && <div className="text-red-600 text-sm mt-1">{errors.victory_group_id}</div>}
                                    <p className="text-sm text-gray-600 mt-1">
                                        Victory Group assignment is optional and can be changed later.
                                    </p>
                                </div>
                            </Card>

                            {/* Discipleship Classes */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">
                                    Discipleship Classes Progress
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Select completed or in-progress discipleship classes for this member.
                                    </p>

                                    {Object.entries(discipleshipClasses).map(([classKey, className]) => (
                                        <div key={classKey} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    name={`discipleship_classes[${classKey}][selected]`}
                                                    value="1"
                                                    id={`class_${classKey}`}
                                                />
                                                <Label
                                                    htmlFor={`class_${classKey}`}
                                                    className="font-medium text-gray-900"
                                                >
                                                    {className}
                                                </Label>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                                                <div>
                                                    <Label htmlFor={`class_${classKey}_start`} className="text-sm">
                                                        Date Started
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        id={`class_${classKey}_start`}
                                                        name={`discipleship_classes[${classKey}][date_started]`}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`class_${classKey}_finish`} className="text-sm">
                                                        Date Finished (optional)
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        id={`class_${classKey}_finish`}
                                                        name={`discipleship_classes[${classKey}][date_finished]`}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-sm text-gray-600">
                                    <p>💡 <strong>Tip:</strong> If a finish date is provided, the class will be marked as completed.</p>
                                    <p>💡 Classes with only start dates will be marked as "in progress".</p>
                                </div>
                            </Card>

                            {/* Ministry Involvement */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-green-600">
                                        Ministry Involvement
                                    </h2>
                                    <Button type="button" onClick={addMinistry}>
                                        Add Ministry
                                    </Button>
                                </div>

                                {ministries.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">
                                            Add any ministries or leadership roles this member is involved in.
                                        </p>
                                        {ministries.map((ministry, index) => (
                                            <div key={ministry.id} className="border rounded-lg p-4 bg-gray-50">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <Label htmlFor={`ministry_${ministry.id}_name`} className="text-sm font-medium">
                                                            Ministry Name *
                                                        </Label>
                                                        <Select
                                                            value={ministry.name}
                                                            onValueChange={(value) => updateMinistry(ministry.id, 'name', value)}
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select ministry" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {MINISTRY_OPTIONS.map((option) => (
                                                                    <SelectItem key={option} value={option}>
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors[`ministries.${index}.name`] && (
                                                            <div className="text-red-600 text-sm mt-1">
                                                                {errors[`ministries.${index}.name`]}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label htmlFor={`ministry_${ministry.id}_date_started`} className="text-sm font-medium">
                                                            Date Started *
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            id={`ministry_${ministry.id}_date_started`}
                                                            value={ministry.date_started}
                                                            onChange={(e) => updateMinistry(ministry.id, 'date_started', e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        {errors[`ministries.${index}.date_started`] && (
                                                            <div className="text-red-600 text-sm mt-1">
                                                                {errors[`ministries.${index}.date_started`]}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label htmlFor={`ministry_${ministry.id}_status`} className="text-sm font-medium">
                                                            Status
                                                        </Label>
                                                        <Select
                                                            value={ministry.status}
                                                            onValueChange={(value) => updateMinistry(ministry.id, 'status', value)}
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="active">Active</SelectItem>
                                                                <SelectItem value="rest">Rest</SelectItem>
                                                                <SelectItem value="release">Released</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors[`ministries.${index}.status`] && (
                                                            <div className="text-red-600 text-sm mt-1">
                                                                {errors[`ministries.${index}.status`]}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end mt-3">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeMinistry(ministry.id)}
                                                    >
                                                        Remove Ministry
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-4 text-sm text-gray-600">
                                            <p>💡 <strong>Tip:</strong> Only ministries with both name and date started will be saved.</p>
                                            <p>💡 You can add more ministries after creating the member by editing their profile.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No ministries added yet.</p>
                                        <p className="text-sm mt-1">Click "Add Ministry" to add ministry involvement for this member.</p>
                                    </div>
                                )}
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
                                        {processing ? 'Creating...' : 'Create Member'}
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
                                        Member created successfully!
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