import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { type NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({
    items = [],
    groups = [],
}: {
    items?: NavItem[];
    groups?: NavGroup[];
}) {
    const { urlIsActive } = useActiveUrl();

    return (
        <>
            {groups.map((group) => {
                const hasActiveItem = group.items.some((item) =>
                    urlIsActive(item.href),
                );

                return (
                    <SidebarGroup key={group.title} className="px-2 py-0">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Collapsible defaultOpen={hasActiveItem}>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            className="w-full justify-between"
                                            tooltip={{ children: group.title }}
                                        >
                                            <span>{group.title}</span>
                                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {group.items.map((item) => (
                                                <SidebarMenuSubItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={urlIsActive(
                                                            item.href,
                                                        )}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            prefetch
                                                        >
                                                            {item.icon && (
                                                                <item.icon />
                                                            )}
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}

            {items.length > 0 && (
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={urlIsActive(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}
        </>
    );
}
