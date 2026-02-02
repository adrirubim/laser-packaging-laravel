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
import machineryRoutes from '@/routes/machinery';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

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
    articles?: Article[];
};

type MachineryShowProps = {
    machinery: Machinery;
};

export default function MachineryShow({ machinery }: MachineryShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Macchinari',
            href: machineryRoutes.index().url,
        },
        {
            title: machinery.cod,
            href: machineryRoutes.show({ machinery: machinery.uuid }).url,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                'Sei sicuro di voler eliminare questo macchinario? Questa azione non può essere annullata.',
            )
        ) {
            router.delete(
                machineryRoutes.destroy({ machinery: machinery.uuid }).url,
                {
                    onSuccess: () => {
                        router.visit(machineryRoutes.index().url);
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Macchinario ${machinery.cod}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {machinery.description}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice: {machinery.cod}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    machineryRoutes.edit({
                                        machinery: machinery.uuid,
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
                            <CardTitle>Dettagli Macchinario</CardTitle>
                            <CardDescription>
                                Informazioni di base sul macchinario
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.id}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </Label>
                                <p className="font-mono text-lg text-xs font-semibold">
                                    {machinery.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Codice
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {machinery.cod}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Descrizione
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.description}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Parametro
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.parameter || (
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Tipo Valore
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.value_type ? (
                                        `ID: ${machinery.value_type.id}`
                                    ) : (
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {machinery.articles && machinery.articles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Articoli Associati</CardTitle>
                                <CardDescription>
                                    Articoli che utilizzano questo macchinario
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {machinery.articles.map((article) => (
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

                {(!machinery.articles || machinery.articles.length === 0) && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>
                                Nessun articolo associato a questo macchinario.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
