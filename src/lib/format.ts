import { format } from 'date-fns';

export const money = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
});

export function formatMoney(n: number) {
	return money.format(Number.isFinite(n) ? n : 0);
}

// 02/09/2025
export function formatHeaderDate(iso: string) {
	return format(new Date(iso), 'dd/MM/yyyy');
}

// 02 Sep 2025
export function formatDescDate(iso: string) {
	return format(new Date(iso), 'dd MMM yyyy');
}
