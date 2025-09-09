import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { FormToken, PageProps } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props extends PageProps {
    token: FormToken;
}

interface FormData {
    leader_name: string;
    description: string;
    expires_at: string;
    is_active: boolean;
    max_uses: string;
}

export default function Edit({ token, errors }: Props) {
    const { data, setData, patch, processing } = useForm<FormData>({
        leader_name: token.leader_name,
        description: token.description || '',
        expires_at: new Date(token.expires_at).toISOString().split('T')[0],
        is_active: token.is_active,
        max_uses: token.max_uses ? token.max_uses.toString() : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/tokens/${token.id}`);
    };

    return (
        <AppLayout>
            <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tokens/${token.id}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Token
                        </Link>
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Token</h1>
                    <p className="text-muted-foreground">
                        Update token configuration and settings
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Token Details</CardTitle>
                            <CardDescription>
                                Update the basic token information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="token">Token</Label>
                                <Input
                                    id="token"
                                    type="text"
                                    value={token.token}
                                    disabled
                                    className="font-mono bg-muted"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Token cannot be changed after creation
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="leader_name">Leader Name *</Label>
                                <Input
                                    id="leader_name"
                                    type="text"
                                    value={data.leader_name}
                                    onChange={(e) => setData('leader_name', e.target.value)}
                                    placeholder="Enter the leader's full name"
                                    required
                                />
                                <InputError message={errors.leader_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Optional description for this token (e.g., Victory Group leaders batch 2024)"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Token Configuration</CardTitle>
                            <CardDescription>
                                Update expiration date, usage limits, and status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="expires_at">Expiration Date *</Label>
                                <Input
                                    id="expires_at"
                                    type="date"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                <InputError message={errors.expires_at} />
                                <p className="text-sm text-muted-foreground">
                                    Token will become invalid after this date
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_uses">Maximum Uses</Label>
                                <Input
                                    id="max_uses"
                                    type="number"
                                    value={data.max_uses}
                                    onChange={(e) => setData('max_uses', e.target.value)}
                                    placeholder="Leave empty for unlimited uses"
                                    min="1"
                                    max="1000"
                                />
                                <InputError message={errors.max_uses} />
                                <p className="text-sm text-muted-foreground">
                                    Limit how many times this token can be used to submit forms
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Active
                                </Label>
                                <InputError message={errors.is_active} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Inactive tokens cannot be used to access the form
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Statistics</CardTitle>
                            <CardDescription>
                                Current usage information (read-only)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Times Used</Label>
                                    <p className="text-2xl font-bold">{token.used_count}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <p className="text-sm">{new Date(token.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Token'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/tokens/${token.id}`}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}