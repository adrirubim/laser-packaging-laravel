import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

type IndexHeaderProps = {
    title: string;
    subtitle: string;
    createHref: string;
    createLabel: string;
};

/**
 * Cabecera estándar para páginas Index:
 * - Título (h1)
 * - Subtítulo descriptivo
 * - Botón "Nuovo/Nuova {Entità}" alineado a la derecha.
 */
export function IndexHeader({
    title,
    subtitle,
    createHref,
    createLabel,
}: IndexHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <Link
                href={createHref}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
                <Plus className="mr-2 h-4 w-4" />
                {createLabel}
            </Link>
        </div>
    );
}
