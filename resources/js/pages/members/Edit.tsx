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

interface DiscipleshipClass {
    id: number;
    class_name: string;
    date_started?: string;
    date_finished?: string;
    is_completed: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

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
    victory_group_id?: number;
    discipleship_classes?: DiscipleshipClass[];
    created_at: string;
    updated_at: string;
}

interface VictoryGroup {
    id: number;
    name: string;
    leader?: {
        id: number;
        full_name: string;
    };
}

interface Props {
    member: Member;
    victoryGroups: VictoryGroup[];
    discipleshipClasses: Record<string, string>;
}

export default function Edit({ member, victoryGroups, discipleshipClasses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Members',
            href: '/members',
        },
        {
            title: member.full_name,
            href: `/members/${member.id}`,
        },
        {
            title: 'Edit',
            href: `/members/${member.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${member.full_name} - Member`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Form action={`/members/${member.id}`} method="patch">
                    {({ errors, hasErrors, processing, wasSuccessful, recentlySuccessful }) => (
                        <div className="space-y-6">
                            {/* Header */}
                            <Card className="bg-green-600 text-white p-6">
                                <h1 className="text-2xl font-bold text-center">
                                    EDIT MEMBER
                                </h1>
                                <p className="text-center mt-2">
                                    Update {member.full_name}'s Information
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
                                            defaultValue={member.first_name}
                                            required 
                                        />
                                        {errors.first_name && <div className="text-red-600 text-sm mt-1">{errors.first_name}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="middle_initial">Middle Initial</Label>
                                        <Input 
                                            id="middle_initial" 
                                            name="middle_initial"
                                            defaultValue={member.middle_initial || ''}
                                            maxLength={1} 
                                        />
                                        {errors.middle_initial && <div className="text-red-600 text-sm mt-1">{errors.middle_initial}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="last_name">Last Name *</Label>
                                        <Input 
                                            id="last_name" 
                                            name="last_name"
                                            defaultValue={member.last_name}
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
                                            defaultValue={member.age}
                                            required 
                                        />
                                        {errors.age && <div className="text-red-600 text-sm mt-1">{errors.age}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="sex">Sex *</Label>
                                        <Select name="sex" defaultValue={member.sex} required>
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
                                            defaultValue={member.contact_number}
                                            required 
                                        />
                                        {errors.contact_number && <div className="text-red-600 text-sm mt-1">{errors.contact_number}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="lifestage">Lifestage *</Label>
                                        <Input 
                                            id="lifestage" 
                                            name="lifestage"
                                            placeholder="e.g., Student, Single, Married, Single Parent"
                                            defaultValue={member.lifestage}
                                            required 
                                        />
                                        {errors.lifestage && <div className="text-red-600 text-sm mt-1">{errors.lifestage}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="date_launched">Date Launched *</Label>
                                        <Input 
                                            id="date_launched" 
                                            name="date_launched" 
                                            type="date"
                                            defaultValue={member.date_launched}
                                            required 
                                        />
                                        {errors.date_launched && <div className="text-red-600 text-sm mt-1">{errors.date_launched}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select name="status" defaultValue={member.status} required>
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
                                        defaultValue={member.address}
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
                                    <Select name="victory_group_id" defaultValue={member.victory_group_id?.toString() || 'none'}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Victory Group (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Victory Group</SelectItem>
                                            {victoryGroups && victoryGroups.length > 0 ? victoryGroups.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                    {group.name} {group.leader && `(Leader: ${group.leader.full_name})`}
                                                </SelectItem>
                                            )) : (
                                                <SelectItem value="unavailable" disabled>No victory groups available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.victory_group_id && <div className="text-red-600 text-sm mt-1">{errors.victory_group_id}</div>}
                                    <p className="text-sm text-gray-600 mt-1">
                                        Victory Group assignment is optional and can be changed anytime.
                                    </p>
                                </div>
                            </Card>

                            {/* Discipleship Classes */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-green-600">
                                    Discipleship Classes Progress
                                </h2>
                                
                                {member.discipleship_classes && member.discipleship_classes.length > 0 ? (
                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">Current Classes (Edit)</h3>
                                        {member.discipleship_classes.map((classProgress) => (
                                            <div key={classProgress.id} className="border rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-900">
                                                        {discipleshipClasses[classProgress.class_name] || classProgress.class_name}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                                            classProgress.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : classProgress.status === 'in_progress'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {classProgress.status === 'completed' 
                                                                ? 'Completed'
                                                                : classProgress.status === 'in_progress'
                                                                ? 'In Progress'
                                                                : 'Not Started'}
                                                        </span>
                                                        <Checkbox 
                                                            name={`existing_classes[${classProgress.id}][delete]`}
                                                            value="1"
                                                            id={`delete_class_${classProgress.id}`}
                                                        />
                                                        <Label htmlFor={`delete_class_${classProgress.id}`} className="text-sm text-red-600">
                                                            Delete
                                                        </Label>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor={`existing_class_${classProgress.id}_start`} className="text-sm">
                                                            Date Started
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            id={`existing_class_${classProgress.id}_start`}
                                                            name={`existing_classes[${classProgress.id}][date_started]`}
                                                            defaultValue={classProgress.date_started ? new Date(classProgress.date_started).toISOString().split('T')[0] : ''}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <Label htmlFor={`existing_class_${classProgress.id}_finish`} className="text-sm">
                                                            Date Finished (optional)
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            id={`existing_class_${classProgress.id}_finish`}
                                                            name={`existing_classes[${classProgress.id}][date_finished]`}
                                                            defaultValue={classProgress.date_finished ? new Date(classProgress.date_finished).toISOString().split('T')[0] : ''}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox 
                                                            name={`existing_classes[${classProgress.id}][is_completed]`}
                                                            value="1"
                                                            id={`existing_completed_${classProgress.id}`}
                                                            defaultChecked={classProgress.is_completed}
                                                        />
                                                        <Label htmlFor={`existing_completed_${classProgress.id}`} className="text-sm">
                                                            Mark as completed
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 mb-6">
                                        <div className="text-gray-400 text-lg">📚</div>
                                        <p className="text-gray-600 mt-2">No discipleship classes recorded yet.</p>
                                    </div>
                                )}
                                
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Classes</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Select additional discipleship classes to add for this member.
                                    </p>
                                    
                                    <div className="space-y-4">
                                        {Object.entries(discipleshipClasses).map(([classKey, className]) => {
                                            const hasExistingClass = member.discipleship_classes?.some(
                                                cls => cls.class_name === classKey
                                            );
                                            
                                            if (hasExistingClass) return null;
                                            
                                            return (
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
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>💡 <strong>Tips for editing classes:</strong></p>
                                        <ul className="list-disc list-inside space-y-1 mt-2">
                                            <li>Edit existing class dates in the "Current Classes (Edit)" section above</li>
                                            <li>Check "Mark as completed" to manually complete a class</li>
                                            <li>Check "Delete" to remove a class from the member</li>
                                            <li>If a finish date is provided, the class will be automatically marked as completed</li>
                                            <li>Classes with only start dates will be marked as "in progress"</li>
                                        </ul>
                                    </div>
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
                                        {processing ? 'Updating...' : 'Update Member'}
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
                                        Member updated successfully!
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