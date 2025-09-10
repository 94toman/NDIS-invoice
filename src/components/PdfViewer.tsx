'use client';
import dynamic from 'next/dynamic';
import { DayEntry, InvoiceMeta, Seller } from '@/lib/types';

type Props = {
	meta: InvoiceMeta;
	seller: Seller;
	days: DayEntry[];
};

// Use Next.js dynamic import with proper SSR disabling
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

export default function PdfViewer(props: Props) {
	// Safety check for props
	if (!props.days || props.days.length === 0) {
		return (
			<div
				style={{
					height: '80vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: '1px solid #ddd',
					borderRadius: 6,
					color: '#666',
				}}
			>
				Add at least one day to see preview
			</div>
		);
	}

	return <PdfPreview {...props} />;
}
