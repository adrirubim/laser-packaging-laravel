import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import { PasswordStrengthIndicator } from '@/components/password-strength';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { edit } from '@/routes/user-password/index';

export default function Password() {
    const { t } = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const confirmationRef = useRef<HTMLInputElement>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [newPasswordForStrength, setNewPasswordForStrength] = useState('');

    const checkPasswordMatch = () => {
        const p = document.getElementById(
            'password',
        ) as HTMLInputElement | null;
        const c = confirmationRef.current;
        setPasswordMismatch(
            !!(p && c && c.value.length > 0 && p.value !== c.value),
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('settings.password.title'), href: edit().url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.password.title')} />

            <h1 className="sr-only">{t('settings.password.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.password.heading')}
                        description={t('settings.password.description')}
                    />

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        {t('settings.password.current_label')}
                                    </Label>

                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                        placeholder={t(
                                            'settings.password.current_placeholder',
                                        )}
                                    />

                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        {t('settings.password.new_label')}
                                    </Label>

                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder={t(
                                            'settings.password.new_placeholder',
                                        )}
                                        onBlur={checkPasswordMatch}
                                        onChange={(e) =>
                                            setNewPasswordForStrength(
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <PasswordStrengthIndicator
                                        password={newPasswordForStrength}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        {t('settings.password.confirm_label')}
                                    </Label>

                                    <PasswordInput
                                        ref={confirmationRef}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder={t(
                                            'settings.password.confirm_placeholder',
                                        )}
                                        onBlur={checkPasswordMatch}
                                    />

                                    {passwordMismatch && (
                                        <p className="text-sm text-destructive">
                                            {t(
                                                'auth.register.password_mismatch',
                                            )}
                                        </p>
                                    )}

                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                    >
                                        {t('settings.password.submit')}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            {t('settings.saved')}
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
