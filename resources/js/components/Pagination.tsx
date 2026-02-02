import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    links: { url: string | null; label: string; active: boolean }[];
    currentPage: number;
    lastPage: number;
    totalItems?: number;
};

export function Pagination({
    links,
    currentPage,
    lastPage,
    totalItems,
}: PaginationProps) {
    const prevLink = links.find((link) => link.label.includes('&laquo;'));
    const nextLink = links.find((link) => link.label.includes('&raquo;'));
    const pageLinks = links.filter(
        (link) =>
            !link.label.includes('&laquo;') &&
            !link.label.includes('&raquo;') &&
            link.url !== null,
    );

    if (links.length <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <div className="text-sm">
                Pagina <strong>{currentPage}</strong> di{' '}
                <strong>{lastPage}</strong>
                {totalItems !== undefined && ` (${totalItems} risultati)`}
            </div>
            <div className="flex items-center gap-1">
                {prevLink && (
                    <Link
                        href={prevLink.url ?? '#'}
                        className={`inline-flex items-center rounded-md border px-3 py-2 transition-colors ${
                            prevLink.url
                                ? 'border-input hover:bg-muted'
                                : 'cursor-not-allowed border-transparent opacity-50'
                        }`}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Precedente
                    </Link>
                )}
                <div className="flex flex-wrap items-center gap-1">
                    {pageLinks.map((link, index) => (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url ?? '#'}
                            className={`min-w-[2.5rem] rounded-md px-3 py-2 text-center transition-colors ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-input hover:bg-muted'
                            }`}
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Link>
                    ))}
                </div>
                {nextLink && (
                    <Link
                        href={nextLink.url ?? '#'}
                        className={`inline-flex items-center rounded-md border px-3 py-2 transition-colors ${
                            nextLink.url
                                ? 'border-input hover:bg-muted'
                                : 'cursor-not-allowed border-transparent opacity-50'
                        }`}
                    >
                        Successivo
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                )}
            </div>
        </div>
    );
}
