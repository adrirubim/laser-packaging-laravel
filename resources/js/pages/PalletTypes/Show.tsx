import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import palletTypes from '@/routes/pallet-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type PalletType = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    articles?: Article[];
};

type PalletTypesShowProps = {
    palletType: PalletType;
};

export default function PalletTypesShow({ palletType }: PalletTypesShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tipi di Pallet',
            href: palletTypes.index().url,
        },
        {
            title: palletType.cod,
            href: palletTypes.show({ palletType: palletType.uuid }).url,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                'Sei sicuro di voler eliminare questo tipo di pallet? Questa azione non può essere annullata.',
            )
        ) {
            router.delete(
                palletTypes.destroy({ palletType: palletType.uuid }).url,
                {
                    onSuccess: () => {
                        router.visit(palletTypes.index().url);
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tipo di Pallet ${palletType.cod}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {palletType.description}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice:{' '}
                            <span className="font-mono">{palletType.cod}</span>{' '}
                            | UUID:{' '}
                            <span className="font-mono">{palletType.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    palletTypes.edit({
                                        palletType: palletType.uuid,
                                    }).url
                                }
                            >
                                Modifica
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Elimina
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dettagli Tipo di Pallet</CardTitle>
                            <CardDescription>
                                Informazioni su questo tipo di pallet
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </Label>
                                <p className="text-sm">{palletType.id}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </Label>
                                <p className="font-mono text-sm">
                                    {palletType.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Codice
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {palletType.cod}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Descrizione
                                </Label>
                                <p className="text-lg font-semibold">
                                    {palletType.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {palletType.articles && palletType.articles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Articoli Associati</CardTitle>
                                <CardDescription>
                                    Articoli che utilizzano questo tipo di
                                    pallet
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {palletType.articles.map((article) => (
                                        <div
                                            key={article.uuid}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-mono font-medium">
                                                    {article.cod_article_las}
                                                </p>
                                                {article.article_descr && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {article.article_descr}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {(!palletType.articles || palletType.articles.length === 0) && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>
                                Nessun articolo associato a questo tipo di
                                pallet.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
