import { Button } from '@/components/ui/button';
import { AlertCircleIcon } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

/**
 * Error Boundary per catturare errori di rendering nell'albero React (React 19).
 * In React 19 gli Error Boundary restano class component; questo componente
 * mostra una UI di fallback invece della schermata bianca.
 */
export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6">
                        <AlertCircleIcon className="mx-auto mb-3 size-12 text-destructive" />
                        <h2 className="mb-2 text-lg font-semibold">
                            Qualcosa è andato storto.
                        </h2>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Si è verificato un errore imprevisto. Puoi provare a
                            ricaricare la pagina.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Ricarica la pagina
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
