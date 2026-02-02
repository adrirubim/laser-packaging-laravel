import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import machineryRoutes from '@/routes/machinery';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus } from 'lucide-react';

type ValueType = {
    uuid: string;
    id: number;
};

type Machinery = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    parameter?: string | null;
    value_type_uuid?: string | null;
    value_type?: ValueType | null;
};

type MachineryIndexProps = {
    machinery: {
        data: Machinery[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function MachineryIndex() {
    const { props } = usePage<MachineryIndexProps>();
    const { machinery: machineryPaginated, filters, flash } = props;

    const handleSearchChange = (value: string) => {
        router.get(
            machineryRoutes.index().url,
            {
                search: value || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        router.get(
            machineryRoutes.index().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Macchinari',
            href: machineryRoutes.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Macchinari" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Macchinari
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Elenco dei macchinari attivi con Cerca.
                        </p>
                    </div>
                    <Link
                        href={machineryRoutes.create().url}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuovo Macchinario
                    </Link>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
                        {flash.error}
                    </div>
                )}

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder="Codice, descrizione o parametro..."
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="relative h-full w-full overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <th className="border-b px-3 py-2 font-medium">
                                        ID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        UUID
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Macchinario
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Parametro
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Tipo Valore
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {machineryPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun macchinario trovato per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {machineryPaginated.data.map((mach) => (
                                    <tr
                                        key={mach.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {mach.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {mach.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {mach.cod}{' '}
                                            {mach.description
                                                ? ` - ${mach.description}`
                                                : ''}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {mach.parameter || (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {mach.value_type ? (
                                                `ID: ${mach.value_type.id}`
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        aria-label="Apri menu azioni"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                machineryRoutes.show(
                                                                    {
                                                                        machinery:
                                                                            mach.uuid,
                                                                    },
                                                                ).url,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Visualizza
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => {
                                                            e.preventDefault();
                                                            router.visit(
                                                                machineryRoutes.edit(
                                                                    {
                                                                        machinery:
                                                                            mach.uuid,
                                                                    },
                                                                ).url,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifica
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {machineryPaginated.links.length > 1 && (
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div>
                            Pagina{' '}
                            <strong>{machineryPaginated.current_page}</strong>{' '}
                            di <strong>{machineryPaginated.last_page}</strong>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {machineryPaginated.links.map((link, index) => {
                                if (
                                    link.label.includes('&laquo;') ||
                                    link.label.includes('&raquo;')
                                ) {
                                    return null;
                                }

                                return (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? '#'}
                                        className={`rounded-md px-2 py-1 ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                        }`}
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
