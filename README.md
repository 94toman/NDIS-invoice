# NDIS Invoice Builder

A professional invoice generator for NDIS (National Disability Insurance Scheme) support work in Australia.

## Features

-   **Professional PDF Generation**: Create clean, professional invoices using React PDF
-   **NDIS Compliance**: Designed specifically for Australian NDIS support work
-   **Local Storage**: All data stays in your browser - no servers involved
-   **Real-time Preview**: See your invoice as you build it
-   **Profile Management**: Save and reuse your business details
-   **Australian Formatting**: Proper currency, date, and business formatting

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/94toman/ndis-invoice.git
cd ndis-invoice
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Fill in your business details** in the Seller Profile section
2. **Add invoice information** including client details and NDIS number
3. **Add work days** with hours, rates, and travel distance
4. **Preview your invoice** in real-time
5. **Download PDF** when ready

## Technology Stack

-   **Next.js 15** - React framework
-   **TypeScript** - Type safety
-   **@react-pdf/renderer** - PDF generation
-   **date-fns** - Date formatting
-   **localStorage** - Data persistence

## Privacy

All data is stored locally in your browser. No information is sent to any servers.

## License

MIT License
