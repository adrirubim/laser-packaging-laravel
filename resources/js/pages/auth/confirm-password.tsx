import InputError from '#app/components/input-error';
import { Button } from '#app/components/ui/button';
import { Label } from '#app/components/ui/label';
import { PasswordInput } from '#app/components/ui/password-input';
import { Spinner } from '#app/components/ui/spinner';
import { useTranslations } from '#app/hooks/use-translations';
import AuthLayout from '#app/layouts/auth-layout';
import { store } from '#app/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { t } = useTranslations();
    return (
        <AuthLayout
            title={t('auth.confirm_password.title')}
            description={t('auth.confirm_password.description')}
        >
            <Head title={t('auth.confirm_password.page_title')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {t('auth.confirm_password.password_label')}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder={t(
                                    'auth.confirm_password.password_placeholder',
                                )}
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.confirm_password.submit')}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
