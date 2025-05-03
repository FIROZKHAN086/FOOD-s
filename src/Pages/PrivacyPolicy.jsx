import React, { useEffect } from 'react';

const PrivacyPolicy = () => {

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [])
    

  return (
    <div className="min-h-screen mt-10 px-6 py-12 bg-white text-gray-800 dark:bg-black dark:text-gray-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
        <p>
          Welcome to Kings Food. We respect your privacy and are committed to protecting your personal data.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
            <p>
              We collect your name, email, phone number, and order details to provide better service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
            <p>
              Your information is used for processing orders, customer support, and service improvements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
            <p>
              We protect your data with advanced security measures including SSL encryption.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Cookies</h2>
            <p>
              We use cookies to improve your experience and for analytics purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
            <p>
              You can request to access, update, or delete your personal data by contacting us.
            </p>
          </div>
        </div>

        <p className="text-center text-sm mt-8">© 2025 Kings Food. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
