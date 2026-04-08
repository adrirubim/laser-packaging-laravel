// Components
import TextLink from '#app/components/text-link';
import { Button } from '#app/components/ui/button';
import { Spinner } from '#app/components/ui/spinner';
import { useTranslations } from '#app/hooks/use-translations';
import AuthLayout from '#app/layouts/auth-layout';
import { logout } from '#app/routes';
import { send } from '#app/routes/verification/index';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslations();
    return (
        <AuthLayout
            title={t('auth.verify_email.title')}
            description={t('auth.verify_email.description')}
        >
            <Head title={t('auth.verify_email.page_title')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t('auth.verify_email.link_sent')}
                </div>
            )}

            <Form
                action={send.url()}
                method="post"
                className="space-y-6 text-center"
            >
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            {t('auth.verify_email.resend')}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            {t('auth.verify_email.logout')}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
