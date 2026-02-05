import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
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
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
};

type PalletizationInstruction = {
    uuid: string;
    code: string;
    number?: string | null;
    length_cm?: number | null;
    depth_cm?: number | null;
    height_cm?: number | null;
    volume_dmc?: number | null;
    plan_packaging?: number | null;
    pallet_plans?: number | null;
    qty_pallet?: number | null;
    units_per_neck?: number | null;
    units_pallet?: number | null;
    interlayer_every_floors?: number | null;
    filename?: string | null;
    articles?: Article[];
};

type PalletizationInstructionsShowProps = {
    instruction: PalletizationInstruction;
};

export default function PalletizationInstructionsShow({
    instruction,
}: PalletizationInstructionsShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Articoli',
            href: articles.index().url,
        },
        {
            title: 'Istruzioni di Pallettizzazione',
            href: articles.palletizationInstructions.index().url,
        },
        {
            title: instruction.code + (instruction.number || ''),
            href: articles.palletizationInstructions.show({
                palletizationInstruction: instruction.uuid,
            }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            articles.palletizationInstructions.destroy({
                palletizationInstruction: instruction.uuid,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(
                        articles.palletizationInstructions.index().url,
                    );
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Istruzione ${instruction.code}${instruction.number || ''}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {instruction.code}
                            {instruction.number || ''}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Dettagli dell'istruzione di pallettizzazione
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={
                                articles.palletizationInstructions.edit({
                                    palletizationInstruction: instruction.uuid,
                                }).url
                            }
                        >
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Modifica
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                        </Button>
                        <Link
                            href={
                                articles.palletizationInstructions.index().url
                            }
                        >
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Indietro
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni Generali</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Codice
                                </Label>
                                <p className="mt-1 text-sm font-medium">
                                    {instruction.code}
                                </p>
                            </div>
                            {instruction.number && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Numero
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.number}
                                    </p>
                                </div>
                            )}
                            {instruction.filename && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Filename
                                    </Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-sm font-medium">
                                            {instruction.filename}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                window.location.href =
                                                    articles.palletizationInstructions.download(
                                                        {
                                                            palletizationInstruction:
                                                                instruction.uuid,
                                                        },
                                                    ).url;
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dimensioni Collo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {instruction.length_cm && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Larghezza
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.length_cm} cm
                                    </p>
                                </div>
                            )}
                            {instruction.depth_cm && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Profondità
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.depth_cm} cm
                                    </p>
                                </div>
                            )}
                            {instruction.height_cm && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Altezza
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.height_cm} cm
                                    </p>
                                </div>
                            )}
                            {instruction.volume_dmc && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Volume
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.volume_dmc} dm³
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Configurazione Pallet</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {instruction.plan_packaging && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Colli per piano
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.plan_packaging}
                                    </p>
                                </div>
                            )}
                            {instruction.pallet_plans && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Piani per pallet
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.pallet_plans}
                                    </p>
                                </div>
                            )}
                            {instruction.qty_pallet && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Colli per pallet
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.qty_pallet}
                                    </p>
                                </div>
                            )}
                            {instruction.units_per_neck && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Unità per collo
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.units_per_neck}
                                    </p>
                                </div>
                            )}
                            {instruction.units_pallet && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Unità per pallet
                                    </Label>
                                    <p className="mt-1 text-sm font-medium">
                                        {instruction.units_pallet}
                                    </p>
                                </div>
                            )}
                            {instruction.interlayer_every_floors !== null &&
                                instruction.interlayer_every_floors !==
                                    undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Interfalda ogni
                                        </Label>
                                        <p className="mt-1 text-sm font-medium">
                                            {
                                                instruction.interlayer_every_floors
                                            }{' '}
                                            piani
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {instruction.articles &&
                        instruction.articles.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Articoli Associati</CardTitle>
                                    <CardDescription>
                                        Articoli che utilizzano questa
                                        istruzione
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {instruction.articles.map((article) => (
                                            <Link
                                                key={article.uuid}
                                                href={
                                                    articles.show({
                                                        article: article.uuid,
                                                    }).url
                                                }
                                                className="block rounded-lg border p-2 transition-colors hover:bg-muted/50"
                                            >
                                                <p className="text-sm font-medium">
                                                    {article.cod_article_las}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>

                <ConfirmDeleteDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    title="Conferma eliminazione"
                    description={
                        <>
                            Sei sicuro di voler eliminare l'istruzione{' '}
                            <strong>
                                {instruction.code}
                                {instruction.number || ''}
                            </strong>
                            ?
                            <br />
                            <br />
                            Questa azione non può essere annullata. L'istruzione
                            verrà eliminata definitivamente.
                        </>
                    }
                />
            </div>
        </AppLayout>
    );
}
