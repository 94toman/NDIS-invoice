'use client';
import dynamic from 'next/dynamic';
import { DayEntry, InvoiceMeta, Seller } from '@/lib/types';

const PdfPreview = dynamic(() => import('./PdfInvoice').then((mod) => ({ default: mod.PdfPreview })), {
	ssr: false,
	loading: () => (
		<div
			style={{
				height: '80vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				border: '1px solid #ddd',
				borderRadius: 6,
			}}
		>
			Loading PDF preview...
		</div>
	),
});

type Props = {
	meta: InvoiceMeta;
	seller: Seller;
	days: DayEntry[];
};

export default function PdfViewer(props: Props) {
	return <PdfPreview {...props} />;
}
