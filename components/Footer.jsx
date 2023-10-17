import Link from "next/link";

export default function Footer() {
  const links = [
    {
      href: "https://www.emvco.com/emv-technologies/qr-codes/",
      label: "EMVCo",
    },
    {
      href: "https://www.ecb.europa.eu/paym/groups/erpb/shared/pdf/16th-ERPB-meeting/Standardisation_and_governance_of_QR-codes_for_instant_payments_at_the_point-of-interaction.pdf",
      label: "EPC",
    },
    {
      href: "https://github.com/Rebilly/merchant-category-codes",
      label: "Merchant Category Codes",
    },
    {
      href: "https://restcountries.com/",
      label: "Country API Data",
    },
  ];
  return (
    <div className="w-full flex flex-col items-center text-xs py-10">
      <div className="flex items-center gap-1 ">
        {links.map((link, i) => (
          <div key={link.label}>
            {i == 0 ? " " : " • "}
            <Link href={link.href}>{link.label}</Link>
          </div>
        ))}
      </div>

      <div className="text-sm">By Fariz Rifqi</div>
    </div>
  );
}
