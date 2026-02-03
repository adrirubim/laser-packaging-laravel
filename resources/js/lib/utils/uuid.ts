/**
 * Genera un UUID v4 válido usando APIs criptográficas.
 * Requiere globalThis.crypto (navegador o Node 19+).
 * @returns {string} UUID v4
 */
export function generateUUID(): string {
    const crypto = globalThis.crypto;
    if (!crypto) {
        throw new Error(
            'generateUUID requiere globalThis.crypto (navegador o Node 19+).',
        );
    }
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6]! & 0x0f) | 0x40;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;
    const hex = [...bytes]
        .map((b) => b!.toString(16).padStart(2, '0'))
        .join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Valida si una cadena es un UUID válido
 * @param {string} uuid - Cadena a validar
 * @returns {boolean} true si es un UUID válido
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
