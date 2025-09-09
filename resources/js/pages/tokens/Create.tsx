import { useState } from 'react';
import { Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Form Tokens',
        href: '/tokens',
    },
    {
        title: 'Create Token',
        href: '/tokens/create',
    },
];

export default function Create() {
    const [isActive, setIsActive] = useState(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Form Token" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Form action="/tokens" method="post">
                    {({ errors, hasErrors, processing, wasSuccessful, recentlySuccessful }) => (
                        <div className="space-y-6">
                            {/* Hidden input to ensure boolean value is always sent */}
                            <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />

                            {/* Header */}
                            <Card className="bg-red-600 text-white p-6">
                                <h1 className="text-2xl font-bold text-center">
                                    FORM TOKEN CREATION
                                </h1>
                                <p className="text-center mt-2">
                                    Create Access Token for Unauthenticated Form Submission
                                </p>
                            </Card>

                            {/* Token Information Section */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-red-600">
                                    Token Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="leader_name">Leader Name *</Label>
                                        <Input
                                            id="leader_name"
                                            name="leader_name"
                                            required
                                            error={errors.leader_name}
                                            placeholder="Enter the leader's full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="expires_at">Expiration Date *</Label>
                                        <Input
                                            id="expires_at"
                                            name="expires_at"
                                            type="date"
                                            required
                                            error={errors.expires_at}
                                            defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Optional description for this token (e.g., Victory Group leaders batch 2024)"
                                            rows={3}
                                            error={errors.description}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Token Configuration Section */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                    Token Configuration
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="max_uses">Maximum Uses</Label>
                                        <Input
                                            id="max_uses"
                                            name="max_uses"
                                            type="number"
                                            placeholder="Leave empty for unlimited uses"
                                            min="1"
                                            max="1000"
                                            error={errors.max_uses}
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Limit how many times this token can be used to submit forms
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-8">
                                        <Checkbox
                                            id="is_active"
                                            checked={isActive}
                                            onCheckedChange={(checked) => setIsActive(checked as boolean)}
                                        />
                                        <Label htmlFor="is_active">
                                            Active Token
                                        </Label>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Inactive tokens cannot be used to access the form
                                </p>
                            </Card>

                            {/* Privacy Notice */}
                            <Card className="p-6 bg-gray-50">
                                <p className="text-sm text-gray-600">
                                    <strong>Token Security:</strong> Generated tokens will be unique and secure. Once created, 
                                    the token can be shared with authorized leaders to access the discipleship form without 
                                    requiring user authentication. Tokens can be deactivated or have their usage limits modified 
                                    at any time through the token management interface.
                                </p>
                            </Card>

                            {/* Action Buttons */}
                            <Card className="p-6">
                                <div className="flex gap-4 justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating Token...' : 'Create Token'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
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
                                        Token created successfully!
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