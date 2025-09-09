import { useState, useEffect } from 'react';
import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Member {
    id?: number;
    temp_id: string;
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
}

interface DiscipleshipClass {
    church_community: boolean;
    purple_book: boolean;
    making_disciples: boolean;
    empowering_leaders: boolean;
    leadership_113: boolean;
}

interface DiscipleshipUpdate {
    id: number;
    leader_name: string;
    mobile_number: string;
    ministry_involvement: string | null;
    coach: string | null;
    services_attended: string | null;
    victory_groups_leading: number;
    victory_group_active: boolean;
    inactive_reason: string | null;
    last_victory_group_date: string | null;
    victory_group_types: string[] | null;
    intern_invite_status: 'yes' | 'none';
    victory_group_schedule: string | null;
    venue: string | null;
    concerns: string | null;
    discipleship_class: DiscipleshipClass | null;
    members: any[];
    interns: any[];
}

interface CoachOption {
    value: string;
    label: string;
}

interface Props {
    discipleshipUpdate: DiscipleshipUpdate;
    coaches: CoachOption[];
}

export default function Edit({ discipleshipUpdate, coaches }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Discipleship Updates',
            href: '/discipleship',
        },
        {
            title: discipleshipUpdate.leader_name,
            href: `/discipleship/${discipleshipUpdate.id}`,
        },
        {
            title: 'Edit',
            href: `/discipleship/${discipleshipUpdate.id}/edit`,
        },
    ];

    // Initialize discipleship classes state
    const [discipleshipClasses, setDiscipleshipClasses] = useState({
        church_community: discipleshipUpdate.discipleship_class?.church_community || false,
        purple_book: discipleshipUpdate.discipleship_class?.purple_book || false,
        making_disciples: discipleshipUpdate.discipleship_class?.making_disciples || false,
        empowering_leaders: discipleshipUpdate.discipleship_class?.empowering_leaders || false,
        leadership_113: discipleshipUpdate.discipleship_class?.leadership_113 || false,
    });

    const updateDiscipleshipClass = (field: keyof typeof discipleshipClasses, value: boolean) => {
        setDiscipleshipClasses(prev => ({ ...prev, [field]: value }));
    };

    // Initialize members and interns with temp_id for tracking
    const [members, setMembers] = useState<Member[]>(
        discipleshipUpdate.members.map(member => ({
            ...member,
            temp_id: member.id?.toString() || Math.random().toString(36).substr(2, 9),
        }))
    );
    
    const [interns, setInterns] = useState<Member[]>(
        discipleshipUpdate.interns.map(intern => ({
            ...intern,
            temp_id: intern.id?.toString() || Math.random().toString(36).substr(2, 9),
        }))
    );

    const addMember = () => {
        const newMember: Member = {
            temp_id: Math.random().toString(36).substr(2, 9),
            name: '',
            one_to_one_facilitator: '',
            one_to_one_date_started: '',
            victory_weekend: false,
            purple_book: false,
            church_community: false,
            making_disciples: false,
            empowering_leaders: false,
            ministry_involvement: '',
            remarks: '',
        };
        setMembers([...members, newMember]);
    };

    const addIntern = () => {
        const newIntern: Member = {
            temp_id: Math.random().toString(36).substr(2, 9),
            name: '',
            one_to_one_facilitator: '',
            one_to_one_date_started: '',
            victory_weekend: false,
            purple_book: false,
            church_community: false,
            making_disciples: false,
            empowering_leaders: false,
            ministry_involvement: '',
            remarks: '',
        };
        setInterns([...interns, newIntern]);
    };

    const removeMember = (tempId: string) => {
        setMembers(members.filter(member => member.temp_id !== tempId));
    };

    const removeIntern = (tempId: string) => {
        setInterns(interns.filter(intern => intern.temp_id !== tempId));
    };

    const updateMember = (tempId: string, field: keyof Member, value: any) => {
        setMembers(members.map(member => 
            member.temp_id === tempId ? { ...member, [field]: value } : member
        ));
    };

    const updateIntern = (tempId: string, field: keyof Member, value: any) => {
        setInterns(interns.map(intern => 
            intern.temp_id === tempId ? { ...intern, [field]: value } : intern
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${discipleshipUpdate.leader_name} - Discipleship Update`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Form action={`/discipleship/${discipleshipUpdate.id}`} method="patch">
                    {({ errors, hasErrors, processing, wasSuccessful, recentlySuccessful }) => (
                        <div className="space-y-6">
                            {/* Header */}
                            <Card className="bg-red-600 text-white p-6">
                                <h1 className="text-2xl font-bold text-center">
                                    EDIT DISCIPLESHIP UPDATE FORM
                                </h1>
                                <p className="text-center mt-2">
                                    Victory Group Leader's Report
                                </p>
                            </Card>

                            {/* Leader Information Section */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-red-600">
                                    Leader Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="leader_name">Name *</Label>
                                        <Input 
                                            id="leader_name" 
                                            name="leader_name" 
                                            defaultValue={discipleshipUpdate.leader_name}
                                            required 
                                            error={errors.leader_name}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="mobile_number">Mobile Number *</Label>
                                        <Input 
                                            id="mobile_number" 
                                            name="mobile_number" 
                                            defaultValue={discipleshipUpdate.mobile_number}
                                            required 
                                            error={errors.mobile_number}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="ministry_involvement">Ministry Involvement</Label>
                                        <Select 
                                            name="ministry_involvement" 
                                            defaultValue={discipleshipUpdate.ministry_involvement || ''}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ministry involvement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="Comms">Comms</SelectItem>
                                                <SelectItem value="Coordinator">Coordinator</SelectItem>
                                                <SelectItem value="Kids">Kids</SelectItem>
                                                <SelectItem value="Music">Music</SelectItem>
                                                <SelectItem value="Tech">Tech</SelectItem>
                                                <SelectItem value="Spirit Empowerment">Spirit Empowerment</SelectItem>
                                                <SelectItem value="Ushering">Ushering</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="coach">Coach</Label>
                                        <Select 
                                            name="coach"
                                            defaultValue={discipleshipUpdate.coach || ''}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a coach" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {coaches.map((coach) => (
                                                    <SelectItem key={coach.value} value={coach.value}>
                                                        {coach.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="services_attended">Service(s) usually attended</Label>
                                        <Select 
                                            name="services_attended"
                                            defaultValue={discipleshipUpdate.services_attended || ''}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select service time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="8AM">8AM</SelectItem>
                                                <SelectItem value="9:30AM">9:30AM</SelectItem>
                                                <SelectItem value="11AM">11AM</SelectItem>
                                                <SelectItem value="1:30PM">1:30PM</SelectItem>
                                                <SelectItem value="3PM">3PM</SelectItem>
                                                <SelectItem value="5PM">5PM</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </Card>

                            {/* Victory Group Details */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                    Victory Group Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="victory_groups_leading">
                                            How many Victory Groups are you currently leading? *
                                        </Label>
                                        <Input 
                                            id="victory_groups_leading" 
                                            name="victory_groups_leading" 
                                            type="number" 
                                            min="0" 
                                            defaultValue={discipleshipUpdate.victory_groups_leading}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <Label>Is your Victory Group active? *</Label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="victory_group_active" 
                                                    value="1" 
                                                    defaultChecked={discipleshipUpdate.victory_group_active}
                                                    className="mr-2" 
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="victory_group_active" 
                                                    value="0" 
                                                    defaultChecked={!discipleshipUpdate.victory_group_active}
                                                    className="mr-2" 
                                                />
                                                No
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="inactive_reason">
                                            If No, please specify reason:
                                        </Label>
                                        <Textarea 
                                            id="inactive_reason" 
                                            name="inactive_reason" 
                                            defaultValue={discipleshipUpdate.inactive_reason || ''}
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="last_victory_group_date">
                                            When was the last time you had your Victory Group?
                                        </Label>
                                        <Input 
                                            id="last_victory_group_date" 
                                            name="last_victory_group_date" 
                                            type="date" 
                                            defaultValue={discipleshipUpdate.last_victory_group_date || ''}
                                        />
                                    </div>
                                    <div>
                                        <Label>Victory Group Type:</Label>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <label className="flex items-center">
                                                <Checkbox 
                                                    name="victory_group_types[]" 
                                                    value="students"
                                                    defaultChecked={discipleshipUpdate.victory_group_types?.includes('students')}
                                                />
                                                <span className="ml-2">Students</span>
                                            </label>
                                            <label className="flex items-center">
                                                <Checkbox 
                                                    name="victory_group_types[]" 
                                                    value="singles"
                                                    defaultChecked={discipleshipUpdate.victory_group_types?.includes('singles')}
                                                />
                                                <span className="ml-2">Singles</span>
                                            </label>
                                            <label className="flex items-center">
                                                <Checkbox 
                                                    name="victory_group_types[]" 
                                                    value="married"
                                                    defaultChecked={discipleshipUpdate.victory_group_types?.includes('married')}
                                                />
                                                <span className="ml-2">Married</span>
                                            </label>
                                            <div className="flex items-center">
                                                <Checkbox 
                                                    name="victory_group_types[]" 
                                                    value="others"
                                                    defaultChecked={discipleshipUpdate.victory_group_types?.includes('others')}
                                                />
                                                <span className="ml-2">Others:</span>
                                                <Input className="ml-2 w-32" name="victory_group_types_other" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Does your intern already have an invite? *</Label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="intern_invite_status" 
                                                    value="yes"
                                                    defaultChecked={discipleshipUpdate.intern_invite_status === 'yes'}
                                                    className="mr-2" 
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center">
                                                <input 
                                                    type="radio" 
                                                    name="intern_invite_status" 
                                                    value="none"
                                                    defaultChecked={discipleshipUpdate.intern_invite_status === 'none'}
                                                    className="mr-2" 
                                                />
                                                None
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="victory_group_schedule">
                                            Victory Group Schedule (Day & Time)
                                        </Label>
                                        <Input 
                                            id="victory_group_schedule" 
                                            name="victory_group_schedule" 
                                            defaultValue={discipleshipUpdate.victory_group_schedule || ''}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input 
                                            id="venue" 
                                            name="venue" 
                                            defaultValue={discipleshipUpdate.venue || ''}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="concerns">
                                            Any concerns encountered regarding your Victory Group?
                                        </Label>
                                        <Textarea 
                                            id="concerns" 
                                            name="concerns" 
                                            defaultValue={discipleshipUpdate.concerns || ''}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Discipleship Classes Checklist */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-purple-600">
                                    Discipleship Classes Checklist
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="flex items-center">
                                        <Checkbox 
                                            name="discipleship_classes[church_community]"
                                            checked={discipleshipClasses.church_community}
                                            onCheckedChange={(checked) => updateDiscipleshipClass('church_community', checked)}
                                        />
                                        <span className="ml-2">Church Community</span>
                                        <input type="hidden" name="discipleship_classes[church_community]" value={discipleshipClasses.church_community ? '1' : '0'} />
                                    </label>
                                    <label className="flex items-center">
                                        <Checkbox 
                                            name="discipleship_classes[purple_book]"
                                            checked={discipleshipClasses.purple_book}
                                            onCheckedChange={(checked) => updateDiscipleshipClass('purple_book', checked)}
                                        />
                                        <span className="ml-2">Purple Book</span>
                                        <input type="hidden" name="discipleship_classes[purple_book]" value={discipleshipClasses.purple_book ? '1' : '0'} />
                                    </label>
                                    <label className="flex items-center">
                                        <Checkbox 
                                            name="discipleship_classes[making_disciples]"
                                            checked={discipleshipClasses.making_disciples}
                                            onCheckedChange={(checked) => updateDiscipleshipClass('making_disciples', checked)}
                                        />
                                        <span className="ml-2">Making Disciples</span>
                                        <input type="hidden" name="discipleship_classes[making_disciples]" value={discipleshipClasses.making_disciples ? '1' : '0'} />
                                    </label>
                                    <label className="flex items-center">
                                        <Checkbox 
                                            name="discipleship_classes[empowering_leaders]"
                                            checked={discipleshipClasses.empowering_leaders}
                                            onCheckedChange={(checked) => updateDiscipleshipClass('empowering_leaders', checked)}
                                        />
                                        <span className="ml-2">Empowering Leaders</span>
                                        <input type="hidden" name="discipleship_classes[empowering_leaders]" value={discipleshipClasses.empowering_leaders ? '1' : '0'} />
                                    </label>
                                    <label className="flex items-center">
                                        <Checkbox 
                                            name="discipleship_classes[leadership_113]"
                                            checked={discipleshipClasses.leadership_113}
                                            onCheckedChange={(checked) => updateDiscipleshipClass('leadership_113', checked)}
                                        />
                                        <span className="ml-2">Leadership 113</span>
                                        <input type="hidden" name="discipleship_classes[leadership_113]" value={discipleshipClasses.leadership_113 ? '1' : '0'} />
                                    </label>
                                </div>
                            </Card>

                            {/* Victory Group Members Table */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-green-600">
                                        Victory Group Members
                                    </h2>
                                    <Button type="button" onClick={addMember}>
                                        Add Member
                                    </Button>
                                </div>
                                {members.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-green-100">
                                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                                    <th className="border border-gray-300 p-2 text-left">ONE2ONE Facilitator/Date Started</th>
                                                    <th className="border border-gray-300 p-2 text-center">VICTORY WEEKEND</th>
                                                    <th className="border border-gray-300 p-2 text-center">PURPLE BOOK</th>
                                                    <th className="border border-gray-300 p-2 text-center">CHURCH COMMUNITY</th>
                                                    <th className="border border-gray-300 p-2 text-center">MAKING DISCIPLES</th>
                                                    <th className="border border-gray-300 p-2 text-center">EMPOWERING LEADERS</th>
                                                    <th className="border border-gray-300 p-2 text-left">MINISTRY INVOLVEMENT</th>
                                                    <th className="border border-gray-300 p-2 text-left">REMARKS</th>
                                                    <th className="border border-gray-300 p-2 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.map((member, index) => (
                                                    <tr key={member.temp_id}>
                                                        <td className="border border-gray-300 p-2">
                                                            <Input 
                                                                value={member.name}
                                                                onChange={(e) => updateMember(member.temp_id, 'name', e.target.value)}
                                                                name={`members[${index}][name]`}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <div className="space-y-1">
                                                                <Input 
                                                                    placeholder="Facilitator"
                                                                    value={member.one_to_one_facilitator}
                                                                    onChange={(e) => updateMember(member.temp_id, 'one_to_one_facilitator', e.target.value)}
                                                                    name={`members[${index}][one_to_one_facilitator]`}
                                                                />
                                                                <Input 
                                                                    type="date"
                                                                    value={member.one_to_one_date_started}
                                                                    onChange={(e) => updateMember(member.temp_id, 'one_to_one_date_started', e.target.value)}
                                                                    name={`members[${index}][one_to_one_date_started]`}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={member.victory_weekend}
                                                                onCheckedChange={(checked) => updateMember(member.temp_id, 'victory_weekend', checked)}
                                                                name={`members[${index}][victory_weekend]`}
                                                            />
                                                            <input type="hidden" name={`members[${index}][victory_weekend]`} value={member.victory_weekend ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={member.purple_book}
                                                                onCheckedChange={(checked) => updateMember(member.temp_id, 'purple_book', checked)}
                                                                name={`members[${index}][purple_book]`}
                                                            />
                                                            <input type="hidden" name={`members[${index}][purple_book]`} value={member.purple_book ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={member.church_community}
                                                                onCheckedChange={(checked) => updateMember(member.temp_id, 'church_community', checked)}
                                                                name={`members[${index}][church_community]`}
                                                            />
                                                            <input type="hidden" name={`members[${index}][church_community]`} value={member.church_community ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={member.making_disciples}
                                                                onCheckedChange={(checked) => updateMember(member.temp_id, 'making_disciples', checked)}
                                                                name={`members[${index}][making_disciples]`}
                                                            />
                                                            <input type="hidden" name={`members[${index}][making_disciples]`} value={member.making_disciples ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={member.empowering_leaders}
                                                                onCheckedChange={(checked) => updateMember(member.temp_id, 'empowering_leaders', checked)}
                                                                name={`members[${index}][empowering_leaders]`}
                                                            />
                                                            <input type="hidden" name={`members[${index}][empowering_leaders]`} value={member.empowering_leaders ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <Select 
                                                                value={member.ministry_involvement}
                                                                onValueChange={(value) => updateMember(member.temp_id, 'ministry_involvement', value)}
                                                                name={`members[${index}][ministry_involvement]`}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select ministry" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                                    <SelectItem value="Comms">Comms</SelectItem>
                                                                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                                                                    <SelectItem value="Kids">Kids</SelectItem>
                                                                    <SelectItem value="Music">Music</SelectItem>
                                                                    <SelectItem value="Tech">Tech</SelectItem>
                                                                    <SelectItem value="Spirit Empowerment">Spirit Empowerment</SelectItem>
                                                                    <SelectItem value="Ushering">Ushering</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <Textarea 
                                                                value={member.remarks}
                                                                onChange={(e) => updateMember(member.temp_id, 'remarks', e.target.value)}
                                                                name={`members[${index}][remarks]`}
                                                                rows={2}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Button 
                                                                type="button" 
                                                                variant="destructive" 
                                                                size="sm"
                                                                onClick={() => removeMember(member.temp_id)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>

                            {/* Victory Group Interns Table */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-orange-600">
                                        Victory Group Interns
                                    </h2>
                                    <Button type="button" onClick={addIntern}>
                                        Add Intern
                                    </Button>
                                </div>
                                {interns.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-orange-100">
                                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                                    <th className="border border-gray-300 p-2 text-left">ONE2ONE Facilitator/Date Started</th>
                                                    <th className="border border-gray-300 p-2 text-center">VICTORY WEEKEND</th>
                                                    <th className="border border-gray-300 p-2 text-center">PURPLE BOOK</th>
                                                    <th className="border border-gray-300 p-2 text-center">CHURCH COMMUNITY</th>
                                                    <th className="border border-gray-300 p-2 text-center">MAKING DISCIPLES</th>
                                                    <th className="border border-gray-300 p-2 text-center">EMPOWERING LEADERS</th>
                                                    <th className="border border-gray-300 p-2 text-left">MINISTRY INVOLVEMENT</th>
                                                    <th className="border border-gray-300 p-2 text-left">REMARKS</th>
                                                    <th className="border border-gray-300 p-2 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {interns.map((intern, index) => (
                                                    <tr key={intern.temp_id}>
                                                        <td className="border border-gray-300 p-2">
                                                            <Input 
                                                                value={intern.name}
                                                                onChange={(e) => updateIntern(intern.temp_id, 'name', e.target.value)}
                                                                name={`interns[${index}][name]`}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <div className="space-y-1">
                                                                <Input 
                                                                    placeholder="Facilitator"
                                                                    value={intern.one_to_one_facilitator}
                                                                    onChange={(e) => updateIntern(intern.temp_id, 'one_to_one_facilitator', e.target.value)}
                                                                    name={`interns[${index}][one_to_one_facilitator]`}
                                                                />
                                                                <Input 
                                                                    type="date"
                                                                    value={intern.one_to_one_date_started}
                                                                    onChange={(e) => updateIntern(intern.temp_id, 'one_to_one_date_started', e.target.value)}
                                                                    name={`interns[${index}][one_to_one_date_started]`}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={intern.victory_weekend}
                                                                onCheckedChange={(checked) => updateIntern(intern.temp_id, 'victory_weekend', checked)}
                                                                name={`interns[${index}][victory_weekend]`}
                                                            />
                                                            <input type="hidden" name={`interns[${index}][victory_weekend]`} value={intern.victory_weekend ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={intern.purple_book}
                                                                onCheckedChange={(checked) => updateIntern(intern.temp_id, 'purple_book', checked)}
                                                                name={`interns[${index}][purple_book]`}
                                                            />
                                                            <input type="hidden" name={`interns[${index}][purple_book]`} value={intern.purple_book ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={intern.church_community}
                                                                onCheckedChange={(checked) => updateIntern(intern.temp_id, 'church_community', checked)}
                                                                name={`interns[${index}][church_community]`}
                                                            />
                                                            <input type="hidden" name={`interns[${index}][church_community]`} value={intern.church_community ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={intern.making_disciples}
                                                                onCheckedChange={(checked) => updateIntern(intern.temp_id, 'making_disciples', checked)}
                                                                name={`interns[${index}][making_disciples]`}
                                                            />
                                                            <input type="hidden" name={`interns[${index}][making_disciples]`} value={intern.making_disciples ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Checkbox 
                                                                checked={intern.empowering_leaders}
                                                                onCheckedChange={(checked) => updateIntern(intern.temp_id, 'empowering_leaders', checked)}
                                                                name={`interns[${index}][empowering_leaders]`}
                                                            />
                                                            <input type="hidden" name={`interns[${index}][empowering_leaders]`} value={intern.empowering_leaders ? '1' : '0'} />
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <Select 
                                                                value={intern.ministry_involvement}
                                                                onValueChange={(value) => updateIntern(intern.temp_id, 'ministry_involvement', value)}
                                                                name={`interns[${index}][ministry_involvement]`}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select ministry" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                                    <SelectItem value="Comms">Comms</SelectItem>
                                                                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                                                                    <SelectItem value="Kids">Kids</SelectItem>
                                                                    <SelectItem value="Music">Music</SelectItem>
                                                                    <SelectItem value="Tech">Tech</SelectItem>
                                                                    <SelectItem value="Spirit Empowerment">Spirit Empowerment</SelectItem>
                                                                    <SelectItem value="Ushering">Ushering</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            <Textarea 
                                                                value={intern.remarks}
                                                                onChange={(e) => updateIntern(intern.temp_id, 'remarks', e.target.value)}
                                                                name={`interns[${index}][remarks]`}
                                                                rows={2}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 p-2 text-center">
                                                            <Button 
                                                                type="button" 
                                                                variant="destructive" 
                                                                size="sm"
                                                                onClick={() => removeIntern(intern.temp_id)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>

                            {/* Submit Buttons */}
                            <Card className="p-6">
                                <div className="flex gap-4 justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Form'}
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
                                        Form updated successfully!
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