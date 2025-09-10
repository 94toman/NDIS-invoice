import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'NDIS Invoice Builder',
	description:
		'Professional invoice generator for NDIS support work in Australia. Create, preview, and download PDF invoices with ease.',
	keywords: ['NDIS', 'invoice', 'Australia', 'PDF', 'support work', 'disability services'],
	authors: [{ name: 'Martin Toman' }],
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon.ico', type: 'image/x-icon' },
		],
	},
	openGraph: {
		title: 'NDIS Invoice Builder',
		description: 'Professional invoice generator for NDIS support work in Australia',
		type: 'website',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
