import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Roboto_Flex } from "next/font/google";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { getActiveResume, getProfileSettings } from "@/services/site-content";
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
    "Professional full-stack engineering portfolio with Supabase-powered dynamic content.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profileSettings, activeResume] = await Promise.all([
    getProfileSettings(),
    getActiveResume(),
  ]);

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${robotoFlex.variable} antialiased`}
      >
        <DashboardShell
          profilePhotoSrc={
            profileSettings.profilePhotoSrc || "/images/mecha-profile-photo.svg"
          }
          profileName={profileSettings.name}
          sidebarFootnote={profileSettings.sidebarFootnote}
          dashboardTitle={profileSettings.dashboardTitle}
          dashboardSubtitle={profileSettings.dashboardSubtitle}
          resumeFileUrl={activeResume.fileUrl}
          resumeFileName={activeResume.fileName}
        >
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
