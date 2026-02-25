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
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import * as contractsRoutes from '@/routes/employees/contracts/index';
import employees from '@/routes/employees/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

type Contract = {
    uuid: string;
    start_date: string;
    end_date?: string | null;
    pay_level?: number | null;
    notes?: string | null;
};

type Employee = {
    id: number;
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
    portal_enabled: boolean;
    contracts?: Contract[];
};

type EmployeesShowProps = {
    employee: Employee;
};

export default function EmployeesShow({ employee }: EmployeesShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [downloadingBarcode, setDownloadingBarcode] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.personale'),
            href: employees.index().url,
        },
        {
            title: employee.matriculation_number,
            href: employees.show({ employee: employee.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        if (isDeleting) return;

        setIsDeleting(true);

        router.delete(employees.destroy({ employee: employee.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(employees.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleDownloadBarcode = () => {
        if (downloadingBarcode) return;

        setDownloadingBarcode(true);

        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            iframe.src = employees.downloadBarcode({
                employee: employee.uuid,
            }).url;

            document.body.appendChild(iframe);

            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingBarcode(false);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare il barcode:', error);
            setDownloadingBarcode(false);
            alert(
                error instanceof Error
                    ? t('employees.show.barcode_download_error', {
                          message: error.message,
                      })
                    : t('employees.show.barcode_download_error_fallback'),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('employees.show.page_title', {
                    matriculation: employee.matriculation_number,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {employee.name} {employee.surname}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('employees.show.matriculation_label')}:{' '}
                            {employee.matriculation_number}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownloadBarcode();
                            }}
                            disabled={downloadingBarcode}
                            aria-label={t(
                                'employees.show.download_barcode_aria',
                            )}
                        >
                            {downloadingBarcode ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('employees.show.downloading_barcode')}
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('employees.show.download_barcode')}
                                </>
                            )}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={contractsRoutes.index().url}>
                                <FileText className="mr-2 h-4 w-4" />
                                {t('employees.show.manage_contracts')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    employees.edit({ employee: employee.uuid })
                                        .url
                                }
                            >
                                {t('employees.show.edit_label')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            {t('employees.show.delete_label')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('employees.show.card_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('employees.show.card_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('employees.show.label_matriculation')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {employee.matriculation_number}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('employees.show.label_name')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {employee.name}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('employees.show.label_surname')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {employee.surname}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('employees.show.label_portal_access')}
                                </Label>
                                <p>
                                    {employee.portal_enabled ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                            {t(
                                                'employees.index.portal_enabled',
                                            )}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                            {t(
                                                'employees.index.portal_disabled',
                                            )}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {employee.contracts && employee.contracts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('employees.show.contracts_card_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'employees.show.contracts_card_description',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {employee.contracts.map((contract) => (
                                        <div
                                            key={contract.uuid}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {new Date(
                                                        contract.start_date,
                                                    ).toLocaleDateString()}
                                                    {contract.end_date &&
                                                        ` - ${new Date(contract.end_date).toLocaleDateString()}`}
                                                </p>
                                                {contract.pay_level && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {t(
                                                            'employees.show.pay_level_label',
                                                        )}
                                                        : {contract.pay_level}
                                                    </p>
                                                )}
                                                {contract.notes && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {contract.notes}
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
            </div>

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('employees.show.delete_title')}
                description={t('employees.show.delete_description')}
                itemName={`${employee.name} ${employee.surname} (${t('employees.show.matriculation_label')}: ${employee.matriculation_number})`}
            />
        </AppLayout>
    );
}
