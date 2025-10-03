
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
        
        <h2>Contact Information</h2>
        <p>
            Amod Mulay (LST)
            <br />
            Pippinger Str. 105
            <br />
            81247 München
            <br />
            Germany
        </p>

        <h2>Represented By</h2>
        <p>Amod Mulay (LST)</p>

        <h2>Contact</h2>
        <p>
            <strong>Email:</strong> themvpletter@gmail.com
        </p>

        <h2>Register Entry</h2>
        <p>Private Website - Does not apply</p>
        
        <h2>VAT ID</h2>
        <p>Private Website - Does not apply</p>

        <h2>Dispute Resolution</h2>
        <p>
            The European Commission provides a platform for online dispute resolution (OS):{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr
            </a>
            .
        </p>
        <p>
            We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
        </p>
        
        <h2>Disclaimer - Liability for Content</h2>
        <p>
          As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 para. 1 TMG. According to §§ 8 to 10 TMG, however, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
        </p>

        <h2>Liability for Links</h2>
        <p>
          Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages.
        </p>
        
        <h2>Copyright</h2>
        <p>
          The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.
        </p>
    </>
  );
}
