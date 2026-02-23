export type LocaleCode = 'it' | 'es' | 'en';

/**
 * Opciones de idioma: etiquetas en nombre nativo (Italiano, Español, English).
 * No se traducen al idioma actual: así el usuario reconoce su idioma aunque la UI esté en otro.
 * Ver recomendaciones i18n (p. ej. W3C, Material Design).
 */
export const LOCALES: { code: LocaleCode; label: string }[] = [
    { code: 'it', label: 'Italiano' },
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English (GB)' },
];
