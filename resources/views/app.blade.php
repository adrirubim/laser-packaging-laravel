<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- JavaScript para establecer el favicon correcto ANTES de que se carguen otros favicons --}}
        <script>
            (function() {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const targetHref = prefersDark ? '/favicon-dark.ico' : '/favicon-light.ico';
                
                // Crear favicon inmediatamente con el tema correcto
                const favicon = document.createElement('link');
                favicon.rel = 'icon';
                favicon.href = targetHref;
                favicon.type = 'image/x-icon';
                document.head.appendChild(favicon);
                
                // Función para actualizar el favicon cuando cambie el tema
                function updateFavicon() {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const targetHref = prefersDark ? '/favicon-dark.ico' : '/favicon-light.ico';
                    const links = document.querySelectorAll('link[rel="icon"]');
                    links.forEach(link => {
                        if (!link.media) {
                            link.href = targetHref;
                        }
                    });
                }
                
                // Escuchar cambios en el tema del sistema
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
            })();
        </script>
        
        {{-- Favicons con media queries como respaldo para navegadores que los soportan --}}
        <link rel="icon" href="/favicon-dark.ico" sizes="any" media="(prefers-color-scheme: dark)">
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
        <link rel="icon" href="/favicon-light.ico" sizes="any" media="(prefers-color-scheme: light)">
        <link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
