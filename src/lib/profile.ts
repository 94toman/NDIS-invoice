export type Profile = {
	seller: {
		name: string;
		address1: string;
		address2: string;
		country: string;
		abn: string;
		email: string;
		bankName: string;
		bankBsb: string;
		bankAccount: string;
	};
};

const KEY = 'ndis_invoice_profile_v1';

export function saveProfile(p: Profile) {
	localStorage.setItem(KEY, JSON.stringify(p));
}

export function loadProfile(): Profile | null {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as Profile) : null;
	} catch {
		return null;
	}
}

export function clearProfile() {
	localStorage.removeItem(KEY);
}

export function emptyProfile(): Profile {
	return {
		seller: {
			name: '',
			address1: '',
			address2: '',
			country: 'Australia',
			abn: '',
			email: '',
			bankName: '',
			bankBsb: '',
			bankAccount: '',
		},
	};
}
