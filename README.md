# PlayQRIS

Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data. Upload a QRIS image or paste the raw code to decode merchant information, transaction amounts, tip indicators, and more — all in the browser.

**Live site:** [https://qris.zeranel.dev](https://qris.zeranel.dev)

## Features

- **Decode QRIS** — Upload a QRIS image or paste the raw QRIS string
- **Validate** — Checks CRC-16 checksum and QRIS format compliance
- **View parsed data** — Merchant name, city, postal code, country, currency, transaction amount, tip/fee info
- **Edit & regenerate** — Modify merchant name, city, postal, country, currency, amount, and tip indicator; the QR code updates live with a valid checksum
- **QR code preview** — Generated QR code updates as you edit

## Tech Stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [qrcode-reader](https://github.com/edi9999/qrcode-reader) — QR image decoding
- [CRC-16 CCITT](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) — Checksum validation

## QRIS Standard

This tool follows the [EMVCo QR Code Specification](https://www.emvco.com/emv-technologies/qr-codes/) and the Indonesian QRIS standard defined by Bank Indonesia.

## Data Sources

- [EMVCo](https://www.emvco.com/emv-technologies/qr-codes/) — QR code specification
- [EPC](https://www.ecb.europa.eu/paym/groups/erpb/shared/pdf/16th-ERPB-meeting/Standardisation_and_governance_of_QR-codes_for_instant_payments_at_the_point-of-interaction.pdf) — European Payments Council QR standard
- [Merchant Category Codes](https://github.com/Rebilly/merchant-category-codes) — MCC reference data
- [Rest Countries](https://restcountries.com/) — Country and currency data

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build

```bash
npm run build
npm start
```

## License

MIT
