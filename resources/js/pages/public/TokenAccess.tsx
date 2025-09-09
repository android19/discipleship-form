import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head } from '@inertiajs/react';

export default function TokenAccess() {
    const [token, setToken] = useState('');

    return (
        <>
            <Head title="Access Discipleship Form" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <Card className="bg-blue-600 text-white p-6 mb-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">
                                Discipleship Update Form
                            </h1>
                            <p className="mt-2 text-blue-100">
                                Enter your access token to continue
                            </p>
                        </div>
                    </Card>

                    {/* Token Entry Form */}
                    <Card className="p-6">
                        <Form action="/public/discipleship/verify-token" method="post">
                            {({ errors, processing }) => (
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="token" className="text-sm font-medium">
                                            Access Token *
                                        </Label>
                                        <Input
                                            id="token"
                                            name="token"
                                            type="text"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value.toUpperCase())}
                                            placeholder="Enter your token (e.g., VG2024ABC)"
                                            className="mt-1 text-center text-lg font-mono tracking-widest"
                                            maxLength={12}
                                            required
                                        />
                                        {errors.token && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.token}
                                            </div>
                                        )}
                                        <p className="text-gray-600 text-xs mt-1">
                                            Your token was provided by discipleship admin
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || token.length < 3}
                                    >
                                        {processing ? 'Verifying...' : 'Access Form'}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </Card>

                    {/* Instructions */}
                    <Card className="mt-6 p-4 bg-gray-50">
                        <h3 className="font-medium text-gray-900 mb-2">
                            Instructions:
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Enter the access token provided by your Discipleship Admin.</li>
                            <li>• Tokens are 6–12 characters, not case-sensitive.</li>
                            <li>• If you need a new token, please contact your Coach.</li>
                            <li>• Do not share your token with anyone.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </>
    );
}