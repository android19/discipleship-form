import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
    token: string;
    error: string;
    message: string;
    suggestions: string[];
    tokenInfo?: {
        leader_name: string;
        expires_at: string;
        used_count: number;
        max_uses?: number;
        is_active: boolean;
    };
}

export default function TokenExpired({ token, error, message, suggestions, tokenInfo }: Props) {
    const getIconForError = (errorType: string) => {
        if (errorType.includes('expired') || errorType.includes('deactivated')) {
            return (
                <div className="h-16 w-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">✕</span>
                </div>
            );
        }
        return (
            <div className="h-16 w-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">⚠</span>
            </div>
        );
    };

    const getColorForError = (errorType: string) => {
        if (errorType.includes('expired') || errorType.includes('deactivated')) {
            return 'border-red-200 bg-red-50';
        }
        return 'border-yellow-200 bg-yellow-50';
    };

    const getHeaderColorForError = (errorType: string) => {
        if (errorType.includes('expired') || errorType.includes('deactivated')) {
            return 'text-red-600';
        }
        return 'text-yellow-600';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <Head title="Token Access Issue" />
            
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <Card className="bg-red-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center">
                        DISCIPLESHIP FORM ACCESS
                    </h1>
                    <p className="text-center mt-2">
                        Access Token Verification
                    </p>
                </Card>

                {/* Error Information */}
                <Card className={`p-8 ${getColorForError(error)}`}>
                    <div className="text-center space-y-4">
                        {getIconForError(error)}
                        
                        <div>
                            <h2 className={`text-2xl font-bold ${getHeaderColorForError(error)}`}>
                                {error}
                            </h2>
                            <p className="text-gray-700 mt-2 text-lg">
                                {message}
                            </p>
                        </div>

                        {/* Token Information */}
                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="font-semibold text-gray-800 mb-2">Token Details:</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{token}</code></p>
                                {tokenInfo && (
                                    <>
                                        <p><strong>Leader:</strong> {tokenInfo.leader_name}</p>
                                        <p><strong>Expires:</strong> {tokenInfo.expires_at}</p>
                                        <p><strong>Status:</strong> {tokenInfo.is_active ? 'Active' : 'Inactive'}</p>
                                        <p><strong>Uses:</strong> {tokenInfo.used_count}{tokenInfo.max_uses ? ` / ${tokenInfo.max_uses}` : ' (unlimited)'}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">
                            What you can do next:
                        </h3>
                        <ul className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700">{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}

                {/* Action Buttons */}
                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/public/discipleship/access">
                            <Button className="w-full sm:w-auto">
                                Try Another Token
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto"
                        >
                            Refresh Page
                        </Button>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Contact your ministry leader for assistance.
                        </p>
                    </div>
                </Card>

                {/* Help Information */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        About Access Tokens
                    </h3>
                    <div className="text-sm text-blue-700 space-y-2">
                        <p>
                            • Access tokens are provided by your ministry leader to allow you to submit discipleship updates
                        </p>
                        <p>
                            • Tokens have expiration dates and usage limits for security purposes
                        </p>
                        <p>
                            • If your token is expired or invalid, contact your leader for a new one
                        </p>
                        <p>
                            • Make sure to copy the complete token exactly as provided
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}