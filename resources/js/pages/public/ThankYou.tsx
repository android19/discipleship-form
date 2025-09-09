import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { CheckCircle, Users, Clock, Mail } from 'lucide-react';

export default function ThankYou() {
    return (
        <>
            <Head title="Thank You - Form Submitted" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    {/* Success Header */}
                    <Card className="bg-green-600 text-white p-8 mb-6">
                        <div className="text-center">
                            <CheckCircle className="mx-auto h-16 w-16 mb-4" />
                            <h1 className="text-3xl font-bold mb-2">
                                Thank You!
                            </h1>
                            <p className="text-green-100 text-lg">
                                Your discipleship update has been submitted successfully
                            </p>
                        </div>
                    </Card>

                    {/* Confirmation Details */}
                    <Card className="p-8 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            What happens next?
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-blue-600 mt-1" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Review Process</h3>
                                    <p className="text-gray-600 text-sm">
                                        Your ministry leader will review your discipleship update within 1-2 business days.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <Users className="h-6 w-6 text-blue-600 mt-1" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Follow-up</h3>
                                    <p className="text-gray-600 text-sm">
                                        If needed, your leader may reach out to discuss your victory group activities or provide additional support.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <Mail className="h-6 w-6 text-blue-600 mt-1" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Questions or Concerns</h3>
                                    <p className="text-gray-600 text-sm">
                                        If you have any questions about your submission or need to make changes, please contact your ministry leader directly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Important Notes */}
                    <Card className="p-6 bg-blue-50 border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-3">
                            Important Notes:
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li className="flex items-start">
                                <span className="font-bold mr-2">•</span>
                                <span>Your form submission is complete and cannot be edited online</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold mr-2">•</span>
                                <span>Keep your access token secure for future submissions (if applicable)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold mr-2">•</span>
                                <span>Contact your ministry leader if you need to submit corrections</span>
                            </li>
                        </ul>
                    </Card>

                    {/* Action Buttons */}
                    <div className="text-center mt-8">
                        <Button
                            onClick={() => window.location.href = '/public/discipleship/access'}
                            variant="outline"
                            size="lg"
                        >
                            Submit Another Form
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-600 text-sm">
                        <p>
                            Thank you for your faithful service in leading Victory Groups!
                        </p>
                        <p className="mt-1">
                            Your dedication to discipleship makes a lasting impact.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}