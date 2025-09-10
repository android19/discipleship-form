import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head } from '@inertiajs/react';
import InputError from '@/components/input-error';

interface CoachOption {
    value: string;
    label: string;
}

interface MemberOption {
    value: number;
    label: string;
    member: {
        id: number;
        full_name: string;
        victory_group?: string;
    };
}

interface Props {
    token: string;
    leaderName: string;
    coaches: CoachOption[];
    members: MemberOption[];
    tokenInfo: {
        remaining_uses: number | string;
        expires_at: string;
    };
}

interface Member {
    id: string;
    member_id: number | null;
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

export default function DiscipleshipForm({ token, leaderName, coaches, members: availableMembers, tokenInfo }: Props) {
    const [members, setMembers] = useState<Member[]>([]);
    const [interns, setInterns] = useState<Member[]>([]);
    const [discipleshipClasses, setDiscipleshipClasses] = useState({
        church_community: false,
        purple_book: false,
        making_disciples: false,
        empowering_leaders: false,
        leadership_113: false
    });

    const updateDiscipleshipClass = (field: string, value: boolean) => {
        setDiscipleshipClasses(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addMember = () => {
        const newMember: Member = {
            id: Math.random().toString(36).substring(2, 11),
            member_id: null,
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

    const addInternFromMember = (memberName: string) => {
        // Find the member by name
        const selectedMember = members.find(member => member.name === memberName);

        if (selectedMember && !interns.some(intern => intern.name === memberName)) {
            // Create intern with all data from the selected member
            const newIntern: Member = {
                ...selectedMember,
                id: Math.random().toString(36).substring(2, 11), // New ID for intern
            };
            setInterns([...interns, newIntern]);
        }
    };

    const removeInternByName = (memberName: string) => {
        setInterns(interns.filter(intern => intern.name !== memberName));
    };

    const removeMember = (id: string) => {
        setMembers(members.filter(member => member.id !== id));
    };

    const updateMember = (id: string, field: keyof Member, value: any) => {
        setMembers(members.map(member =>
            member.id === id ? { ...member, [field]: value } : member
        ));
    };

    const handleMemberSelect = (memberId: string, selectedMemberId: string) => {
        const selectedMember = availableMembers.find(m => m.value.toString() === selectedMemberId);
        if (selectedMember) {
            updateMember(memberId, 'member_id', selectedMember.value);
            updateMember(memberId, 'name', selectedMember.member.full_name);
        } else {
            updateMember(memberId, 'member_id', null);
            updateMember(memberId, 'name', '');
        }
    };

    return (
        <div>
            <Head title="Discipleship Update Form" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Form action={`/public/discipleship/store/${token}`} method="post">
                        {({ errors, hasErrors, processing, recentlySuccessful }) => (
                            <div className="space-y-6">
                                {/* Hidden inputs to ensure boolean values are always sent */}
                                <input type="hidden" name="discipleship_classes[church_community]" value={discipleshipClasses.church_community ? '1' : '0'} />
                                <input type="hidden" name="discipleship_classes[purple_book]" value={discipleshipClasses.purple_book ? '1' : '0'} />
                                <input type="hidden" name="discipleship_classes[making_disciples]" value={discipleshipClasses.making_disciples ? '1' : '0'} />
                                <input type="hidden" name="discipleship_classes[empowering_leaders]" value={discipleshipClasses.empowering_leaders ? '1' : '0'} />
                                <input type="hidden" name="discipleship_classes[leadership_113]" value={discipleshipClasses.leadership_113 ? '1' : '0'} />

                                {/* Hidden inputs for member boolean fields */}
                                {members.map((member, index) => (
                                    <div key={member.id}>
                                        <input type="hidden" name={`members[${index}][victory_weekend]`} value={member.victory_weekend ? '1' : '0'} />
                                        <input type="hidden" name={`members[${index}][purple_book]`} value={member.purple_book ? '1' : '0'} />
                                        <input type="hidden" name={`members[${index}][church_community]`} value={member.church_community ? '1' : '0'} />
                                        <input type="hidden" name={`members[${index}][making_disciples]`} value={member.making_disciples ? '1' : '0'} />
                                        <input type="hidden" name={`members[${index}][empowering_leaders]`} value={member.empowering_leaders ? '1' : '0'} />
                                    </div>
                                ))}

                                {/* Hidden inputs for intern boolean fields */}
                                {interns.map((intern, index) => (
                                    <div key={intern.id}>
                                        <input type="hidden" name={`interns[${index}][victory_weekend]`} value={intern.victory_weekend ? '1' : '0'} />
                                        <input type="hidden" name={`interns[${index}][purple_book]`} value={intern.purple_book ? '1' : '0'} />
                                        <input type="hidden" name={`interns[${index}][church_community]`} value={intern.church_community ? '1' : '0'} />
                                        <input type="hidden" name={`interns[${index}][making_disciples]`} value={intern.making_disciples ? '1' : '0'} />
                                        <input type="hidden" name={`interns[${index}][empowering_leaders]`} value={intern.empowering_leaders ? '1' : '0'} />
                                    </div>
                                ))}

                                {/* Header */}
                                <Card className="bg-red-600 text-white p-6">
                                    <h1 className="text-2xl font-bold text-center">
                                        DISCIPLESHIP UPDATE FORM
                                    </h1>
                                    <p className="text-center mt-2">
                                        Victory Group Leader's Report
                                    </p>
                                    <div className="text-center mt-3 text-sm">
                                        <p>Access Token: <span className="font-mono font-bold">{token}</span></p>
                                        <p>Expires: {tokenInfo.expires_at}</p>
                                        <p>Remaining Uses: {tokenInfo.remaining_uses}</p>
                                    </div>
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
                                                required
                                                defaultValue={leaderName}
                                            />
                                            <InputError message={errors.leader_name} />
                                        </div>
                                        <div>
                                            <Label htmlFor="mobile_number">Mobile Number *</Label>
                                            <Input
                                                id="mobile_number"
                                                name="mobile_number"
                                                required
                                            />
                                            <InputError message={errors.mobile_number} />
                                        </div>
                                        <div>
                                            <Label htmlFor="ministry_involvement">Ministry Involvement</Label>
                                            <Select name="ministry_involvement">
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
                                            <Select name="coach">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your coach" />
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
                                        <div>
                                            <Label htmlFor="services_attended">Service(s) usually attended</Label>
                                            <Select name="services_attended">
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

                                {/* Victory Group Details Section */}
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                        Victory Group Details
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="victory_groups_leading">
                                                How many Victory Groups are you currently leading? *
                                            </Label>
                                            <Input
                                                id="victory_groups_leading"
                                                name="victory_groups_leading"
                                                type="number"
                                                min="0"
                                                required
                                            />
                                            <InputError message={errors.victory_groups_leading} />
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label>Is your Victory Group active? *</Label>
                                                <div className="flex gap-4 mt-2">
                                                    <label className="flex items-center">
                                                        <input type="radio" name="victory_group_active" value="1" className="mr-2" />
                                                        Yes
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input type="radio" name="victory_group_active" value="0" className="mr-2" />
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
                                                />
                                                <InputError message={errors.inactive_reason} />
                                            </div>

                                            <div>
                                                <Label htmlFor="last_victory_group_date">
                                                    When was the last time you had your Victory Group?
                                                </Label>
                                                <Input
                                                    id="last_victory_group_date"
                                                    name="last_victory_group_date"
                                                    type="date"
                                                />
                                                <InputError message={errors.last_victory_group_date} />
                                            </div>

                                            <div>
                                                <Label htmlFor="victory_group_types">Victory Group Types</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                                    {['Students', 'Singles', 'Married', 'Mixed'].map((type) => (
                                                        <div key={type} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`victory_group_type_${type}`}
                                                                name="victory_group_types[]"
                                                                value={type}
                                                            />
                                                            <Label htmlFor={`victory_group_type_${type}`}>{type}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="intern_invite_status">
                                                    Do you have intern/s to invite to your Victory Group? *
                                                </Label>
                                                <Select name="intern_invite_status" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select intern invite status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="yes">Yes</SelectItem>
                                                        <SelectItem value="none">None</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="victory_group_schedule">
                                                    Victory Group Schedule (Day & Time) *
                                                </Label>
                                                <Input
                                                    id="victory_group_schedule"
                                                    name="victory_group_schedule"
                                                    required
                                                    placeholder="e.g., Friday 7:00 PM"
                                                />
                                                <InputError message={errors.victory_group_schedule} />
                                            </div>

                                            <div>
                                                <Label htmlFor="venue">Venue</Label>
                                                <Input
                                                    id="venue"
                                                    name="venue"
                                                    placeholder="Victory Group meeting location"
                                                />
                                                <InputError message={errors.venue} />
                                            </div>

                                            <div>
                                                <Label htmlFor="concerns">
                                                    Any concerns encountered regarding your Victory Group?
                                                </Label>
                                                <Textarea
                                                    id="concerns"
                                                    name="concerns"
                                                    placeholder="Share any challenges or concerns..."
                                                />
                                                <InputError message={errors.concerns} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Discipleship Classes Checklist Section */}
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-purple-600">
                                        Discipleship Classes Checklist
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Please indicate which discipleship classes you have completed:
                                    </p>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'church_community', label: 'Church Community' },
                                            { key: 'purple_book', label: 'Purple Book' },
                                            { key: 'making_disciples', label: 'Making Disciples' },
                                            { key: 'empowering_leaders', label: 'Empowering Leaders' },
                                            { key: 'leadership_113', label: 'Leadership 113' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`discipleship_${item.key}`}
                                                    checked={discipleshipClasses[item.key as keyof typeof discipleshipClasses]}
                                                    onCheckedChange={(checked) => updateDiscipleshipClass(item.key, checked as boolean)}
                                                />
                                                <Label htmlFor={`discipleship_${item.key}`}>{item.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Victory Group Members Section */}
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-green-600">
                                            Victory Group Members
                                        </h2>
                                        <Button type="button" onClick={addMember} variant="outline" size="sm">
                                            + Add Member
                                        </Button>
                                    </div>
                                    {members.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-green-100">
                                                        <th className="border border-gray-300 px-2 py-2 text-left">Name *</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-left">One2One Facilitator</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-left">Date Started</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-center">Victory Weekend</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-center">Purple Book</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-center">Church Community</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-center">Making Disciples</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-center">Empowering Leaders</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-left">Ministry</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-left">Remarks</th>
                                                        <th className="border border-gray-300 px-2 py-2 text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {members.map((member, index) => (
                                                        <tr key={member.id}>
                                                            <td className="border border-gray-300 px-2 py-2">
                                                                <Input
                                                                    name={`members[${index}][name]`}
                                                                    value={member.name}
                                                                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                                                                    placeholder="Member name"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2">
                                                                <Input
                                                                    name={`members[${index}][one_to_one_facilitator]`}
                                                                    value={member.one_to_one_facilitator}
                                                                    onChange={(e) => updateMember(member.id, 'one_to_one_facilitator', e.target.value)}
                                                                    placeholder="Facilitator"
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2">
                                                                <Input
                                                                    type="date"
                                                                    name={`members[${index}][one_to_one_date_started]`}
                                                                    value={member.one_to_one_date_started}
                                                                    onChange={(e) => updateMember(member.id, 'one_to_one_date_started', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                                <Checkbox
                                                                    checked={member.victory_weekend}
                                                                    onCheckedChange={(checked) => updateMember(member.id, 'victory_weekend', checked)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                                <Checkbox
                                                                    checked={member.purple_book}
                                                                    onCheckedChange={(checked) => updateMember(member.id, 'purple_book', checked)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                                <Checkbox
                                                                    checked={member.church_community}
                                                                    onCheckedChange={(checked) => updateMember(member.id, 'church_community', checked)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                                <Checkbox
                                                                    checked={member.making_disciples}
                                                                    onCheckedChange={(checked) => updateMember(member.id, 'making_disciples', checked)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                                <Checkbox
                                                                    checked={member.empowering_leaders}
                                                                    onCheckedChange={(checked) => updateMember(member.id, 'empowering_leaders', checked)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2">
                                                                <Select
                                                                    name={`members[${index}][ministry_involvement]`}
                                                                    value={member.ministry_involvement}
                                                                    onValueChange={(value) => updateMember(member.id, 'ministry_involvement', value)}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select" />
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
                                                            <td className="border border-gray-300 px-2 py-2">
                                                                <Textarea
                                                                    name={`members[${index}][remarks]`}
                                                                    value={member.remarks}
                                                                    onChange={(e) => updateMember(member.id, 'remarks', e.target.value)}
                                                                    placeholder="Remarks"
                                                                    rows={2}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => removeMember(member.id)}
                                                                    variant="destructive"
                                                                    size="sm"
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

                                {/* Victory Group Interns Section */}
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-orange-600">
                                        Victory Group Interns
                                    </h2>

                                    {/* Add Intern Dropdown */}
                                    <div className="mb-4">
                                        <Label htmlFor="intern_selector">Add Intern from Victory Group Members</Label>
                                        <Select onValueChange={(value) => addInternFromMember(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a member to add as intern" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {members
                                                    .filter(member => member.name && !interns.some(intern => intern.name === member.name))
                                                    .map((member) => (
                                                        <SelectItem key={member.id} value={member.name}>
                                                            {member.name}
                                                        </SelectItem>
                                                    ))}
                                                {members.filter(member => member.name).length === 0 && (
                                                    <SelectItem value="no-members" disabled>
                                                        No members available - please add members first
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Select members from the Victory Group Members section above. All their details will be automatically populated.
                                        </p>
                                    </div>

                                    {/* Display Selected Interns */}
                                    {interns.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-orange-600">Selected Interns</h3>
                                            {interns.map((intern, index) => (
                                                <Card key={intern.id} className="p-4 border-l-4 border-orange-500">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="text-lg font-semibold text-gray-900">{intern.name}</h4>
                                                        <Button
                                                            type="button"
                                                            onClick={() => removeInternByName(intern.name)}
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <Label className="text-gray-600">One2One Facilitator</Label>
                                                            <p className="font-medium">{intern.one_to_one_facilitator || 'Not specified'}</p>
                                                        </div>
                                                        <div>
                                                            <Label className="text-gray-600">Date Started</Label>
                                                            <p className="font-medium">{intern.one_to_one_date_started || 'Not specified'}</p>
                                                        </div>
                                                        <div>
                                                            <Label className="text-gray-600">Ministry Involvement</Label>
                                                            <p className="font-medium">{intern.ministry_involvement || 'Not specified'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <Label className="text-gray-600">Discipleship Progress</Label>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {intern.victory_weekend && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Victory Weekend</span>}
                                                            {intern.purple_book && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Purple Book</span>}
                                                            {intern.church_community && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Church Community</span>}
                                                            {intern.making_disciples && <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Making Disciples</span>}
                                                            {intern.empowering_leaders && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Empowering Leaders</span>}
                                                        </div>
                                                    </div>

                                                    {intern.remarks && (
                                                        <div className="mt-3">
                                                            <Label className="text-gray-600">Remarks</Label>
                                                            <p className="text-sm text-gray-800 mt-1">{intern.remarks}</p>
                                                        </div>
                                                    )}

                                                    {/* Hidden inputs for form submission */}
                                                    <div className="hidden">
                                                        <input type="hidden" name={`interns[${index}][name]`} value={intern.name} />
                                                        <input type="hidden" name={`interns[${index}][one_to_one_facilitator]`} value={intern.one_to_one_facilitator} />
                                                        <input type="hidden" name={`interns[${index}][one_to_one_date_started]`} value={intern.one_to_one_date_started} />
                                                        <input type="hidden" name={`interns[${index}][ministry_involvement]`} value={intern.ministry_involvement} />
                                                        <input type="hidden" name={`interns[${index}][remarks]`} value={intern.remarks} />
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    {interns.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No interns selected yet.</p>
                                            <p className="text-sm mt-1">Add Victory Group Members first, then select them as interns from the dropdown above.</p>
                                        </div>
                                    )}
                                </Card>

                                {/* Privacy Notice */}
                                <Card className="p-6 bg-gray-50">
                                    <p className="text-sm text-gray-600">
                                        <strong>Privacy Notice:</strong> The information collected in this form will be used for discipleship
                                        tracking and ministry purposes. Your personal data will be handled in accordance with our privacy policy
                                        and will not be shared with third parties without your consent.
                                    </p>
                                </Card>

                                {/* Submit Button */}
                                <Card className="p-6">
                                    <div className="flex gap-4 justify-end">
                                        <Button type="submit" disabled={processing} className="bg-red-600 hover:bg-red-700">
                                            {processing ? 'Submitting...' : 'Submit Update'}
                                        </Button>
                                    </div>
                                </Card>

                                {/* Error Display */}
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

                                {/* Success Message */}
                                {recentlySuccessful && (
                                    <Card className="p-6 border-green-300 bg-green-50">
                                        <p className="text-green-600 font-medium">
                                            Form submitted successfully!
                                        </p>
                                    </Card>
                                )}
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}