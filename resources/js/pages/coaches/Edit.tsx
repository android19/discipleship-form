import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

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
    coach: Coach;
}

export default function Edit({ coach }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Coaches',
            href: '/coaches',
        },
        {
            title: coach.full_name,
            href: `/coaches/${coach.id}`,
        },
        {
            title: 'Edit',
            href: `/coaches/${coach.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${coach.full_name} - Coach`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Form action={`/coaches/${coach.id}`} method="patch">
                    {({ errors, hasErrors, processing, wasSuccessful, recentlySuccessful }) => (
                        <div className="space-y-6">
                            {/* Header */}
                            <Card className="bg-blue-600 text-white p-6">
                                <h1 className="text-2xl font-bold text-center">
                                    EDIT COACH
                                </h1>
                                <p className="text-center mt-2">
                                    Update {coach.full_name}'s Information
                                </p>
                            </Card>

                            {/* Coach Information */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="first_name">First Name *</Label>
                                        <Input 
                                            id="first_name" 
                                            name="first_name"
                                            defaultValue={coach.first_name}
                                            required 
                                        />
                                        {errors.first_name && <div className="text-red-600 text-sm mt-1">{errors.first_name}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="middle_initial">Middle Initial</Label>
                                        <Input 
                                            id="middle_initial" 
                                            name="middle_initial"
                                            defaultValue={coach.middle_initial || ''}
                                            maxLength={1} 
                                        />
                                        {errors.middle_initial && <div className="text-red-600 text-sm mt-1">{errors.middle_initial}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="last_name">Last Name *</Label>
                                        <Input 
                                            id="last_name" 
                                            name="last_name"
                                            defaultValue={coach.last_name}
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
                                            min="18"
                                            max="120"
                                            defaultValue={coach.age}
                                            required 
                                        />
                                        {errors.age && <div className="text-red-600 text-sm mt-1">{errors.age}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="sex">Sex *</Label>
                                        <Select name="sex" defaultValue={coach.sex} required>
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
                                            defaultValue={coach.contact_number}
                                            required 
                                        />
                                        {errors.contact_number && <div className="text-red-600 text-sm mt-1">{errors.contact_number}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="lifestage">Lifestage *</Label>
                                        <Input 
                                            id="lifestage" 
                                            name="lifestage"
                                            defaultValue={coach.lifestage}
                                            placeholder="e.g., Single, Married, Single Parent"
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
                                            defaultValue={coach.date_launched.split('T')[0]} // Format for date input
                                            required 
                                        />
                                        {errors.date_launched && <div className="text-red-600 text-sm mt-1">{errors.date_launched}</div>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="status">Status *</Label>
                                        <Select name="status" defaultValue={coach.status} required>
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
                                        defaultValue={coach.address}
                                        rows={3}
                                        required 
                                    />
                                    {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
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
                                        {processing ? 'Updating...' : 'Update Coach'}
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
                                        Coach updated successfully!
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