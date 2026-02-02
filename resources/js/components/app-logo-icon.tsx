import { Package } from 'lucide-react';
import { ComponentProps } from 'react';

export default function AppLogoIcon(props: ComponentProps<typeof Package>) {
    return <Package {...props} />;
}
