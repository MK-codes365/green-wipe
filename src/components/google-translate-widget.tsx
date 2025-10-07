'use client';

import React, { useEffect } from 'react';

// Extend the Window interface to include the google object and the init function
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslateWidget() {
  useEffect(() => {
    // Check if the script already exists to avoid adding it multiple times
    if (document.getElementById('google-translate-script')) {
      // If script exists, but widget is not there, re-initialize
      if (!document.querySelector('.goog-te-gadget')) {
        window.googleTranslateElementInit?.();
      }
      return;
    }

    const googleTranslateElementInit = () => {
      // Ensure google.translate is available before creating the element
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      }
    };

    // Make the initialization function available globally
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Create the script element
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
    script.async = true;

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Clean up the global function
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  return null; // This component does not render anything itself
}

    