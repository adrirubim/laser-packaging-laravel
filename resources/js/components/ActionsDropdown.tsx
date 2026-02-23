import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/use-translations';
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
    const hasAnyAction = viewHref || editHref || extraItems || onDelete;

    if (!hasAnyAction) {
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
                {viewHref && (
                    <DropdownMenuItem asChild>
                        <Link href={viewHref}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view')}
                        </Link>
                    </DropdownMenuItem>
                )}
                {editHref && (
                    <DropdownMenuItem asChild>
                        <Link href={editHref}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                        </Link>
                    </DropdownMenuItem>
                )}

                {extraItems}

                {onDelete && (
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => {
                            e.preventDefault();
                            onDelete();
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
