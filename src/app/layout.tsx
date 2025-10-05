import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Math Training - Mental Calculation App",
  description: "Train your mental calculation skills with diverse time-bound challenges. Improve speed, accuracy, and cognitive agility in arithmetic and basic logic.",
  manifest: "/manifest.json",
  themeColor: "#1E3A8A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Math Training",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/eafc028f-a6b8-46de-ab8f-16d823869841/generated_images/app-icon-for-math-training-mobile-applic-5b8d9a06-20251005160619.jpg",
    apple: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/eafc028f-a6b8-46de-ab8f-16d823869841/generated_images/app-icon-for-math-training-mobile-applic-5b8d9a06-20251005160619.jpg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Math Training" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Math Training" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1E3A8A" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}