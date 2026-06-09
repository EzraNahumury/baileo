import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Baileo — Digital Savings on Celo",
  description:
    "Save CELO, receive BAILEO, and redeem anytime through a transparent on-chain reserve on Celo Mainnet. On-chain savings with no monthly fees.",
  other: {
    "talentapp:project_verification":
      "cffa4211b9598b8e2cc7e4a924f5ca1ca20bb15ed24ebae3404e5d9a002d6849e97f13c36e769bbc3885f2cca6d51235310b627adc241d591afa4010d4b468cd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
