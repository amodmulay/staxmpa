
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - StaxMap',
  description: 'Our privacy policy outlines how we collect, use, and protect your data when you use StaxMap.',
  robots: 'noindex, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="lead">
        Your privacy is important to us. It is StaxMap's policy to respect your privacy regarding any information we may collect from you across our website.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Log Data</h3>
      <p>
        When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your computer’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details.
      </p>
      
      <h3>Analytics</h3>
      <p>
        We use Vercel Analytics to measure website traffic and usage activity. Vercel Analytics is a privacy-first analytics tool that does not use cookies and does not track personal information.
      </p>

      <h3>Advertising</h3>
      <p>
        We use Google AdSense to serve advertisements on our site. Google AdSense may use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting {' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.
      </p>
      
      <h2>2. Legal Basis for Processing</h2>
      <p>
        We will process your personal information lawfully, fairly, and in a transparent manner. We collect and process information about you only where we have legal bases for doing so.
      </p>
      
      <h2>3. Security of Your Information</h2>
      <p>
        We use commercially acceptable means to protect the personal information we collect, to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
      </p>
      
      <h2>4. Your Rights and Controlling Your Information</h2>
      <p>
        You have the right to request access to the personal data we hold about you. You have the right to request that we erase your personal data.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        For any questions or concerns regarding your privacy, you may contact us using the details on our{' '}
        <Link href="/legal/impressum">Legal Notice</Link> page.
      </p>
    </>
  );
}
