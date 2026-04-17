import React from 'react';

/**
 * TermsPage component provides the legal terms and conditions for using the MusicShop platform.
 * It follows a premium typography-first design with clean spacing and subtle gradients.
 */
export default function TermsPage() {
  return (
    <article className="min-h-screen bg-black text-neutral-300 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent blur-3xl -z-10" />
      
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
            Terms of Service
          </h1>
          <p className="text-neutral-500 text-sm">
            Last updated: April 17, 2026
          </p>
        </header>

        <div className="space-y-12 leading-relaxed text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using MusicShop ("the Service"), you agree to the following terms and conditions. 
              If you do not agree to these terms, please refrain from using our platform. Your continued use 
              constitutes a binding legal agreement between you and MusicShop.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. User Conduct</h2>
            <p>
              You agree to use the Service in a manner that is lawful and respectful of other users and copyright owners. 
              Unauthorized duplication of digital assets, harassment of other members, or attempts to circumvent 
              our security measures will result in immediate termination of your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Intellectual Property</h2>
            <p>
              All content provided on MusicShop, including but not limited to audio recordings, cover art, text, 
              and site branding, is the property of MusicShop or its licensed partners. You are granted a 
              limited, non-exclusive license for personal use only. Commercial redistribution is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Payment and Refunds</h2>
            <p>
              All transactions are processed through secure payment gateways. Given the nature of digital goods, 
              refunds are only issued in cases of technical failure or accidental double-billing. Please 
              review our full refund policy before making any high-value purchases.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Limitation of Liability</h2>
            <p>
              MusicShop provides the service on an "as is" basis. We are not liable for any indirect, incidental, 
              or consequential damages resulting from the use or inability to use our services. We strive for 
              100% uptime but do not guarantee uninterrupted access.
            </p>
          </section>

          <footer className="pt-16 border-t border-neutral-800 text-neutral-500 text-sm">
            <p>If you have any questions regarding these terms, please contact our legal department at legal@musicshop.com</p>
          </footer>
        </div>
      </div>
    </article>
  );
}
