import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { destroy, index as sessionsIndex } from '@/routes/sessions/index';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

type SessionItem = {
    id: string;
    ip_address: string | null;
    user_agent: string | null;
    last_activity: number;
    is_current: boolean;
};

export default function Sessions({
    sessions,
    lastLoginAt,
}: {
    sessions: SessionItem[];
    lastLoginAt?: string | null;
}) {
    const { t } = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('settings.sessions.title'), href: sessionsIndex().url },
    ];

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const getDeviceInfo = (ua: string | null) => {
        if (!ua) return t('settings.sessions.current_session');
        if (ua.includes('Mobile') && !ua.includes('iPad')) return 'Mobile';
        if (ua.includes('iPad') || ua.includes('Tablet')) return 'Tablet';
        return 'Desktop';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.sessions.title')} />

            <h1 className="sr-only">{t('settings.sessions.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.sessions.heading')}
                        description={t('settings.sessions.description')}
                    />

                    {lastLoginAt && (
                        <p className="text-sm text-muted-foreground">
                            {t('settings.sessions.last_login', {
                                date: new Date(lastLoginAt).toLocaleString(
                                    undefined,
                                    {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    },
                                ),
                            })}
                        </p>
                    )}

                    <ul className="space-y-4" role="list">
                        {sessions.map((session) => (
                            <li
                                key={session.id}
                                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-medium">
                                        {getDeviceInfo(session.user_agent)}
                                        {session.is_current && (
                                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                (
                                                {t(
                                                    'settings.sessions.current_session',
                                                )}
                                                )
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {session.ip_address ?? '—'} ·{' '}
                                        {formatDate(session.last_activity)}
                                    </p>
                                </div>
                                {!session.is_current && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                {t('settings.sessions.revoke')}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>
                                                {t(
                                                    'settings.sessions.revoke_confirm_title',
                                                )}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t(
                                                    'settings.sessions.revoke_confirm_description',
                                                )}
                                            </DialogDescription>
                                            <Form
                                                action={destroy.url({
                                                    session: session.id,
                                                })}
                                                method="post"
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                                onError={() =>
                                                    passwordInput.current?.focus()
                                                }
                                                resetOnSuccess
                                                className="space-y-6"
                                            >
                                                {({
                                                    resetAndClearErrors,
                                                    processing,
                                                    errors,
                                                }) => (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            name="_method"
                                                            value="DELETE"
                                                        />
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={`password-${session.id}`}
                                                                className="sr-only"
                                                            >
                                                                {t(
                                                                    'settings.delete_account.password_label',
                                                                )}
                                                            </Label>
                                                            <Input
                                                                id={`password-${session.id}`}
                                                                type="password"
                                                                name="password"
                                                                ref={
                                                                    session ===
                                                                    sessions[0]
                                                                        ? passwordInput
                                                                        : undefined
                                                                }
                                                                placeholder={t(
                                                                    'settings.delete_account.password_placeholder',
                                                                )}
                                                                autoComplete="current-password"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.password
                                                                }
                                                            />
                                                        </div>
                                                        <DialogFooter className="gap-2">
                                                            <DialogClose
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="secondary"
                                                                    type="button"
                                                                    onClick={() =>
                                                                        resetAndClearErrors()
                                                                    }
                                                                >
                                                                    {t(
                                                                        'common.cancel',
                                                                    )}
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                type="submit"
                                                                variant="destructive"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                {t(
                                                                    'settings.sessions.revoke',
                                                                )}
                                                            </Button>
                                                        </DialogFooter>
                                                    </>
                                                )}
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
