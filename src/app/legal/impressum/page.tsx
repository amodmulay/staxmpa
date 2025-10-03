
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Notice - StaxMap',
  description: 'Legal notice and publisher information for StaxMap.',
  robots: 'noindex, follow',
};

export default function ImpressumPage() {
  return (
    <>
        <h1>Legal Notice (Impressum)</h1>
        
        <p>
            <strong>[Your Company Name or Your Full Name]</strong>
            <br />
            [Your Street Address]
            <br />
            [Your Postal Code and City]
            <br />
            [Your Country]
        </p>

        <h2>Contact</h2>
        <p>
            <strong>Telephone:</strong> [Your Phone Number]
            <br />
            <strong>Email:</strong> [Your Email Address]
        </p>

        <h2>VAT ID</h2>
        <p>
            <strong>VAT identification number in accordance with §27a of the German Value Added Tax Act:</strong>
            <br />
            [Your VAT ID, if applicable]
        </p>

        <h2>Editorially Responsible</h2>
        <p>
            [Full Name of the person responsible for content]
            <br />
            [Address of the person responsible, if different from above]
        </p>

        <h2>Dispute Resolution</h2>
        <p>
            The European Commission provides a platform for online dispute resolution (ODR):{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr
            </a>
            .
        </p>
        <p>
            We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
        </p>
        
        <p className="text-sm text-muted-foreground mt-12">
            <strong>Please replace all bracketed `[placeholder]` text with your actual information.</strong>
        </p>
    </>
  );
}
