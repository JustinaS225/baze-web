import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import '../../styles/globals.scss'
import { i18n } from "@/i18n-config";
import { ActiveContextProvider } from "@/contexts/ActiveContext";

const merriweather = Merriweather({subsets: ['latin'], weight: ['300', '400', '700', '900']});

export const metadata: Metadata = {
  title: "FAKTŪRA",
  description: "Muzika mums",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {lang: string};
}) {
  return (
    <html lang={params.lang}>
        <ActiveContextProvider>
            <body className={merriweather.className}>
              {children}
            </body>
        </ActiveContextProvider>
    </html>
  )
}
