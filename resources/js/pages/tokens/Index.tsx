import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormToken, PageProps } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Power, PowerOff, RotateCcw, Search, Trash2, Key } from 'lucide-react';
import { useState } from 'react';

interface Props extends PageProps {
    tokens: {
        data: FormToken[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ tokens, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit('/tokens?' + new URLSearchParams({ search: searchTerm }), { 
            preserveState: true,
            replace: true
        });
    };

    const handleToggleStatus = (token: FormToken) => {
        const url = token.is_active ? `/tokens/${token.id}/deactivate` : `/tokens/${token.id}/activate`;
        router.patch(url, {}, {
            preserveState: true,
        });
    };

    const handleResetUsage = (token: FormToken) => {
        if (confirm('Are you sure you want to reset the usage count for this token?')) {
            router.patch(`/tokens/${token.id}/reset-usage`, {}, {
                preserveState: true,
            });
        }
    };

    const handleDelete = (token: FormToken) => {
        if (confirm('Are you sure you want to delete this token? This action cannot be undone.')) {
            router.delete(`/tokens/${token.id}`, {
                preserveState: true,
            });
        }
    };

    const getStatusBadge = (token: FormToken) => {
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

    const getRemainingUses = (token: FormToken) => {
        if (!token.max_uses) return 'Unlimited';
        return Math.max(0, token.max_uses - token.used_count);
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Form Tokens</h1>
                        <p className="text-muted-foreground">
                            Manage tokens for unauthenticated form access
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/tokens/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Token
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Search Tokens</CardTitle>
                        <CardDescription>
                            Find tokens by leader name or description
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search" className="sr-only">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by leader name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tokens ({tokens.total})</CardTitle>
                        <CardDescription>
                            All form tokens and their current status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tokens.data.length === 0 ? (
                            <div className="text-center py-8">
                                <Key className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No tokens found</h3>
                                <p className="text-muted-foreground">
                                    {filters.search ? 'No tokens match your search criteria.' : 'Create your first token to get started.'}
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href="/tokens/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Token
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-blue-100">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Token</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Leader Name</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Usage</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Expires</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                                            <th className="border border-gray-300 px-4 py-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokens.data.map((token) => (
                                            <tr key={token.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 font-mono font-medium">
                                                    {token.token}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div>
                                                        <div className="font-medium">{token.leader_name}</div>
                                                        {token.description && (
                                                            <div className="text-sm text-gray-500">
                                                                {token.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {getStatusBadge(token)}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className="text-sm">
                                                        <div>{token.used_count} used</div>
                                                        <div className="text-gray-500">
                                                            {getRemainingUses(token)} remaining
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className="text-sm">
                                                        {new Date(token.expires_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className="text-sm">
                                                        {new Date(token.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/tokens/${token.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/tokens/${token.id}/edit`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(token)}
                                                        >
                                                            {token.is_active ? (
                                                                <PowerOff className="h-4 w-4" />
                                                            ) : (
                                                                <Power className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        {token.used_count > 0 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleResetUsage(token)}
                                                            >
                                                                <RotateCcw className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(token)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}