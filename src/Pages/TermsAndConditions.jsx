import React, { useEffect } from 'react';

const TermsAndConditions = () => {

    useEffect(() => {
          window.scrollTo(0, 0);
        }, [])

  return (
    <div className="min-h-screen mt-10 px-6 py-12 bg-white text-gray-800 dark:bg-black dark:text-gray-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Terms and Conditions</h1>
        <p>
          By using Kings Food, you agree to abide by these Terms and Conditions. Please read them carefully.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Service Access</h2>
            <p>
              You can access our services through our website. Availability may vary based on location and technical issues.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Orders and Payments</h2>
            <p>
              All orders are subject to availability. Payments must be made through our secure payment gateways.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
            <p>
              You agree to provide accurate information and use our platform for lawful purposes only.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Refunds and Cancellations</h2>
            <p>
              Refunds are subject to our Refund Policy. Cancellation may not always be possible after order confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
            <p>
              We may update these terms occasionally. Users will be notified of significant changes.
            </p>
          </div>
        </div>

        <p className="text-center text-sm mt-8">© 2025 Kings Food. All rights reserved.</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
