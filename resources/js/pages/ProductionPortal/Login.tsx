import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import productionPortal from '@/routes/production-portal';
import { Head, useForm } from '@inertiajs/react';
import { LogIn, ScanLine } from 'lucide-react';
import { useState } from 'react';

type LoginProps = {
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ProductionPortalLogin({
    errors: serverErrors,
    flash,
}: LoginProps) {
    const [loginMethod, setLoginMethod] = useState<'credentials' | 'ean'>(
        'credentials',
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const credentialsForm = useForm({
        matriculation_number: '',
        password: '',
    });

    const eanForm = useForm({
        employee_number: '',
        order_number: '',
    });

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        credentialsForm.post(productionPortal.authenticate().url, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleEanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        eanForm.post(productionPortal.authenticate().url, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
            <Head title="Portale di Produzione - Login" />

            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <LogIn className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                        Portale di Produzione
                    </CardTitle>
                    <CardDescription>
                        Accedi per entrare nel portale
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Tabs */}
                    <div className="mb-6 flex gap-2 border-b">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('credentials')}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                loginMethod === 'credentials'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Utente e Password
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('ean')}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                loginMethod === 'ean'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <ScanLine className="mr-1 inline h-4 w-4" />
                            Codice EAN
                        </button>
                    </div>

                    {/* Error/Success Messages */}
                    {flash?.error && (
                        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                            {flash.error}
                        </div>
                    )}
                    {flash?.success && (
                        <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                            {flash.success}
                        </div>
                    )}

                    {/* Credentials Form */}
                    {loginMethod === 'credentials' && (
                        <form
                            onSubmit={handleCredentialsSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="matriculation_number">
                                    Numero di Matricola
                                </Label>
                                <Input
                                    id="matriculation_number"
                                    type="text"
                                    value={
                                        credentialsForm.data
                                            .matriculation_number
                                    }
                                    onChange={(e) =>
                                        credentialsForm.setData(
                                            'matriculation_number',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    autoFocus
                                    placeholder="Es: EMP001"
                                />
                                <InputError
                                    message={
                                        credentialsForm.errors
                                            .matriculation_number ||
                                        serverErrors?.matriculation_number
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={credentialsForm.data.password}
                                    onChange={(e) =>
                                        credentialsForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="••••••••"
                                />
                                <InputError
                                    message={
                                        credentialsForm.errors.password ||
                                        serverErrors?.password
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    isSubmitting || credentialsForm.processing
                                }
                            >
                                {isSubmitting || credentialsForm.processing
                                    ? 'Accesso in corso...'
                                    : 'Accedi'}
                            </Button>
                        </form>
                    )}

                    {/* EAN Form */}
                    {loginMethod === 'ean' && (
                        <form onSubmit={handleEanSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_number">
                                    Codice EAN Dipendente
                                </Label>
                                <Input
                                    id="employee_number"
                                    type="text"
                                    value={eanForm.data.employee_number}
                                    onChange={(e) =>
                                        eanForm.setData(
                                            'employee_number',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    autoFocus
                                    placeholder="Scansiona codice EAN del dipendente"
                                />
                                <InputError
                                    message={
                                        eanForm.errors.employee_number ||
                                        serverErrors?.employee_number
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order_number">
                                    Codice EAN Ordine
                                </Label>
                                <Input
                                    id="order_number"
                                    type="text"
                                    value={eanForm.data.order_number}
                                    onChange={(e) =>
                                        eanForm.setData(
                                            'order_number',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="Scansiona codice EAN dell'ordine"
                                />
                                <InputError
                                    message={
                                        eanForm.errors.order_number ||
                                        serverErrors?.order_number
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting || eanForm.processing}
                            >
                                {isSubmitting || eanForm.processing
                                    ? 'Autenticazione...'
                                    : 'Autentica con EAN'}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
