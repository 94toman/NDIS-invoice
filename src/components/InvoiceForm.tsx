'use client';
import { useEffect, useMemo, useState } from 'react';
import { DayEntry, InvoiceMeta, Seller } from '@/lib/types';
import { emptyProfile, loadProfile, saveProfile, clearProfile, type Profile } from '@/lib/profile';
import { formatMoney } from '@/lib/format';

const todayIso = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

type Props = {
	onChange: (meta: InvoiceMeta, seller: Seller, days: DayEntry[]) => void;
};

export default function InvoiceForm({ onChange }: Props) {
	const [profile, setProfile] = useState<Profile>(emptyProfile());
	const [meta, setMeta] = useState<InvoiceMeta>({
		invoiceNumber: 'INV-000001',
		invoiceDate: todayIso(),
		dueDate: todayIso(),
		terms: 'Due on Receipt',
		subject: 'NDIS Support Work',
		clientName: '',
		clientNDIS: '',
	});
	const [days, setDays] = useState<DayEntry[]>([
		{ id: uid(), date: todayIso(), hours: 0, hourlyRate: 60, km: 0, kmRate: 1 },
	]);

	useEffect(() => {
		const p = loadProfile();
		if (p) setProfile(p);
	}, []);

	useEffect(() => {
		onChange(meta, profile.seller, days);
	}, [meta, profile, days, onChange]);

	const totals = useMemo(() => {
		const service = days.reduce((s, d) => s + d.hours * d.hourlyRate, 0);
		const travel = days.reduce((s, d) => s + d.km * d.kmRate, 0);
		return { service, travel, total: service + travel };
	}, [days]);

	function updateDay(id: string, patch: Partial<DayEntry>) {
		setDays((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
	}

	function addDay() {
		setDays((ds) => [...ds, { id: uid(), date: todayIso(), hours: 0, hourlyRate: 60, km: 0, kmRate: 1 }]);
	}

	function removeDay(id: string) {
		setDays((ds) => ds.filter((d) => d.id !== id));
	}

	function valid() {
		const s = profile.seller;
		return (
			s.name &&
			s.abn &&
			s.email &&
			s.bankName &&
			s.bankBsb &&
			s.bankAccount &&
			meta.clientName &&
			meta.clientNDIS &&
			days.length > 0
		);
	}

	return (
		<div className="form">
			<fieldset>
				<legend>Seller profile</legend>
				<div className="grid">
					<label>
						Name
						<input
							value={profile.seller.name}
							placeholder="Your Business Name"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, name: e.target.value } }))
							}
						/>
					</label>
					<label>
						ABN
						<input
							value={profile.seller.abn}
							placeholder="ABN 12345678901"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, abn: e.target.value } }))
							}
						/>
					</label>
					<label>
						Email
						<input
							value={profile.seller.email}
							placeholder="your.email@example.com"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, email: e.target.value } }))
							}
						/>
					</label>
					<label>
						Country
						<input
							value={profile.seller.country}
							placeholder="Australia"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, country: e.target.value } }))
							}
						/>
					</label>
					<label>
						Address 1
						<input
							value={profile.seller.address1}
							placeholder="123 Main Street"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, address1: e.target.value } }))
							}
						/>
					</label>
					<label>
						Address 2
						<input
							value={profile.seller.address2}
							placeholder="City State 1234"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, address2: e.target.value } }))
							}
						/>
					</label>
					<label>
						Bank name
						<input
							value={profile.seller.bankName}
							placeholder="Your Business Name"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, bankName: e.target.value } }))
							}
						/>
					</label>
					<label>
						BSB
						<input
							value={profile.seller.bankBsb}
							placeholder="123456"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, bankBsb: e.target.value } }))
							}
						/>
					</label>
					<label>
						Account
						<input
							value={profile.seller.bankAccount}
							placeholder="12345678"
							onChange={(e) =>
								setProfile((p) => ({ ...p, seller: { ...p.seller, bankAccount: e.target.value } }))
							}
						/>
					</label>
				</div>
				<div className="buttons">
					<button type="button" onClick={() => saveProfile(profile)}>
						Save Profile
					</button>
					<button type="button" onClick={() => setProfile(loadProfile() ?? profile)}>
						Load Profile
					</button>
					<button
						type="button"
						onClick={() => {
							clearProfile();
							setProfile((p) => ({ ...p, ...emptyProfile() }));
						}}
					>
						Clear Profile
					</button>
				</div>
				<p className="note">Data is stored only in your browser.</p>
			</fieldset>

			<fieldset>
				<legend>Invoice</legend>
				<div className="grid">
					<label>
						Invoice #
						<input
							value={meta.invoiceNumber}
							onChange={(e) => setMeta((m) => ({ ...m, invoiceNumber: e.target.value }))}
						/>
					</label>
					<label>
						Invoice date
						<input
							type="date"
							value={meta.invoiceDate}
							onChange={(e) => setMeta((m) => ({ ...m, invoiceDate: e.target.value }))}
						/>
					</label>
					<label>
						Due date
						<input
							type="date"
							value={meta.dueDate}
							onChange={(e) => setMeta((m) => ({ ...m, dueDate: e.target.value }))}
						/>
					</label>
					<label>
						Terms
						<input value={meta.terms} onChange={(e) => setMeta((m) => ({ ...m, terms: e.target.value }))} />
					</label>
					<label>
						Subject
						<input
							value={meta.subject}
							onChange={(e) => setMeta((m) => ({ ...m, subject: e.target.value }))}
						/>
					</label>
					<label>
						Client name
						<input
							value={meta.clientName}
							onChange={(e) => setMeta((m) => ({ ...m, clientName: e.target.value }))}
						/>
					</label>
					<label>
						Client NDIS #
						<input
							value={meta.clientNDIS}
							onChange={(e) => setMeta((m) => ({ ...m, clientNDIS: e.target.value }))}
						/>
					</label>
				</div>
			</fieldset>

			<fieldset>
				<legend>Days</legend>
				{days.map((d) => (
					<div className="row" key={d.id}>
						<input type="date" value={d.date} onChange={(e) => updateDay(d.id, { date: e.target.value })} />
						<input
							type="number"
							step="0.25"
							min="0"
							value={d.hours}
							onChange={(e) => updateDay(d.id, { hours: +e.target.value })}
							placeholder="Hours"
						/>
						<input
							type="number"
							step="0.01"
							min="0"
							value={d.hourlyRate}
							onChange={(e) => updateDay(d.id, { hourlyRate: +e.target.value })}
							placeholder="Hourly rate"
						/>
						<input
							type="number"
							step="0.1"
							min="0"
							value={d.km}
							onChange={(e) => updateDay(d.id, { km: +e.target.value })}
							placeholder="KM"
						/>
						<input
							type="number"
							step="0.01"
							min="0"
							value={d.kmRate}
							onChange={(e) => updateDay(d.id, { kmRate: +e.target.value })}
							placeholder="KM rate"
						/>
						<button type="button" onClick={() => removeDay(d.id)}>
							Remove
						</button>
					</div>
				))}
				<button type="button" onClick={addDay}>
					Add day
				</button>
			</fieldset>

			<div className="totals">
				<div>
					Services: <b>{formatMoney(totals.service)}</b>
				</div>
				<div>
					Travel: <b>{formatMoney(totals.travel)}</b>
				</div>
				<div>
					Total: <b>{formatMoney(totals.total)}</b>
				</div>
			</div>

			<fieldset>
				<legend>Actions</legend>
				<div className="buttons">
					<button type="button" onClick={() => onChange(meta, profile.seller, days)} disabled={!valid()}>
						Refresh preview
					</button>
					<span className="hint">
						{valid() ? '' : 'Fill seller, client and at least one day to enable download'}
					</span>
				</div>
			</fieldset>
		</div>
	);
}
