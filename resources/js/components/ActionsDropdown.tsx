import { Button } from '#app/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu';
import { useTranslations } from '#app/hooks/use-translations';
import { Link } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';

type ActionsDropdownProps = {
    viewHref?: string;
    editHref?: string;
    onDelete?: () => void;
    extraItems?: ReactNode;
};

/**
 * Menú de acciones estándar para columnas "Azioni" en tablas Index.
 * Orden: Visualizza → Modifica → extraItems → Elimina (destructivo).
 */
export function ActionsDropdown({
    viewHref,
    editHref,
    onDelete,
    extraItems,
}: ActionsDropdownProps) {
    const { t } = useTranslations();
    const hasAnyAction =
        Boolean(viewHref) === true ||
        Boolean(editHref) === true ||
        Boolean(extraItems) === true ||
        Boolean(onDelete) === true;

    if (hasAnyAction !== true) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t('common.open_actions_menu')}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {viewHref !== null &&
                    viewHref !== undefined &&
                    viewHref !== '' && (
                        <DropdownMenuItem asChild>
                            <Link href={viewHref}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('common.view')}
                            </Link>
                        </DropdownMenuItem>
                    )}
                {editHref !== null &&
                    editHref !== undefined &&
                    editHref !== '' && (
                        <DropdownMenuItem asChild>
                            <Link href={editHref}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </DropdownMenuItem>
                    )}

                {extraItems !== null && extraItems !== undefined && extraItems}

                {Boolean(onDelete) === true && (
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => {
                            e.preventDefault();
                            if (typeof onDelete === 'function') {
                                onDelete();
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
