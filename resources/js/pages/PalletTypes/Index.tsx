import { ActionsDropdown } from '@/components/ActionsDropdown';
import {
    FlashNotifications,
    useFlashNotifications,
} from '@/components/flash-notifications';
import { IndexHeader } from '@/components/IndexHeader';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import AppLayout from '@/layouts/app-layout';
import palletTypes from '@/routes/pallet-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type PalletType = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
};

type PalletTypesIndexProps = {
    palletTypes: {
        data: PalletType[];
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

export default function PalletTypesIndex() {
    const { props } = usePage<PalletTypesIndexProps>();
    const { palletTypes: palletTypesPaginated, filters } = props;
    const { flash } = useFlashNotifications();

    const handleSearchChange = (value: string) => {
        router.get(
            palletTypes.index().url,
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
            palletTypes.index().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tipi pallet',
            href: palletTypes.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipi pallet" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <IndexHeader
                    title="Tipi pallet"
                    subtitle="Elenco dei tipi pallet attivi con Cerca."
                    createHref={palletTypes.create().url}
                    createLabel="Nuovo tipo pallet"
                />

                <FlashNotifications flash={flash} />

                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Cerca
                        </label>
                        <SearchInput
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            onClear={clearSearch}
                            placeholder="Codice o descrizione..."
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
                                        Codice
                                    </th>
                                    <th className="border-b px-3 py-2 font-medium">
                                        Descrizione
                                    </th>
                                    <th className="border-b px-3 py-2 text-right font-medium">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {palletTypesPaginated.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Nessun tipo pallet trovato per i
                                            filtri attuali.
                                        </td>
                                    </tr>
                                )}
                                {palletTypesPaginated.data.map((palletType) => (
                                    <tr
                                        key={palletType.uuid}
                                        className="border-b last:border-b-0 hover:bg-muted/40"
                                    >
                                        <td className="px-3 py-2 align-middle text-xs">
                                            {palletType.id}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {palletType.uuid}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">
                                            {palletType.cod}
                                        </td>
                                        <td className="px-3 py-2 align-middle font-medium">
                                            {palletType.description}
                                        </td>
                                        <td className="px-3 py-2 text-right align-middle text-xs">
                                            <ActionsDropdown
                                                viewHref={
                                                    palletTypes.show({
                                                        palletType:
                                                            palletType.uuid,
                                                    }).url
                                                }
                                                editHref={
                                                    palletTypes.edit({
                                                        palletType:
                                                            palletType.uuid,
                                                    }).url
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    links={palletTypesPaginated.links}
                    currentPage={palletTypesPaginated.current_page}
                    lastPage={palletTypesPaginated.last_page}
                />
            </div>
        </AppLayout>
    );
}
