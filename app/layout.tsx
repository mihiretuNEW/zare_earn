export const metadata = {
  title: "ZareEarn Bot",
  description: "Telegram webhook bot running on Vercel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
