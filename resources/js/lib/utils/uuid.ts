/**
 * Genera un UUID v4 válido utilizando una fuente de aleatoriedad
 * criptográficamente segura cuando está disponible.
 *
 * @returns {string} UUID v4
 */
export function generateUUID(): string {
    const globalCrypto = (typeof globalThis !== 'undefined' &&
        (globalThis as unknown as { crypto?: Crypto }).crypto) as
        | (Crypto & { randomUUID?: () => string; getRandomValues?: (<T extends ArrayBufferView | null>(array: T) => T) })
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

    // Último recurso: intentar usar el módulo 'crypto' de Node.js si está disponible.
    let nodeCrypto: {
        randomUUID?: () => string;
        randomBytes?: (size: number) => Uint8Array | Buffer;
    } | undefined;

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        nodeCrypto = require('crypto');
    } catch {
        nodeCrypto = undefined;
    }

    if (nodeCrypto) {
        if (typeof nodeCrypto.randomUUID === 'function') {
            return nodeCrypto.randomUUID();
        }

        if (typeof nodeCrypto.randomBytes === 'function') {
            const nodeBytes = nodeCrypto.randomBytes(16);
            const bytes = nodeBytes instanceof Uint8Array ? nodeBytes : new Uint8Array(nodeBytes);

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
    }

    // Si no hay ninguna fuente de aleatoriedad criptográficamente segura disponible,
    // lanza un error en lugar de volver a un algoritmo inseguro basado en Math.random.
    throw new Error(
        'No se pudo generar un UUID v4 de forma criptográficamente segura: no se encontró ninguna API de criptografía disponible.'
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
