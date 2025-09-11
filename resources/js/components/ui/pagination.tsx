import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    showing: number;
    preserveState?: boolean;
    preserveScroll?: boolean;
}

export default function Pagination({
    links,
    currentPage,
    lastPage,
    total,
    perPage,
    showing,
    preserveState = true,
    preserveScroll = true,
}: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        
        router.visit(url, {
            preserveState,
            preserveScroll,
        });
    };

    // Filter out "Previous" and "Next" from links for number pagination
    const pageLinks = links.slice(1, -1);
    const prevLink = links[0];
    const nextLink = links[links.length - 1];

    // Helper function to generate visible page numbers
    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(lastPage - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < lastPage - 1) {
            rangeWithDots.push('...', lastPage);
        } else if (lastPage > 1) {
            rangeWithDots.push(lastPage);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col items-center space-y-4 mt-6">
            {/* Pagination Info */}
            <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, total)} of {total} results
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(prevLink.url)}
                    disabled={!prevLink.url}
                    className="flex items-center px-3 py-2"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                                    ...
                                </span>
                            );
                        }

                        const pageNumber = page as number;
                        const isActive = pageNumber === currentPage;
                        
                        // Find the corresponding link for this page
                        const pageLink = pageLinks.find(link => {
                            const linkText = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                            return parseInt(linkText) === pageNumber;
                        });

                        return (
                            <Button
                                key={pageNumber}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageLink?.url || null)}
                                disabled={!pageLink?.url}
                                className={`px-3 py-2 min-w-[40px] ${
                                    isActive 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {pageNumber}
                            </Button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(nextLink.url)}
                    disabled={!nextLink.url}
                    className="flex items-center px-3 py-2"
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}