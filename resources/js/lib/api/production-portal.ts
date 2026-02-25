const API_BASE_URL = '/api/production';

/** Error with translation key for i18n */
export class ProductionPortalError extends Error {
    constructor(
        message: string,
        public readonly translationKey: string,
        options?: ErrorOptions,
    ) {
        super(message, options);
        this.name = 'ProductionPortalError';
    }
}

declare global {
    interface Window {
        __PRODUCTION_PORTAL_TOKEN__?: string | null;
    }
}

/**
 * Get token from session (passed from backend)
 */
function getToken(): string | null {
    return window.__PRODUCTION_PORTAL_TOKEN__ ?? null;
}

/**
 * Make API call to Production Portal
 */
export async function callProductionApi(
    endpoint: string,
    data: Record<string, unknown> = {},
    method: 'GET' | 'POST' = 'POST',
): Promise<unknown> {
    const token = getToken();

    if (!token) {
        throw new Error('No token available');
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
            body: JSON.stringify({ ...data, token }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new ProductionPortalError(
                result.error || 'production_portal.error_request',
                'production_portal.error_request',
            );
        }

        return result;
    } catch (error: unknown) {
        if (error instanceof ProductionPortalError) {
            throw error;
        }
        if (error instanceof Error && error.message) {
            throw error;
        }
        throw new ProductionPortalError(
            'production_portal.error_connection',
            'production_portal.error_connection',
            { cause: error },
        );
    }
}

/**
 * Add pallet quantity
 */
export async function addPalletQuantity(
    orderUuid: string,
    token: string,
): Promise<unknown> {
    return callProductionApi('/add-pallet-quantity', {
        order_uuid: orderUuid,
        token,
    });
}

/**
 * Add manual quantity
 */
export async function addManualQuantity(
    orderUuid: string,
    quantity: number,
    token: string,
): Promise<unknown> {
    return callProductionApi('/add-manual-quantity', {
        order_uuid: orderUuid,
        quantity,
        token,
    });
}

/**
 * Suspend order
 */
export async function suspendOrder(
    orderUuid: string,
    token: string,
): Promise<unknown> {
    return callProductionApi('/suspend-order', {
        order_uuid: orderUuid,
        token,
    });
}

/**
 * Confirm autocontrollo
 */
export async function confirmAutocontrollo(
    orderUuid: string,
    token: string,
): Promise<unknown> {
    return callProductionApi('/confirm-autocontrollo', {
        order_uuid: orderUuid,
        token,
    });
}

/**
 * Get employee order list
 */
export async function getEmployeeOrderList(token: string): Promise<unknown> {
    return callProductionApi('/employee-order-list', {
        token,
    });
}

/**
 * Get order info
 */
export async function getOrderInfo(
    orderUuid: string,
    token: string,
): Promise<unknown> {
    return callProductionApi('/get-info', {
        order_uuid: orderUuid,
        token,
    });
}
