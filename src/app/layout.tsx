import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Roboto_Flex } from "next/font/google";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { getProfilePhotoSrc } from "@/services/profile";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-sidebar",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akolangtio | Engineering Portfolio",
  description:
    "Professional full-stack engineering portfolio with Notion-powered project data.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profilePhotoSrc = await getProfilePhotoSrc();

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${robotoFlex.variable} antialiased`}
      >
        <DashboardShell profilePhotoSrc={profilePhotoSrc}>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
