import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Premium Todo",
  description: "SaaS Style Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}