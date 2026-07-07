export interface CurrencyRate {
    currencyCode: string;
    rate: number;
    lastUpdated: string;
}

const BACKEND_URL = 'http://localhost:8080/api/rates';

export const fetchCurrencyRates = async (): Promise<CurrencyRate[]> => {
    const response = await fetch(BACKEND_URL);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as CurrencyRate[];
};