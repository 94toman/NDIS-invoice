'use client';
import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceMeta, Seller, DayEntry } from '@/lib/types';
import { formatMoney, formatHeaderDate, formatDescDate } from '@/lib/format';

const styles = StyleSheet.create({
	page: { padding: 32, fontSize: 11, fontFamily: 'Helvetica' },
	row: { flexDirection: 'row', justifyContent: 'space-between' },
	h1: { fontSize: 18, fontWeight: 700 },
	small: { fontSize: 10, color: '#555' },
	section: { marginTop: 12 },
	card: { padding: 10, border: '1px solid #ddd', borderRadius: 4 },
	table: { marginTop: 10 },
	th: { fontWeight: 700, borderBottom: '1px solid #ddd', paddingVertical: 6 },
	td: { paddingVertical: 6, borderBottom: '1px solid #eee' },
	right: { textAlign: 'right' },
	bold: { fontWeight: 700 },
	spacer: { height: 6 },
});

type Props = {
	meta: InvoiceMeta;
	seller: Seller;
	days: DayEntry[];
};

export function PdfInvoice({ meta, seller, days }: Props) {
	// Safety checks
	if (!days || days.length === 0) {
		return (
			<Document>
				<Page size="A4" style={styles.page}>
					<Text>No days to display</Text>
				</Page>
			</Document>
		);
	}

	const lineItems = [];
	let idx = 1;
	let sub = 0;

	for (const d of days) {
		// Safety check for each day
		if (
			!d ||
			typeof d.hours !== 'number' ||
			typeof d.hourlyRate !== 'number' ||
			typeof d.km !== 'number' ||
			typeof d.kmRate !== 'number'
		) {
			continue;
		}

		const serviceAmount = d.hours * d.hourlyRate;
		const travelAmount = d.km * d.kmRate;
		sub += serviceAmount + travelAmount;

		lineItems.push({
			no: idx++,
			desc: `Access community res and social (${formatDescDate(d.date)})`,
			qty: d.hours.toFixed(2),
			rate: d.hourlyRate.toFixed(2),
			amount: serviceAmount,
		});
		lineItems.push({
			no: idx++,
			desc: `Transport (KM traveled) ${formatDescDate(d.date)}`,
			qty: d.km.toFixed(2),
			rate: d.kmRate.toFixed(2),
			amount: travelAmount,
		});
	}

	const total = sub;
	const balanceDue = total;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={[styles.row, { alignItems: 'flex-start' }]}>
					<View style={{ width: '55%' }}>
						<Text style={styles.h1}>Tax Invoice</Text>
						<View style={styles.spacer} />
						<Text>{seller.name}</Text>
						<Text>{seller.address1}</Text>
						<Text>{seller.address2}</Text>
						<Text>{seller.country}</Text>
						<Text>ABN {seller.abn}</Text>
						<Text>{seller.email}</Text>
					</View>

					<View style={{ width: '40%' }}>
						<View style={[styles.card]}>
							<View style={styles.row}>
								<Text style={styles.bold}>#</Text>
								<Text>{meta.invoiceNumber}</Text>
							</View>
							<View style={styles.row}>
								<Text>Invoice Date</Text>
								<Text>{formatHeaderDate(meta.invoiceDate)}</Text>
							</View>
							<View style={styles.row}>
								<Text>Terms</Text>
								<Text>{meta.terms}</Text>
							</View>
							<View style={styles.row}>
								<Text>Due Date</Text>
								<Text>{formatHeaderDate(meta.dueDate)}</Text>
							</View>
						</View>
						<View style={[styles.card, { marginTop: 8 }]}>
							<View style={styles.row}>
								<Text style={styles.bold}>Balance Due</Text>
								<Text style={[styles.bold]}>{formatMoney(balanceDue)}</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Client and subject */}
				<View style={styles.section}>
					<Text style={styles.bold}>
						{meta.clientName}, NDIS#: {meta.clientNDIS}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.bold}>Subject :</Text>
					<Text>{meta.subject}</Text>
				</View>

				{/* Table */}
				<View style={[styles.section, styles.table]}>
					<View style={[styles.row, styles.th]}>
						<Text style={{ width: '8%' }}>#</Text>
						<Text style={{ width: '52%' }}>Description</Text>
						<Text style={[{ width: '12%' }, styles.right]}>Qty</Text>
						<Text style={[{ width: '14%' }, styles.right]}>Rate</Text>
						<Text style={[{ width: '14%' }, styles.right]}>Amount</Text>
					</View>

					{lineItems.map((it, i) => (
						<View key={i} style={[styles.row, styles.td]}>
							<Text style={{ width: '8%' }}>{it.no}</Text>
							<Text style={{ width: '52%' }}>{it.desc}</Text>
							<Text style={[{ width: '12%' }, styles.right]}>{it.qty}</Text>
							<Text style={[{ width: '14%' }, styles.right]}>{it.rate}</Text>
							<Text style={[{ width: '14%' }, styles.right]}>{formatMoney(it.amount)}</Text>
						</View>
					))}
				</View>

				{/* Totals */}
				<View style={[styles.section, { alignItems: 'flex-end' }]}>
					<View style={{ width: '40%' }}>
						<View style={styles.row}>
							<Text>Sub Total</Text>
							<Text>{formatMoney(sub)}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.bold}>Total</Text>
							<Text style={styles.bold}>{formatMoney(total)}</Text>
						</View>
						<View style={styles.row}>
							<Text>Balance Due</Text>
							<Text>{formatMoney(balanceDue)}</Text>
						</View>
					</View>
				</View>

				{/* Payment block */}
				<View style={[styles.section, styles.card]}>
					<Text style={styles.bold}>Please make payment to:</Text>
					<Text>{seller.bankName}</Text>
					<Text>BSB {seller.bankBsb}</Text>
					<Text>Account {seller.bankAccount}</Text>
				</View>
			</Page>
		</Document>
	);
}

export function PdfPreview(props: Props) {
	// This component will only render on client side due to Next.js dynamic import
	return (
		<div style={{ width: '100%', height: '80vh', border: '1px solid #ddd', borderRadius: 6 }}>
			<ClientPdfViewer {...props} />
		</div>
	);
}

function ClientPdfViewer(props: Props) {
	const [PDFViewer, setPDFViewer] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Dynamically import PDFViewer only on client side
		import('@react-pdf/renderer')
			.then((mod) => {
				setPDFViewer(() => mod.PDFViewer);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Failed to load PDFViewer:', error);
				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				Loading PDF viewer...
			</div>
		);
	}

	if (!PDFViewer) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#666',
				}}
			>
				Failed to load PDF viewer
			</div>
		);
	}

	return (
		<PDFViewer style={{ width: '100%', height: '100%' }}>
			<PdfInvoice {...props} />
		</PDFViewer>
	);
}
