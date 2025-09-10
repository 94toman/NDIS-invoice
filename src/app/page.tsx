'use client';
import { useCallback, useRef, useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import { PdfInvoice } from '@/components/PdfInvoice';
import PdfViewer from '@/components/PdfViewer';
import { DayEntry, InvoiceMeta, Seller } from '@/lib/types';
import { pdf } from '@react-pdf/renderer';

export default function Page() {
	const [meta, setMeta] = useState<InvoiceMeta>({
		invoiceNumber: 'INV-000001',
		invoiceDate: new Date().toISOString().slice(0, 10),
		dueDate: new Date().toISOString().slice(0, 10),
		terms: 'Due on Receipt',
		subject: 'NDIS Support Work',
		clientName: '',
		clientNDIS: '',
	});
	const [seller, setSeller] = useState<Seller>({
		name: '',
		address1: '',
		address2: '',
		country: 'Australia',
		abn: '',
		email: '',
		bankName: '',
		bankBsb: '',
		bankAccount: '',
	});
	const [days, setDays] = useState<DayEntry[]>([]);
	const latest = useRef({ meta, seller, days });

	const handleChange = useCallback((m: InvoiceMeta, s: Seller, d: DayEntry[]) => {
		setMeta(m);
		setSeller(s);
		setDays(d);
		latest.current = { meta: m, seller: s, days: d };
	}, []);

	async function download() {
		const blob = await pdf(<PdfInvoice {...latest.current} />).toBlob();
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${latest.current.meta.invoiceNumber || 'invoice'}.pdf`;
		a.click();
		URL.revokeObjectURL(a.href);
	}

	const ready = Boolean(
		seller.name &&
			seller.abn &&
			seller.email &&
			seller.bankName &&
			seller.bankBsb &&
			seller.bankAccount &&
			meta.clientName &&
			meta.clientNDIS &&
			days.length > 0
	);

	return (
		<main
			style={{
				display: 'grid',
				gap: 24,
				gridTemplateColumns: 'minmax(400px, 600px) 1fr',
				padding: 16,
				minHeight: '100vh',
			}}
		>
			<section style={{ overflow: 'visible', zIndex: 10 }}>
				<h2>NDIS Invoice Builder</h2>
				<p className="hint">Data stays in your browser. No servers involved.</p>
				<InvoiceForm onChange={handleChange} />
				<button onClick={download} disabled={!ready} style={{ marginTop: 12 }}>
					Download PDF
				</button>
				{!ready && <p className="hint">Fill seller, client and at least one day to enable download.</p>}
			</section>
			<section style={{ overflow: 'hidden', position: 'relative' }}>
				<h3>Preview</h3>
				<PdfViewer meta={meta} seller={seller} days={days} />
			</section>
		</main>
	);
}
