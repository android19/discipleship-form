import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormToken, DiscipleshipUpdate, PageProps } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Copy, Eye, Key, Power, PowerOff, RotateCcw, Users } from 'lucide-react';
import { useState } from 'react';

interface Props extends PageProps {
    token: FormToken & {
        discipleshipUpdates: DiscipleshipUpdate[];
        creator: { name: string } | null;
    };
}

export default function Show({ token }: Props) {
    const [copied, setCopied] = useState(false);

    const copyToken = async () => {
        try {
            await navigator.clipboard.writeText(token.token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = token.token;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleToggleStatus = () => {
        const route = token.is_active ? 'tokens.deactivate' : 'tokens.activate';
        const url = token.is_active ? `/tokens/${token.id}/deactivate` : `/tokens/${token.id}/activate`;
        router.patch(url, {}, {
            preserveState: true,
        });
    };

    const handleResetUsage = () => {
        if (confirm('Are you sure you want to reset the usage count for this token?')) {
            router.patch(`/tokens/${token.id}/reset-usage`, {}, {
                preserveState: true,
            });
        }
    };

    const getStatusBadge = () => {
        if (!token.is_active) {
            return <Badge variant="secondary">Inactive</Badge>;
        }
        
        const now = new Date();
        const expiresAt = new Date(token.expires_at);
        
        if (expiresAt < now) {
            return <Badge variant="destructive">Expired</Badge>;
        }
        
        if (token.max_uses && token.used_count >= token.max_uses) {
            return <Badge variant="destructive">Limit Reached</Badge>;
        }
        
        return <Badge variant="default">Active</Badge>;
    };

    const getRemainingUses = () => {
        if (!token.max_uses) return 'Unlimited';
        return Math.max(0, token.max_uses - token.used_count);
    };

    const getPublicUrl = () => {
        return `${window.location.origin}/public/discipleship/access`;
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/tokens">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Tokens
                            </Link>
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/tokens/${token.id}/edit`}>Edit Token</Link>
                        </Button>
                        <Button
                            variant={token.is_active ? "destructive" : "default"}
                            onClick={handleToggleStatus}
                        >
                            {token.is_active ? (
                                <>
                                    <PowerOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <Power className="h-4 w-4 mr-2" />
                                    Activate
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Token Details</h1>
                    <p className="text-muted-foreground">
                        View token information and usage statistics
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Token Information
                            </CardTitle>
                            <CardDescription>
                                Basic token details and configuration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Token</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="bg-muted px-2 py-1 rounded font-mono text-lg">
                                        {token.token}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyToken}
                                    >
                                        <Copy className="h-4 w-4" />
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Leader Name</Label>
                                <p className="mt-1 font-medium">{token.leader_name}</p>
                            </div>

                            {token.description && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="mt-1">{token.description}</p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                <div className="mt-1">
                                    {getStatusBadge()}
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Public Access URL</Label>
                                <div className="mt-1">
                                    <code className="bg-muted px-2 py-1 rounded text-sm break-all">
                                        {getPublicUrl()}
                                    </code>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Share this URL with users. They will need to enter the token: <strong>{token.token}</strong>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Usage & Limits
                            </CardTitle>
                            <CardDescription>
                                Token usage statistics and limitations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Usage Count</Label>
                                <p className="mt-1 text-2xl font-bold">{token.used_count}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Remaining Uses</Label>
                                <p className="mt-1 text-2xl font-bold">{getRemainingUses()}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Maximum Uses</Label>
                                <p className="mt-1">{token.max_uses || 'Unlimited'}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Expires</Label>
                                <div className="mt-1 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(token.expires_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                <p className="mt-1">{new Date(token.created_at).toLocaleString()}</p>
                                {token.creator && (
                                    <p className="text-sm text-muted-foreground">by {token.creator.name}</p>
                                )}
                            </div>

                            {token.used_count > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetUsage}
                                    className="w-full"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset Usage Count
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {token.discipleshipUpdates && token.discipleshipUpdates.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Submissions ({token.discipleshipUpdates.length})
                            </CardTitle>
                            <CardDescription>
                                Forms submitted using this token
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Leader Name</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Victory Groups</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Submitted</th>
                                            <th className="border border-gray-300 px-4 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {token.discipleshipUpdates.map((update) => (
                                            <tr key={update.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                                    {update.leader_name}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <Badge variant={
                                                        update.status === 'submitted' ? 'default' : 
                                                        update.status === 'under_review' ? 'secondary' : 
                                                        update.status === 'approved' ? 'default' : 'destructive'
                                                    }>
                                                        {update.status}
                                                    </Badge>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {update.victory_groups_leading}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {new Date(update.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={`/discipleship/${update.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label className={`text-sm font-medium ${className || ''}`} {...props}>
            {children}
        </label>
    );
}