import { update } from '@/routes/password/index';
import { Form, Head } from '@inertiajs/react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslations();
    const confirmationRef = useRef<HTMLInputElement>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const checkPasswordMatch = () => {
        const p = document.getElementById(
            'password',
        ) as HTMLInputElement | null;
        const c = confirmationRef.current;
        setPasswordMismatch(
            !!(p && c && c.value.length > 0 && p.value !== c.value),
        );
    };

    return (
        <AuthLayout
            title={t('auth.reset_password.title')}
            description={t('auth.reset_password.description')}
        >
            <Head title={t('auth.reset_password.page_title')} />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {t('auth.reset_password.email_label')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {t('auth.reset_password.password_label')}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder={t(
                                    'auth.reset_password.password_placeholder',
                                )}
                                onBlur={checkPasswordMatch}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {t('auth.reset_password.confirm_label')}
                            </Label>
                            <PasswordInput
                                ref={confirmationRef}
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder={t(
                                    'auth.reset_password.confirm_placeholder',
                                )}
                                onBlur={checkPasswordMatch}
                            />
                            {passwordMismatch && (
                                <p className="text-sm text-destructive">
                                    {t('auth.reset_password.mismatch')}
                                </p>
                            )}
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            {t('auth.reset_password.submit')}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
