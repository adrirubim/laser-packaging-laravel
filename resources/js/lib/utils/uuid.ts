import * as nodeCrypto from 'crypto';

/**
 * Genera un UUID v4 válido utilizando una fuente de aleatoriedad
 * criptográficamente segura cuando está disponible.
 *
 * @returns {string} UUID v4
 */
export function generateUUID(): string {
    const globalCrypto = (typeof globalThis !== 'undefined' &&
        (globalThis as unknown as { crypto?: Crypto }).crypto) as
        | (Crypto & { randomUUID?: () => string })
        | undefined;

    // Si el entorno proporciona crypto.randomUUID (navegadores modernos, Node recientes), úsalo directamente.
    if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
        return globalCrypto.randomUUID();
    }

    // Si hay crypto.getRandomValues, genera 16 bytes aleatorios y fórmalos como UUID v4.
    if (globalCrypto && typeof globalCrypto.getRandomValues === 'function') {
        const bytes = new Uint8Array(16);
        globalCrypto.getRandomValues(bytes);

        // Establecer versión (4) y variante (RFC4122)
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // versión 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante 10xxxxxx

        const hex: string[] = [];
        for (let i = 0; i < bytes.length; i++) {
            const h = bytes[i].toString(16).padStart(2, '0');
            hex.push(h);
        }

        return (
            hex[0] +
            hex[1] +
            hex[2] +
            hex[3] +
            '-' +
            hex[4] +
            hex[5] +
            '-' +
            hex[6] +
            hex[7] +
            '-' +
            hex[8] +
            hex[9] +
            '-' +
            hex[10] +
            hex[11] +
            hex[12] +
            hex[13] +
            hex[14] +
            hex[15]
        );
    }

    // Fallback seguro para entornos Node.js que no exponen globalThis.crypto.
    if (typeof nodeCrypto.randomUUID === 'function') {
        return nodeCrypto.randomUUID();
    }

    // Último recurso seguro en Node.js: usar randomBytes y formatear como UUID v4.
    if (typeof nodeCrypto.randomBytes === 'function') {
        const bytes = nodeCrypto.randomBytes(16);

        // Establecer versión (4) y variante (RFC4122)
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // versión 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante 10xxxxxx

        const hex: string[] = [];
        for (let i = 0; i < bytes.length; i++) {
            const h = bytes[i].toString(16).padStart(2, '0');
            hex.push(h);
        }

        return (
            hex[0] +
            hex[1] +
            hex[2] +
            hex[3] +
            '-' +
            hex[4] +
            hex[5] +
            '-' +
            hex[6] +
            hex[7] +
            '-' +
            hex[8] +
            hex[9] +
            '-' +
            hex[10] +
            hex[11] +
            hex[12] +
            hex[13] +
            hex[14] +
            hex[15]
        );
    }

    // Si llegamos aquí, no hay ninguna fuente de aleatoriedad criptográficamente segura disponible.
    // Lanzamos un error en lugar de caer en Math.random(), que no es seguro.
    throw new Error(
        'No se pudo generar un UUID de forma segura: no hay API de criptografía disponible.'
    );
}

/**
 * Valida si una cadena es un UUID v4 válido
 * @param {string} uuid - Cadena a validar
 * @returns {boolean} true si es un UUID válido
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
